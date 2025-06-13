import { useState } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { uploadImage } from "../../utils/cloudinary";
import toast from "react-hot-toast";

const NotificationManagement = ({
  notifications,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [editingNotification, setEditingNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: "",
    description: "",
    isImportant: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!notificationData.title || !notificationData.description) {
        toast.error("Please fill all required fields");
        return;
      }

      const notification = {
        ...notificationData,
        createdAt: new Date().toISOString(),
      };

      if (editingNotification) {
        await onUpdate({ ...editingNotification, ...notification });
        toast.success("Notification updated successfully");
      } else {
        await onCreate(notification);
        toast.success("Notification created successfully");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving notification:", error);
      toast.error(error.message || "Failed to save notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setNotificationData({
      title: notification.title || "",
      description: notification.description || "",
      isImportant: notification.isImportant || false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (notification) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;

    try {
      await onDelete(notification.id);
      toast.success("Notification deleted successfully");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const resetForm = () => {
    setNotificationData({
      title: "",
      description: "",
      isImportant: false,
    });
    setEditingNotification(null);
  };

  return (
    <div className="space-y-8">
      {/* Notification Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {editingNotification
            ? "Edit Notification"
            : "Create New Notification"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              placeholder="Notification title"
              value={notificationData.title}
              onChange={(e) =>
                setNotificationData({
                  ...notificationData,
                  title: e.target.value,
                })
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
              placeholder="Notification description"
              value={notificationData.description}
              onChange={(e) =>
                setNotificationData({
                  ...notificationData,
                  description: e.target.value,
                })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notificationData.isImportant}
              onChange={(e) =>
                setNotificationData({
                  ...notificationData,
                  isImportant: e.target.checked,
                })
              }
              className="w-4 h-4 text-blue-600 rounded"
              id="is-important"
            />
            <label htmlFor="is-important" className="text-gray-700">
              Mark as Important
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            {editingNotification && (
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
              ) : editingNotification ? (
                "Update Notification"
              ) : (
                "Create Notification"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No notifications found. Create your first notification above.
        </div>
      )}
    </div>
  );
};

const NotificationCard = ({ notification, onEdit, onDelete }) => {
  const isNew = () => {
    const createdAt = new Date(notification.createdAt);
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    return createdAt > fiveDaysAgo;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-lg border-l-4 ${
        notification.isImportant ? "border-red-500" : "border-orange-500"
      } hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              {notification.title}
            </h3>
            {isNew() && (
              <span className="ml-3 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full animate-pulse">
                New
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-2">{notification.description}</p>
        </div>
        <div className="text-sm text-gray-500 md:text-right">
          {formatDate(notification.createdAt)}
        </div>
      </div>
      {notification.isImportant && (
        <div className="mt-4">
          <span className="inline-block px-3 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Important
          </span>
        </div>
      )}
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(notification)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
          title="Edit"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(notification)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default NotificationManagement;
