import { useState } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const IncubateeManagement = ({ incubatees, onCreate, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIncubatee, setEditingIncubatee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSector, setFilterSector] = useState("");
  const [filterBiharStartup, setFilterBiharStartup] = useState("all");

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
      console.error("Error saving incubatee:", error);
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
    const matchesSector =
      !filterSector ||
      inc.sector?.toLowerCase().includes(filterSector.toLowerCase());
    const matchesBihar =
      filterBiharStartup === "all"
        ? true
        : filterBiharStartup === "yes"
        ? inc.registeredWithBiharStartup
        : !inc.registeredWithBiharStartup;
    return matchesQuery && matchesSector && matchesBihar;
  });

  return (
    <div className="space-y-6">
      {/* Header section with Create Button */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">Manage Incubatees ({incubatees.length})</h3>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow transition-colors cursor-pointer border-0"
        >
          Add New Incubatee
        </button>
      </div>

      {/* Advanced Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search startups, founders, descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
          />
        </div>
        <div className="w-full sm:w-48 shrink-0">
          <input
            type="text"
            placeholder="Filter by sector..."
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
          />
        </div>
        <div className="w-full sm:w-48 shrink-0">
          <select
            value={filterBiharStartup}
            onChange={(e) => setFilterBiharStartup(e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
          >
            <option value="all">All Startups</option>
            <option value="yes">Bihar Startup Registered</option>
            <option value="no">Not Registered</option>
          </select>
        </div>
        {(searchQuery || filterSector || filterBiharStartup !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterSector("");
              setFilterBiharStartup("all");
            }}
            className="px-4 py-2.5 text-xs text-orange-500 hover:text-orange-600 font-bold border-0 bg-transparent cursor-pointer"
          >
            Clear Filters
          </button>
        )}
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
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-650 p-1 rounded-lg border-0 bg-transparent cursor-pointer">
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
                    className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-705 hover:bg-slate-50 text-sm font-bold cursor-pointer bg-white"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold disabled:bg-orange-350 flex items-center justify-center min-w-32 cursor-pointer border-0 shadow"
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
                          onClick={() => onDelete(incubatee)}
                          className="p-1.5 text-red-655 hover:bg-red-50 hover:text-red-755 rounded-lg transition-colors border-0 cursor-pointer bg-transparent"
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

export default IncubateeManagement;
