import { useState } from "react";
import { FaEdit, FaTrash, FaImage, FaTimes } from "react-icons/fa";
import { uploadImage } from "../../utils/cloudinary";
import toast from "react-hot-toast";

const EventManagement = ({ events, onCreate, onUpdate, onDelete }) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Validate required fields
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

      const event = {
        ...eventData,
        image: imageUrl,
        date: new Date(eventData.date).toISOString(),
      };

      if (editingEvent) {
        await onUpdate({ ...editingEvent, ...event });
        toast.success("Event updated successfully");
      } else {
        await onCreate(event);
        toast.success("Event created successfully");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error(error.message || "Failed to save event");
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
    setEventData((prev) => ({ ...prev, image: "" }));
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setEventData({
      ...event,
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
    });
    setImagePreview(event.image || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (event) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await onDelete(event.id);
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
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
  };

  return (
    <div className="space-y-8">
      {/* Event Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {editingEvent ? "Edit Event" : "Create New Event"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                placeholder="Event title"
                value={eventData.title}
                onChange={(e) =>
                  setEventData({ ...eventData, title: e.target.value })
                }
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={eventData.date}
                onChange={(e) =>
                  setEventData({ ...eventData, date: e.target.value })
                }
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              placeholder="Event location"
              value={eventData.location}
              onChange={(e) =>
                setEventData({ ...eventData, location: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="text"
              placeholder="Event time (e.g., 10:00 AM - 1:00 PM)"
              value={eventData.time}
              onChange={(e) =>
                setEventData({ ...eventData, time: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              placeholder="Event description"
              value={eventData.description}
              onChange={(e) =>
                setEventData({ ...eventData, description: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Image
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

              {(imagePreview || eventData.image) && (
                <div className="relative mt-2">
                  <img
                    src={imagePreview || eventData.image}
                    alt="Event preview"
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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={eventData.registrationRequired}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  registrationRequired: e.target.checked,
                })
              }
              className="w-4 h-4 text-blue-600 rounded"
              id="registration-required"
            />
            <label htmlFor="registration-required" className="text-gray-700">
              Registration Required
            </label>
          </div>

          {eventData.registrationRequired && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                required={eventData.registrationRequired}
              />
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            {editingEvent && (
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
              ) : editingEvent ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Events List */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No events found. Create your first event above.
        </div>
      )}
    </div>
  );
};

const EventCard = ({ event, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
    {event.image && (
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.alt}
          className="w-full h-full object-cover"
        />
      </div>
    )}
    <div className="p-4 flex-grow">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
      <div className="mt-auto">
        <div className="text-sm text-gray-500 mb-3">
          <div className="font-medium">Date:</div>
          {event.date
            ? new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "No date set"}
        </div>
        <div className="text-sm text-gray-500 mb-3">
          <div className="font-medium">Location:</div>
          {event.location || "Not specified"}
        </div>
        <div className="text-sm text-gray-500 mb-3">
          <div className="font-medium">Time:</div>
          {event.time || "Not specified"}
        </div>
        {event.registrationRequired && event.registrationLink && (
          <div className="mb-3">
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Registration Link
            </a>
          </div>
        )}
      </div>
    </div>
    <div className="p-4 border-t border-gray-100 flex justify-end space-x-2">
      <button
        onClick={() => onEdit(event)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        title="Edit"
      >
        <FaEdit />
      </button>
      <button
        onClick={() => onDelete(event)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
        title="Delete"
      >
        <FaTrash />
      </button>
    </div>
  </div>
);

export default EventManagement;
