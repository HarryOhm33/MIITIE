import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
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

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNotification, setEditingNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingNotification, setDeletingNotification] = useState(null);

  const [notificationData, setNotificationData] = useState({
    title: "",
    description: "",
    isImportant: false,
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

  const fetchNotifications = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "notifications"));
      const notificationsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(sortByDateDescending(notificationsList, "createdAt"));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (!notificationData.title || !notificationData.description) {
        toast.error("Please fill all required fields");
        return;
      }

      if (editingNotification) {
        await updateDoc(doc(db, "notifications", editingNotification.id), {
          ...notificationData,
          updatedAt: new Date().toISOString(),
        });
        toast.success("Notification updated successfully");
      } else {
        const notificationRef = doc(collection(db, "notifications"));
        await setDoc(notificationRef, {
          id: notificationRef.id,
          ...notificationData,
          createdAt: new Date().toISOString(),
          createdBy: auth.currentUser?.uid || "unknown",
        });
        toast.success("Notification created successfully");
      }

      await fetchNotifications();
      resetForm();
    } catch (error) {
      console.error("Error saving notification:", error);
      toast.error("Failed to save notification");
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
    setIsModalOpen(true);
  };

  const handleDeleteClick = (notification) => {
    setDeletingNotification(notification);
  };

  const confirmDelete = async () => {
    if (!deletingNotification) return;
    try {
      setIsSubmitting(true);
      await deleteDoc(doc(db, "notifications", deletingNotification.id));
      toast.success("Notification deleted successfully");
      await fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    } finally {
      setIsSubmitting(false);
      setDeletingNotification(null);
    }
  };

  const resetForm = () => {
    setNotificationData({
      title: "",
      description: "",
      isImportant: false,
    });
    setEditingNotification(null);
    setIsModalOpen(false);
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesQuery =
      !searchQuery ||
      notif.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.description?.toLowerCase().includes(searchQuery.toLowerCase());
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
        <h3 className="text-lg font-bold text-slate-800 shrink-0">Manage Notifications ({notifications.length})</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search notifications..."
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
            Add New Notification
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
                  {editingNotification ? "Edit Notification Details" : "Create New Notification"}
                </h2>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg border-0 bg-transparent cursor-pointer">
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
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
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Description *
                  </label>
                  <textarea
                    placeholder="Notification description / message"
                    value={notificationData.description}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        description: e.target.value,
                      })
                    }
                    rows="5"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    checked={notificationData.isImportant}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        isImportant: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400 border-slate-200"
                    id="is-important"
                  />
                  <label htmlFor="is-important" className="text-sm font-medium text-slate-700 select-none">
                    Mark as Important (will display with high priority accent)
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
                    ) : editingNotification ? (
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
        {deletingNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingNotification(null)}
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
              <h3 className="text-lg font-bold text-slate-800">Delete Notification?</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-700">"{deletingNotification.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full mt-6">
                <button
                  onClick={() => setDeletingNotification(null)}
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

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
          No notifications found. Click "Add New Notification" to create one.
        </div>
      )}
    </div>
  );
};

const NotificationCard = ({ notification, onEdit, onDelete }) => {
  const isNew = () => {
    if (!notification.createdAt) return false;
    const createdAt = new Date(notification.createdAt);
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    return createdAt > fiveDaysAgo;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div
      className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 ${
        notification.isImportant ? "border-l-red-500" : "border-l-orange-500"
      } hover:shadow-md transition-shadow flex flex-col justify-between`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base font-bold text-slate-800">
              {notification.title}
            </h4>
            {isNew() && (
              <span className="px-2 py-0.5 text-[10px] bg-green-100 text-green-700 rounded-full font-bold animate-pulse">
                New
              </span>
            )}
            {notification.isImportant && (
              <span className="px-2 py-0.5 text-[10px] bg-red-100 text-red-700 rounded-full font-bold">
                Important
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">{notification.description}</p>
        </div>
        <div className="text-xs text-slate-400 font-semibold sm:text-right shrink-0">
          Published: {formatDate(notification.createdAt)}
        </div>
      </div>
      
      <div className="mt-5 pt-3 border-t border-slate-50 flex justify-end gap-2.5">
        <button
          onClick={() => onEdit(notification)}
          className="p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors border-0 cursor-pointer bg-transparent"
          title="Edit"
        >
          <FaEdit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(notification)}
          className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border-0 cursor-pointer bg-transparent"
          title="Delete"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminNotifications;
