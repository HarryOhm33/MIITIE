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

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const AdminEvents = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: "",
    time: "",
    description: "",
    image: "",
    alt: "event-img",
    registrationRequired: false,
    registrationLink: "",
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

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(sortByDateDescending(eventsList, "date"));
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (
        !eventData.title ||
        !eventData.date ||
        !eventData.location ||
        !eventData.description ||
        !eventData.time
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      let imageUrl = eventData.image;
      let imagePublicId = editingEvent?.imagePublicId || "";

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

      const { previousImagePublicId: _previousImagePublicId, ...eventFields } = eventData;
      const event = {
        ...eventFields,
        image: imageUrl,
        imagePublicId,
        date: new Date(eventData.date).toISOString(),
      };

      if (editingEvent) {
        const previousImagePublicId =
          editingEvent.imagePublicId && editingEvent.imagePublicId !== imagePublicId
            ? editingEvent.imagePublicId
            : null;
        await updateDoc(doc(db, "events", editingEvent.id), {
          ...event,
          ...(previousImagePublicId ? { previousImagePublicId } : {}),
          updatedAt: new Date(),
        });
        if (previousImagePublicId) {
          try {
            await deleteReplacedImage("events", editingEvent.id);
          } catch (cleanupError) {
            console.error("Failed to delete the previous event image:", cleanupError);
            toast.error("Event updated, but its previous image could not be deleted");
          }
        }
        toast.success("Event updated successfully");
      } else {
        const eventRef = doc(collection(db, "events"));
        await setDoc(eventRef, {
          id: eventRef.id,
          ...event,
          createdAt: new Date(),
          createdBy: auth.currentUser?.uid || "unknown",
        });
        toast.success("Event created successfully");
      }

      await fetchEvents();
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
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
    setEventData((prev) => ({ ...prev, image: "" }));
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setEventData({
      ...event,
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
    });
    setImagePreview(event.image || null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (event) => {
    setDeletingEvent(event);
  };

  const confirmDelete = async () => {
    if (!deletingEvent) return;
    try {
      setIsSubmitting(true);
      await deleteDocumentWithImage("events", deletingEvent.id);
      toast.success("Event deleted successfully");
      await fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setIsSubmitting(false);
      setDeletingEvent(null);
    }
  };

  const resetForm = () => {
    setEventData({
      title: "",
      date: "",
      location: "",
      time: "",
      description: "",
      image: "",
      alt: "event-img",
      registrationRequired: false,
      registrationLink: "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    setEditingEvent(null);
    setIsModalOpen(false);
  };

  const filteredEvents = events.filter((event) => {
    const matchesQuery =
      !searchQuery ||
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase());
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
        <h3 className="text-lg font-bold text-slate-800 shrink-0">Manage Events ({events.length})</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search events..."
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
            Add New Event
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
                  {editingEvent ? "Edit Event Details" : "Create New Event"}
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
                      Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Event title"
                      value={eventData.title}
                      onChange={(e) =>
                        setEventData({ ...eventData, title: e.target.value })
                      }
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={eventData.date}
                      onChange={(e) =>
                        setEventData({ ...eventData, date: e.target.value })
                      }
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      placeholder="Event location"
                      value={eventData.location}
                      onChange={(e) =>
                        setEventData({ ...eventData, location: e.target.value })
                      }
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Time *
                    </label>
                    <input
                      type="text"
                      placeholder="Event time (e.g. 10:00 AM - 1:00 PM)"
                      value={eventData.time}
                      onChange={(e) =>
                        setEventData({ ...eventData, time: e.target.value })
                      }
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Description *
                  </label>
                  <textarea
                    placeholder="Event description"
                    value={eventData.description}
                    onChange={(e) =>
                      setEventData({ ...eventData, description: e.target.value })
                    }
                    rows="4"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Event Image
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
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
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

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    checked={eventData.registrationRequired}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        registrationRequired: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400 border-slate-200"
                    id="registration-required"
                  />
                  <label htmlFor="registration-required" className="text-sm font-medium text-slate-700 select-none">
                    Registration Required
                  </label>
                </div>

                {eventData.registrationRequired && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Registration Link *
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/register"
                      value={eventData.registrationLink}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          registrationLink: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                      required={eventData.registrationRequired}
                    />
                  </div>
                )}

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
                    ) : editingEvent ? (
                      "Update"
                    ) : (
                      "Create"
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
        {deletingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingEvent(null)}
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
              <h3 className="text-lg font-bold text-slate-800">Delete Event?</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-700">"{deletingEvent.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full mt-6">
                <button
                  onClick={() => setDeletingEvent(null)}
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

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
          No events found. Click "Add New Event" to create one.
        </div>
      )}
    </div>
  );
};

const EventCard = ({ event, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
    {event.image && (
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={event.image}
          alt={event.alt}
          className="w-full h-full object-cover"
        />
      </div>
    )}
    <div className="p-5 flex-grow flex flex-col">
      <h4 className="text-lg font-bold text-slate-800 mb-2 leading-snug">{event.title}</h4>
      <p className="text-slate-500 text-xs line-clamp-3 mb-4 leading-relaxed">{event.description}</p>
      
      <div className="mt-auto space-y-2 border-t border-slate-50 pt-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-400">Date</span>
          <span className="text-slate-700 font-medium">
            {event.date ? formatDate(event.date) : "No date set"}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-400">Location</span>
          <span className="text-slate-700 font-medium truncate max-w-[150px]" title={event.location}>
            {event.location || "Not specified"}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-400">Time</span>
          <span className="text-slate-700 font-medium">{event.time || "Not specified"}</span>
        </div>
        {event.registrationRequired && event.registrationLink && (
          <div className="pt-2 text-center">
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-bold text-orange-500 hover:text-orange-600 gap-1 hover:underline"
            >
              <span>View Registration Link</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </div>
    </div>
    
    <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-2.5">
      <button
        onClick={() => onEdit(event)}
        className="p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors border-0 cursor-pointer bg-transparent"
        title="Edit"
      >
        <FaEdit className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(event)}
        className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border-0 cursor-pointer bg-transparent"
        title="Delete"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default AdminEvents;
