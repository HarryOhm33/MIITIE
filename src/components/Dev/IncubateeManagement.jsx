import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const IncubateeManagement = ({ incubatees, onCreate, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIncubatee, setEditingIncubatee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        await onUpdate({ ...formData, id: editingIncubatee.id });
      } else {
        await onCreate(formData);
      }
      resetForm();
    } catch (error) {
      console.log(error);
      toast.error(
        isEditing ? "Failed to update incubatee" : "Failed to create incubatee"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (incubatee) => {
    setIsEditing(true);
    setEditingIncubatee(incubatee);
    setFormData(incubatee);
    window.scrollTo({ top: 200, behavior: "smooth" });
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
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">
        {isEditing ? "Edit Incubatee Details" : "Add New Incubatee"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="startupName"
            value={formData.startupName}
            onChange={handleInputChange}
            placeholder="Startup Name"
            className="input-field"
            required
          />
          <input
            type="text"
            name="founderName"
            value={formData.founderName}
            onChange={handleInputChange}
            placeholder="Founder Name"
            className="input-field"
            required
          />
          <input
            type="text"
            name="coFounderName"
            value={formData.coFounderName}
            onChange={handleInputChange}
            placeholder="Co-founder Name (optional)"
            className="input-field"
          />
          <input
            type="text"
            name="sector"
            value={formData.sector}
            onChange={handleInputChange}
            placeholder="Sector"
            className="input-field"
            required
          />
        </div>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleInputChange}
          placeholder="Brief Description"
          className="input-field w-full h-24"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="Website URL"
            className="input-field"
          />
          <input
            type="url"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
            placeholder="Instagram URL"
            className="input-field"
          />
          <input
            type="url"
            name="twitter"
            value={formData.twitter}
            onChange={handleInputChange}
            placeholder="Twitter URL"
            className="input-field"
          />
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
            placeholder="LinkedIn URL"
            className="input-field"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="registeredWithBiharStartup"
            checked={formData.registeredWithBiharStartup}
            onChange={handleInputChange}
            className="h-4 w-4 text-orange-500"
          />
          <label className="text-sm text-gray-600">
            Registered with Bihar Startup
          </label>
        </div>
        <div className="flex justify-end gap-2">
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
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
            ) : isEditing ? (
              "Update Incubatee"
            ) : (
              "Add Incubatee"
            )}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Startup
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Founder(s)
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Sector
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                Bihar Startup
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {incubatees.map((incubatee) => (
              <tr key={incubatee.id} className="hover:bg-orange-50">
                <td className="px-4 py-3 text-sm">{incubatee.startupName}</td>
                <td className="px-4 py-3 text-sm">
                  {incubatee.founderName}
                  {incubatee.coFounderName && `, ${incubatee.coFounderName}`}
                </td>
                <td className="px-4 py-3 text-sm">{incubatee.details}</td>
                <td className="px-4 py-3 text-sm">{incubatee.sector}</td>
                <td className="px-4 py-3 text-sm text-center">
                  {incubatee.registeredWithBiharStartup ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(incubatee)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(incubatee.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncubateeManagement;
