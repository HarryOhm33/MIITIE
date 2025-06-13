import { useState } from "react";
import { FaEdit, FaTrash, FaImage, FaTimes } from "react-icons/fa";
import { uploadImage } from "../../utils/cloudinary";
import toast from "react-hot-toast";

const MentorManagement = ({ mentors, onCreate, onUpdate, onDelete }) => {
  const [editingMentor, setEditingMentor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mentorData, setMentorData] = useState({
    name: "",
    role: "",
    designation: "",
    social: "",
    image: "",
    cardPosition: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!mentorData.name || !mentorData.role || !mentorData.designation) {
        toast.error("Please fill all required fields");
        return;
      }

      let imageUrl = mentorData.image;

      // Upload new image if selected
      if (selectedImage) {
        try {
          const uploadResult = await uploadImage(selectedImage);
          imageUrl = uploadResult.url;
        } catch (error) {
          toast.error("Image upload failed");
          return;
        }
      }

      const mentor = {
        ...mentorData,
        image: imageUrl,
        cardPosition: Number(mentorData.cardPosition) || 0,
      };

      if (editingMentor) {
        await onUpdate({ ...editingMentor, ...mentor });
        toast.success("Mentor updated successfully");
      } else {
        await onCreate(mentor);
        toast.success("Mentor created successfully");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving mentor:", error);
      toast.error(error.message || "Failed to save mentor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (mentor) => {
    if (!window.confirm("Are you sure you want to delete this mentor?")) return;

    try {
      await onDelete(mentor.id);
      toast.success("Mentor deleted successfully");
    } catch (error) {
      console.error("Error deleting mentor:", error);
      toast.error("Failed to delete mentor");
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
  };

  return (
    <div className="space-y-8">
      {/* Mentor Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {editingMentor ? "Edit Mentor" : "Add New Mentor"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                placeholder="Mentor name"
                value={mentorData.name}
                onChange={(e) =>
                  setMentorData({ ...mentorData, name: e.target.value })
                }
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <input
                type="text"
                placeholder="Mentor role"
                value={mentorData.role}
                onChange={(e) =>
                  setMentorData({ ...mentorData, role: e.target.value })
                }
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation *
            </label>
            <input
              type="text"
              placeholder="Mentor designation"
              value={mentorData.designation}
              onChange={(e) =>
                setMentorData({ ...mentorData, designation: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Social Link
            </label>
            <input
              type="url"
              placeholder="https://example.com/profile"
              value={mentorData.social}
              onChange={(e) =>
                setMentorData({ ...mentorData, social: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Position
            </label>
            <input
              type="number"
              placeholder="Position in list (0 for default)"
              value={mentorData.cardPosition}
              onChange={(e) =>
                setMentorData({ ...mentorData, cardPosition: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 w-full md:w-auto"
                  >
                    <FaImage className="mr-2" />
                    {selectedImage ? "Change Image" : "Choose Image"}
                  </label>
                </div>
              </div>

              {(imagePreview || mentorData.image) && (
                <div className="relative mt-2">
                  <img
                    src={imagePreview || mentorData.image}
                    alt="Mentor preview"
                    className="h-48 w-full object-contain rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    title="Remove image"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Maximum file size: 5MB. Supported formats: JPG, PNG, GIF.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            {editingMentor && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center min-w-32"
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
                  Processing...
                </span>
              ) : editingMentor ? (
                "Update Mentor"
              ) : (
                "Add Mentor"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Mentors List */}
      {mentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors
            .sort((a, b) => (a.cardPosition || 0) - (b.cardPosition || 0))
            .map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No mentors found. Add your first mentor above.
        </div>
      )}
    </div>
  );
};

const MentorCard = ({ mentor, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
    {mentor.image && (
      <div className="relative h-48 overflow-hidden">
        <img
          src={mentor.image}
          alt={mentor.name}
          className="w-full h-full object-cover"
        />
      </div>
    )}
    <div className="p-4 flex-grow">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{mentor.name}</h2>
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Role:</span> {mentor.role}
      </div>
      <div className="text-sm text-gray-600 mb-3">
        <span className="font-medium">Designation:</span> {mentor.designation}
      </div>
      {mentor.social && (
        <div className="mb-3">
          <a
            href={mentor.social}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Social Profile
          </a>
        </div>
      )}
      <div className="text-xs text-gray-500 mt-2">
        Card Position: {mentor.cardPosition || 0}
      </div>
    </div>
    <div className="p-4 border-t border-gray-100 flex justify-end space-x-2">
      <button
        onClick={() => onEdit(mentor)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        title="Edit"
      >
        <FaEdit />
      </button>
      <button
        onClick={() => onDelete(mentor)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
        title="Delete"
      >
        <FaTrash />
      </button>
    </div>
  </div>
);

export default MentorManagement;
