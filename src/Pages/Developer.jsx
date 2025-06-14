import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaChevronDown, FaChevronUp, FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import EventManagement from "../components/Dev/EventManagement";
import IncubateeManagement from "../components/Dev/IncubateeManagement";
import MentorManagement from "../components/Dev/MentorManagement";
import NotificationManagement from "../components/Dev/NotificationManagement";
// import { initIncubatees } from "../components/Dev/initIncubatees";
const Developer = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [incubatees, setIncubatees] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeSection, setActiveSection] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/logindev");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || !userSnap.data().isDeveloper) {
          await signOut(auth);
          toast.error("Insufficient permissions. Logged out.");
          navigate("/logindev");
          return;
        }

        setUserName(user.displayName || "Developer");
        await Promise.all([
          fetchEvents(),
          fetchIncubatees(),
          fetchMentors(),
          fetchNotifications(),
        ]);
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Authentication failed");
        navigate("/logindev");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsList);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    }
  };

  const fetchIncubatees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "incubatees"));
      const incubateesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIncubatees(incubateesList);
    } catch (error) {
      console.error("Error fetching incubatees:", error);
      toast.error("Failed to load incubatees");
    }
  };

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
    }
  };

  const fetchNotifications = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "notifications"));
      const notificationsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notificationsList);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    }
  };

  // Event handlers
  const handleCreateEvent = async (event) => {
    try {
      const eventRef = doc(collection(db, "events"));
      await setDoc(eventRef, {
        id: eventRef.id,
        ...event,
        createdAt: new Date(),
        createdBy: auth.currentUser?.uid || "unknown",
      });
      toast.success("Event created successfully");
      await fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      throw error;
    }
  };

  const handleUpdateEvent = async (event) => {
    try {
      await updateDoc(doc(db, "events", event.id), {
        ...event,
        updatedAt: new Date(),
      });
      toast.success("Event updated successfully");
      await fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      throw error;
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteDoc(doc(db, "events", eventId));
      toast.success("Event deleted successfully");
      await fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  // Incubatee handlers
  const handleCreateIncubatee = async (incubatee) => {
    try {
      const incubateeRef = doc(collection(db, "incubatees"));
      await setDoc(incubateeRef, {
        id: incubateeRef.id,
        ...incubatee,
        createdAt: new Date(),
        createdBy: auth.currentUser?.uid || "unknown",
      });
      toast.success("Incubatee added successfully");
      await fetchIncubatees();
    } catch (error) {
      console.error("Error creating incubatee:", error);
      toast.error("Failed to add incubatee");
      throw error;
    }
  };

  const handleUpdateIncubatee = async (incubatee) => {
    try {
      await updateDoc(doc(db, "incubatees", incubatee.id), {
        ...incubatee,
        updatedAt: new Date(),
      });
      toast.success("Incubatee updated successfully");
      await fetchIncubatees();
    } catch (error) {
      console.error("Error updating incubatee:", error);
      toast.error("Failed to update incubatee");
      throw error;
    }
  };

  const handleDeleteIncubatee = async (incubateeId) => {
    if (!window.confirm("Are you sure you want to delete this incubatee?"))
      return;
    try {
      await deleteDoc(doc(db, "incubatees", incubateeId));
      toast.success("Incubatee deleted successfully");
      await fetchIncubatees();
    } catch (error) {
      console.error("Error deleting incubatee:", error);
      toast.error("Failed to delete incubatee");
    }
  };

  // Mentor handlers
  const handleCreateMentor = async (mentor) => {
    try {
      const mentorRef = doc(collection(db, "mentors"));
      await setDoc(mentorRef, {
        id: mentorRef.id,
        ...mentor,
        createdAt: new Date(),
        createdBy: auth.currentUser?.uid || "unknown",
      });
      toast.success("Mentor added successfully");
      await fetchMentors();
    } catch (error) {
      console.error("Error creating mentor:", error);
      toast.error("Failed to add mentor");
      throw error;
    }
  };

  const handleUpdateMentor = async (mentor) => {
    try {
      await updateDoc(doc(db, "mentors", mentor.id), {
        ...mentor,
        updatedAt: new Date(),
      });
      toast.success("Mentor updated successfully");
      await fetchMentors();
    } catch (error) {
      console.error("Error updating mentor:", error);
      toast.error("Failed to update mentor");
      throw error;
    }
  };

  const handleDeleteMentor = async (mentorId) => {
    if (!window.confirm("Are you sure you want to delete this mentor?")) return;
    try {
      await deleteDoc(doc(db, "mentors", mentorId));
      toast.success("Mentor deleted successfully");
      await fetchMentors();
    } catch (error) {
      console.error("Error deleting mentor:", error);
      toast.error("Failed to delete mentor");
    }
  };

  //Notification handlers
  const handleCreateNotification = async (notification) => {
    try {
      const notificationRef = doc(collection(db, "notifications"));
      await setDoc(notificationRef, {
        id: notificationRef.id,
        ...notification,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.uid || "unknown",
      });
      toast.success("Notification created successfully");
      await fetchNotifications();
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Failed to create notification");
      throw error;
    }
  };

  const handleUpdateNotification = async (notification) => {
    try {
      await updateDoc(doc(db, "notifications", notification.id), {
        ...notification,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Notification updated successfully");
      await fetchNotifications();
    } catch (error) {
      console.error("Error updating notification:", error);
      toast.error("Failed to update notification");
      throw error;
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;
    try {
      await deleteDoc(doc(db, "notifications", notificationId));
      toast.success("Notification deleted successfully");
      await fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/logindev");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-50 to-yellow-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md"
      >
        <div className="container mx-auto px-4 py-4 max-w-7xl flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Developer Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden sm:inline-block">
              Welcome, {userName}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
            {/* <button
              onClick={initIncubatees}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              Init
            </button> */}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Event Management Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <button
              onClick={() => toggleSection("events")}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Event Management
                </h2>
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  {events.length} {events.length === 1 ? "Event" : "Events"}
                </span>
              </div>
              {activeSection === "events" ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </button>
            <AnimatePresence>
              {activeSection === "events" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-gray-100">
                    <EventManagement
                      events={events}
                      onCreate={handleCreateEvent}
                      onUpdate={handleUpdateEvent}
                      onDelete={handleDeleteEvent}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Incubatee Management Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <button
              onClick={() => toggleSection("incubatees")}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Incubatee Management
                </h2>
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  {incubatees.length}{" "}
                  {incubatees.length === 1 ? "Incubatee" : "Incubatees"}
                </span>
              </div>
              {activeSection === "incubatees" ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </button>
            <AnimatePresence>
              {activeSection === "incubatees" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-gray-100">
                    <IncubateeManagement
                      incubatees={incubatees}
                      onCreate={handleCreateIncubatee}
                      onUpdate={handleUpdateIncubatee}
                      onDelete={handleDeleteIncubatee}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mentor Management Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <button
              onClick={() => toggleSection("mentors")}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Mentor Management
                </h2>
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  {mentors.length} {mentors.length === 1 ? "Mentor" : "Mentors"}
                </span>
              </div>
              {activeSection === "mentors" ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </button>
            <AnimatePresence>
              {activeSection === "mentors" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-gray-100">
                    <MentorManagement
                      mentors={mentors}
                      onCreate={handleCreateMentor}
                      onUpdate={handleUpdateMentor}
                      onDelete={handleDeleteMentor}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Management Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <button
              onClick={() => toggleSection("notifications")}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Notification Management
                </h2>
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  {notifications.length}{" "}
                  {notifications.length === 1
                    ? "Notification"
                    : "Notifications"}
                </span>
              </div>
              {activeSection === "notifications" ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </button>
            <AnimatePresence>
              {activeSection === "notifications" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-gray-100">
                    <NotificationManagement
                      notifications={notifications}
                      onCreate={handleCreateNotification}
                      onUpdate={handleUpdateNotification}
                      onDelete={handleDeleteNotification}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Developer;
