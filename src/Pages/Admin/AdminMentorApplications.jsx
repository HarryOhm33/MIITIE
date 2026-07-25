import { useState, useEffect } from "react";
import {
  FaSearch,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaGraduationCap,
  FaLinkedin,
  FaEye,
  FaTimes,
  FaUserGraduate,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const AdminMentorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);
  const [deletingApp, setDeletingApp] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "mentor_applications"));
      const apps = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      // Sort by newest first
      apps.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setApplications(apps);
    } catch (error) {
      console.error("Error fetching mentor applications:", error);
      toast.error("Failed to load mentor applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleToggleStatus = async (app) => {
    const newStatus = app.status === "Reviewed" ? "Pending" : "Reviewed";
    try {
      await updateDoc(doc(db, "mentor_applications", app.id), {
        status: newStatus,
      });
      setApplications((prev) =>
        prev.map((item) => (item.id === app.id ? { ...item, status: newStatus } : item))
      );
      toast.success(`Application marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!deletingApp) return;
    try {
      setIsSubmitting(true);
      await deleteDoc(doc(db, "mentor_applications", deletingApp.id));
      toast.success("Application deleted successfully");
      setApplications((prev) => prev.filter((item) => item.id !== deletingApp.id));
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    } finally {
      setIsSubmitting(false);
      setDeletingApp(null);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.profession?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.expertise?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <FaUserGraduate className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Mentor Applications</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Review and manage mentor network membership applications</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by applicant or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {["All", "Pending", "Reviewed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                  statusFilter === status
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setDeletingApp(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                <FaTrash className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Delete Application?</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Are you sure you want to delete the application from <span className="font-semibold text-slate-700">"{deletingApp.name}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full mt-6">
                <button
                  onClick={() => setDeletingApp(null)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-bold cursor-pointer bg-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold cursor-pointer border-0 shadow disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 relative z-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedApp.name}</h3>
                  <p className="text-xs text-orange-500 font-medium">{selectedApp.profession || "Mentor Applicant"}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 border-0 cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Email</span>
                    <a href={`mailto:${selectedApp.email}`} className="text-slate-800 font-medium hover:text-orange-500">
                      {selectedApp.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Phone</span>
                    <span className="text-slate-800 font-medium">{selectedApp.phone || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Experience</span>
                    <span className="text-slate-800 font-medium">{selectedApp.experience || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">LinkedIn Profile</span>
                    {selectedApp.linkedin ? (
                      <a href={selectedApp.linkedin} target="_blank" rel="noreferrer" className="text-orange-500 hover:underline font-medium truncate block">
                        {selectedApp.linkedin}
                      </a>
                    ) : (
                      <span className="text-slate-400">Not provided</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Key Expertise</span>
                  <div className="p-3 bg-slate-50 rounded-xl font-medium text-slate-800">
                    {selectedApp.expertise || "Not specified"}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Motivation / Statement</span>
                  <p className="p-4 bg-slate-50 rounded-xl leading-relaxed whitespace-pre-wrap text-slate-700">
                    {selectedApp.motivation || "No statement provided."}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => {
                    handleToggleStatus(selectedApp);
                    setSelectedApp((prev) => ({
                      ...prev,
                      status: prev.status === "Reviewed" ? "Pending" : "Reviewed",
                    }));
                  }}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer border-0"
                >
                  Mark as {selectedApp.status === "Reviewed" ? "Pending" : "Reviewed"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Applications Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto" />
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span
                    onClick={() => handleToggleStatus(app)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                      app.status === "Reviewed"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    }`}
                  >
                    {app.status === "Reviewed" ? <FaCheckCircle className="w-3 h-3" /> : <FaClock className="w-3 h-3" />}
                    {app.status || "Pending"}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {formatDate(app.createdAt)}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-slate-800 mb-1">{app.name}</h4>
                <p className="text-xs text-orange-500 font-medium mb-3">{app.profession || "Applicant"}</p>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
                  <div className="flex items-center gap-2 truncate">
                    <FaEnvelope className="text-slate-400 shrink-0" />
                    <span className="truncate">{app.email}</span>
                  </div>
                  {app.phone && (
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-slate-400 shrink-0" />
                      <span>{app.phone}</span>
                    </div>
                  )}
                  {app.expertise && (
                    <div className="flex items-center gap-2 truncate">
                      <FaGraduationCap className="text-slate-400 shrink-0" />
                      <span className="truncate">{app.expertise}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-slate-50 pt-4 mt-2">
                <button
                  onClick={() => setSelectedApp(app)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border-0 transition-colors"
                >
                  <FaEye className="w-3.5 h-3.5" /> View Details
                </button>
                <button
                  onClick={() => setDeletingApp(app)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border-0"
                  title="Delete Application"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
          No mentor applications found matching your search.
        </div>
      )}
    </div>
  );
};

export default AdminMentorApplications;
