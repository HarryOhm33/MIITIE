import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "../../../firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import toast from "react-hot-toast";

const AdminIncubatees = () => {
  const [incubatees, setIncubatees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIncubatee, setEditingIncubatee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingIncubatee, setDeletingIncubatee] = useState(null);

  const [formData, setFormData] = useState({
    startupName: "",
    founderName: "",
    coFounderName: "",
    details: "",
    sector: "",
    registeredWithBiharStartup: false,
    website: "",
    instagram: "",
    twitter: "",
    linkedin: "",
  });

  const sortByDateDescending = (items, field) =>
    [...items].sort((a, b) => {
      const getTimestamp = (value) => {
        if (!value) return 0;
        if (typeof value.toDate === "function") return value.toDate().getTime();
        const timestamp = new Date(value).getTime();
        return Number.isNaN(timestamp) ? 0 : timestamp;
      };
      return getTimestamp(b[field]) - getTimestamp(a[field]);
    });

  const fetchIncubatees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "incubatees"));
      const incubateesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIncubatees(sortByDateDescending(incubateesList, "createdAt"));
    } catch (error) {
      console.error("Error fetching incubatees:", error);
      toast.error("Failed to load incubatees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncubatees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateDoc(doc(db, "incubatees", editingIncubatee.id), {
          ...formData,
          updatedAt: new Date(),
        });
        toast.success("Incubatee updated successfully");
      } else {
        const incubateeRef = doc(collection(db, "incubatees"));
        await setDoc(incubateeRef, {
          id: incubateeRef.id,
          ...formData,
          createdAt: new Date(),
          createdBy: auth.currentUser?.uid || "unknown",
        });
        toast.success("Incubatee added successfully");
      }
      await fetchIncubatees();
      resetForm();
    } catch (error) {
      console.error("Error saving incubatee:", error);
      toast.error("Failed to save incubatee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (incubatee) => {
    setIsEditing(true);
    setEditingIncubatee(incubatee);
    setFormData(incubatee);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (incubatee) => {
    setDeletingIncubatee(incubatee);
  };

  const confirmDelete = async () => {
    if (!deletingIncubatee) return;
    try {
      setIsSubmitting(true);
      await deleteDoc(doc(db, "incubatees", deletingIncubatee.id));
      toast.success("Incubatee deleted successfully");
      await fetchIncubatees();
    } catch (error) {
      console.error("Error deleting incubatee:", error);
      toast.error("Failed to delete incubatee");
    } finally {
      setIsSubmitting(false);
      setDeletingIncubatee(null);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingIncubatee(null);
    setFormData({
      startupName: "",
      founderName: "",
      coFounderName: "",
      details: "",
      sector: "",
      registeredWithBiharStartup: false,
      website: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    });
    setIsModalOpen(false);
  };

  const filteredIncubatees = incubatees.filter((inc) => {
    const matchesQuery =
      !searchQuery ||
      inc.startupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.founderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.coFounderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.details?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section with Search and Create Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 shrink-0">Manage Incubatees ({incubatees.length})</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search startups, founders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
          />
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow transition-colors cursor-pointer border-0 shrink-0"
          >
            Add New Incubatee
          </button>
        </div>
      </div>

      {/* Modal form container */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-slate-800">
                  {isEditing ? "Edit Incubatee Details" : "Add New Incubatee"}
                </h2>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg border-0 bg-transparent cursor-pointer">
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Startup Name *
                    </label>
                    <input
                      type="text"
                      name="startupName"
                      value={formData.startupName}
                      onChange={handleInputChange}
                      placeholder="Startup Name"
                      className="input-field w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Founder Name *
                    </label>
                    <input
                      type="text"
                      name="founderName"
                      value={formData.founderName}
                      onChange={handleInputChange}
                      placeholder="Founder Name"
                      className="input-field w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Co-founder Name
                    </label>
                    <input
                      type="text"
                      name="coFounderName"
                      value={formData.coFounderName}
                      onChange={handleInputChange}
                      placeholder="Co-founder Name (optional)"
                      className="input-field w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Sector *
                    </label>
                    <input
                      type="text"
                      name="sector"
                      value={formData.sector}
                      onChange={handleInputChange}
                      placeholder="Sector (e.g. Agri-Tech, Ed-Tech)"
                      className="input-field w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Brief Description *
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Brief description of the startup"
                    className="input-field w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white h-24"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="input-field w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      placeholder="Instagram URL"
                      className="input-field w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      placeholder="Twitter URL"
                      className="input-field w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="LinkedIn URL"
                      className="input-field w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    name="registeredWithBiharStartup"
                    checked={formData.registeredWithBiharStartup}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-slate-200"
                    id="bihar-startup"
                  />
                  <label htmlFor="bihar-startup" className="text-sm font-medium text-slate-700 select-none">
                    Registered with Bihar Startup
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-bold cursor-pointer bg-white"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold disabled:bg-orange-300 flex items-center justify-center min-w-32 cursor-pointer border-0 shadow"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </span>
                    ) : isEditing ? (
                      "Update"
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingIncubatee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingIncubatee(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 p-6 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                <FaTrash className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Delete Incubatee?</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-700">"{deletingIncubatee.startupName}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full mt-6">
                <button
                  onClick={() => setDeletingIncubatee(null)}
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

      {/* Incubatees List Table */}
      {filteredIncubatees.length > 0 ? (
        <div className="overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Startup
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Founder(s)
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider">
                    Bihar Startup
                  </th>
                  <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredIncubatees.map((incubatee) => (
                  <tr key={incubatee.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-bold text-slate-800">
                      {incubatee.startupName}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      <div className="font-semibold">{incubatee.founderName}</div>
                      {incubatee.coFounderName && (
                        <div className="text-xs text-slate-400">Co-founder: {incubatee.coFounderName}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 max-w-xs truncate" title={incubatee.details}>
                      {incubatee.details}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                        {incubatee.sector}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-center">
                      {incubatee.registeredWithBiharStartup ? (
                        <span className="inline-flex px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-400 rounded-full text-xs font-bold">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-center">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => handleEdit(incubatee)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors border-0 cursor-pointer bg-transparent"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(incubatee)}
                          className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border-0 cursor-pointer bg-transparent"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
          No incubatees found. Click "Add New Incubatee" to add one.
        </div>
      )}
    </div>
  );
};

export default AdminIncubatees;
