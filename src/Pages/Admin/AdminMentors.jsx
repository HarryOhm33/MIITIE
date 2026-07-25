import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaImage, FaTimes } from "react-icons/fa";
import { uploadImage } from "../../utils/cloudinary";
import { deleteDocumentWithImage, deleteReplacedImage } from "../../utils/imageCleanup";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "../../../firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";

const AdminMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMentor, setEditingMentor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingMentor, setDeletingMentor] = useState(null);

  const [mentorData, setMentorData] = useState({
    name: "",
    role: "",
    designation: "",
    social: "",
    image: "",
    cardPosition: 0,
  });

  const fetchMentors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "mentors"));
      const mentorsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMentors(mentorsList);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      toast.error("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (!mentorData.name || !mentorData.role || !mentorData.designation) {
        toast.error("Please fill all required fields");
        return;
      }

      let imageUrl = mentorData.image;
      let imagePublicId = editingMentor?.imagePublicId || "";

      if (selectedImage) {
        try {
          const uploadResult = await uploadImage(selectedImage);
          imageUrl = uploadResult.url;
          imagePublicId = uploadResult.publicId;
        } catch (error) {
          toast.error("Image upload failed");
          return;
        }
      }
      if (!imageUrl) imagePublicId = "";

      const mentor = {
        ...mentorData,
        image: imageUrl,
        imagePublicId,
        cardPosition: Number(mentorData.cardPosition) || 0,
      };

      if (editingMentor) {
        const previousImagePublicId =
          editingMentor.imagePublicId && editingMentor.imagePublicId !== imagePublicId
            ? editingMentor.imagePublicId
            : null;
        await updateDoc(doc(db, "mentors", editingMentor.id), {
          ...mentor,
          ...(previousImagePublicId ? { previousImagePublicId } : {}),
          updatedAt: new Date(),
        });
        if (previousImagePublicId) {
          try {
            await deleteReplacedImage("mentors", editingMentor.id);
          } catch (cleanupError) {
            console.error("Failed to delete the previous mentor image:", cleanupError);
            toast.error("Mentor updated, but its previous image could not be deleted");
          }
        }
        toast.success("Mentor updated successfully");
      } else {
        const mentorRef = doc(collection(db, "mentors"));
        await setDoc(mentorRef, {
          id: mentorRef.id,
          ...mentor,
          createdAt: new Date(),
          createdBy: auth.currentUser?.uid || "unknown",
        });
        toast.success("Mentor added successfully");
      }

      await fetchMentors();
      resetForm();
    } catch (error) {
      console.error("Error saving mentor:", error);
      toast.error("Failed to save mentor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file (JPG, PNG, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setMentorData((prev) => ({ ...prev, image: "" }));
  };

  const handleEdit = (mentor) => {
    setEditingMentor(mentor);
    setMentorData({
      name: mentor.name || "",
      role: mentor.role || "",
      designation: mentor.designation || "",
      social: mentor.social || "",
      image: mentor.image || "",
      cardPosition: mentor.cardPosition || 0,
    });
    setImagePreview(mentor.image || null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (mentor) => {
    setDeletingMentor(mentor);
  };

  const confirmDelete = async () => {
    if (!deletingMentor) return;
    try {
      setIsSubmitting(true);
      await deleteDocumentWithImage("mentors", deletingMentor.id);
      toast.success("Mentor deleted successfully");
      await fetchMentors();
    } catch (error) {
      console.error("Error deleting mentor:", error);
      toast.error("Failed to delete mentor");
    } finally {
      setIsSubmitting(false);
      setDeletingMentor(null);
    }
  };

  const resetForm = () => {
    setMentorData({
      name: "",
      role: "",
      designation: "",
      social: "",
      image: "",
      cardPosition: 0,
    });
    setSelectedImage(null);
    setImagePreview(null);
    setEditingMentor(null);
    setIsModalOpen(false);
  };

  const filteredMentors = mentors.filter((mentor) => {
    const matchesQuery =
      !searchQuery ||
      mentor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.designation?.toLowerCase().includes(searchQuery.toLowerCase());
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
        <h3 className="text-lg font-bold text-slate-800 shrink-0">Manage Mentors ({mentors.length})</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search mentors..."
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
            Add New Mentor
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
                  {editingMentor ? "Edit Mentor Details" : "Add New Mentor"}
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
                      Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Mentor name"
                      value={mentorData.name}
                      onChange={(e) =>
                        setMentorData({ ...mentorData, name: e.target.value })
                      }
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Role *
                    </label>
                    <input
                      type="text"
                      placeholder="Mentor role (e.g. Advisor, Consultant)"
                      value={mentorData.role}
                      onChange={(e) =>
                        setMentorData({ ...mentorData, role: e.target.value })
                      }
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    placeholder="Mentor designation (e.g. Professor at IIT, VP at Company)"
                    value={mentorData.designation}
                    onChange={(e) =>
                      setMentorData({ ...mentorData, designation: e.target.value })
                    }
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Social Link
                    </label>
                    <input
                      type="url"
                      placeholder="Social Profile URL"
                      value={mentorData.social}
                      onChange={(e) =>
                        setMentorData({ ...mentorData, social: e.target.value })
                      }
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Card Position
                    </label>
                    <input
                      type="number"
                      placeholder="Position (e.g. 1, 2, 3)"
                      value={mentorData.cardPosition}
                      onChange={(e) =>
                        setMentorData({ ...mentorData, cardPosition: e.target.value })
                      }
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Profile Image
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <label className="flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 focus-within:ring-2 focus-within:ring-orange-400">
                      <FaImage className="w-5 h-5 text-slate-400 mr-2" />
                      <span className="text-sm font-semibold text-slate-700">Choose Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors border-0 cursor-pointer"
                          title="Remove image"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Maximum file size: 5MB. Supported formats: JPG, PNG, GIF.
                  </p>
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
                    ) : editingMentor ? (
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
        {deletingMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingMentor(null)}
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
              <h3 className="text-lg font-bold text-slate-800">Delete Mentor?</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-700">"{deletingMentor.name}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full mt-6">
                <button
                  onClick={() => setDeletingMentor(null)}
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

      {/* Mentors List Grid */}
      {filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors
            .sort((a, b) => (a.cardPosition || 0) - (b.cardPosition || 0))
            .map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
          No mentors found. Click "Add New Mentor" to add one.
        </div>
      )}
    </div>
  );
};

const MentorCard = ({ mentor, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col items-center text-center p-6 relative">
    {mentor.image ? (
      <div className="relative w-28 h-28 mb-4 shrink-0 shadow-md rounded-full border-4 border-orange-100/60 overflow-hidden bg-slate-50">
        <img
          src={mentor.image}
          alt={mentor.name}
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <div className="w-28 h-28 mb-4 shrink-0 rounded-full border-4 border-orange-100/60 bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-2xl uppercase">
        {mentor.name?.substring(0, 2) || "M"}
      </div>
    )}
    
    <div className="flex-grow w-full">
      <h4 className="text-base font-bold text-slate-800 tracking-tight leading-snug">{mentor.name}</h4>
      <p className="text-xs font-semibold text-orange-500 mt-1 uppercase tracking-wider">{mentor.role}</p>
      <p className="text-slate-500 text-xs mt-2 leading-relaxed min-h-[36px] line-clamp-2">{mentor.designation}</p>

      {mentor.social && (
        <div className="mt-4">
          <a
            href={mentor.social}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 gap-1 hover:underline"
          >
            <span>Social Profile</span>
            <span>↗</span>
          </a>
        </div>
      )}
      
      <div className="mt-3 text-[10px] text-slate-400 font-medium bg-slate-50 inline-block px-2.5 py-1 rounded-full">
        Position Order: {mentor.cardPosition || 0}
      </div>
    </div>

    <div className="mt-6 pt-4 border-t border-slate-50 w-full flex justify-end gap-2">
      <button
        onClick={() => onEdit(mentor)}
        className="p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors border-0 cursor-pointer bg-transparent"
        title="Edit"
      >
        <FaEdit className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(mentor)}
        className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border-0 cursor-pointer bg-transparent"
        title="Delete"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default AdminMentors;
