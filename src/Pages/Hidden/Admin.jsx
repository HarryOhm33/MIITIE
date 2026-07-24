import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, Link, Routes, Route, useLocation } from "react-router-dom";
import { auth, db } from "../../../firebase";
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
import {
  FaSignOutAlt,
  FaChartPie,
  FaCalendarAlt,
  FaLightbulb,
  FaUsers,
  FaBell,
} from "react-icons/fa";
import toast from "react-hot-toast";
import EventManagement from "../../components/Admin/EventManagement";
import IncubateeManagement from "../../components/Admin/IncubateeManagement";
import MentorManagement from "../../components/Admin/MentorManagement";
import NotificationManagement from "../../components/Admin/NotificationManagement";
import miitieLogoMini from "../../assets/miitie-logo-mini.jpg";
// import { initIncubatees } from "../../components/Admin/initIncubatees";
const Admin = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [incubatees, setIncubatees] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/loginadmin");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || userSnap.data().isAdmin !== true) {
          await signOut(auth);
          toast.error("Insufficient permissions. Logged out.");
          navigate("/loginadmin");
          return;
        }

        setUserName(user.displayName || "Admin");
        await Promise.all([
          fetchEvents(),
          fetchIncubatees(),
          fetchMentors(),
          fetchNotifications(),
        ]);
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Authentication failed");
        navigate("/loginadmin");
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
      setEvents(sortByDateDescending(eventsList, "date"));
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
      setIncubatees(sortByDateDescending(incubateesList, "createdAt"));
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
      setMentors(sortByDateDescending(mentorsList, "createdAt"));
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
      setNotifications(sortByDateDescending(notificationsList, "createdAt"));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    }
  };

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
      navigate("/loginadmin");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const location = useLocation();

  const menuItems = [
    { name: "Overview", path: "/admin", icon: <FaChartPie className="w-5 h-5" /> },
    { name: "Events", path: "/admin/events", icon: <FaCalendarAlt className="w-5 h-5" /> },
    { name: "Incubatees", path: "/admin/incubatees", icon: <FaLightbulb className="w-5 h-5" /> },
    { name: "Mentors", path: "/admin/mentors", icon: <FaUsers className="w-5 h-5" /> },
    { name: "Notifications", path: "/admin/notifications", icon: <FaBell className="w-5 h-5" /> },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 flex flex-col md:flex-row h-full overflow-hidden pb-16 md:pb-0">
      {/* Sidebar / Bottom Bar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-row md:flex-col shrink-0 border-t md:border-t-0 md:border-r border-slate-800 shadow-2xl fixed md:relative bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-auto h-16 md:h-full z-50 md:z-auto">
        {/* Logo Branding (Desktop Only) */}
        <div className="hidden md:flex p-6 items-center gap-3 border-b border-slate-800">
          <img
            src={miitieLogoMini}
            alt="MIITIE Logo"
            className="h-10 w-10 object-contain rounded-xl border border-orange-400 p-0.5 bg-white shadow"
          />
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none">MIITIE</h1>
            <span className="text-[10px] text-orange-400 uppercase tracking-widest font-semibold mt-1 block">Admin Suite</span>
          </div>
        </div>

        {/* User Info Quick Card (Desktop Only) */}
        <div className="hidden md:block px-6 py-4 border-b border-slate-800 bg-slate-950/45">
          <p className="text-xs text-slate-500 font-medium">Logged in as</p>
          <p className="text-sm font-semibold text-slate-200 truncate mt-0.5">{userName}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-row md:flex-col md:flex-1 justify-around md:justify-start items-center w-full px-2 md:px-4 py-0 md:py-6 space-y-0 md:space-y-1.5 overflow-x-auto md:overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === "/admin" && location.pathname === "/admin/");
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-3 md:px-4 py-1.5 md:py-3 rounded-xl transition-all duration-200 w-full text-center md:text-left ${
                  isActive
                    ? "text-orange-400 md:text-white md:bg-gradient-to-r md:from-orange-500 md:to-amber-500 md:shadow-md md:shadow-orange-500/10"
                    : "hover:text-slate-100 text-slate-400"
                }`}
              >
                {item.icon}
                <span className="text-[9px] md:text-sm font-semibold tracking-tight">{item.name}</span>
              </Link>
            );
          })}
          {/* Mobile Only Sign Out Tab */}
          <button
            onClick={handleLogout}
            className="flex md:hidden flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 w-full text-center hover:text-red-400 text-slate-400 border-0 bg-transparent cursor-pointer"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="text-[9px] font-semibold tracking-tight">Sign Out</span>
          </button>
        </nav>

        {/* Sidebar Footer / Logout (Desktop Only) */}
        <div className="hidden md:block p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 focus:outline-none cursor-pointer border-0"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-h-0 bg-slate-50 h-full overflow-hidden">
        {/* View Content Area */}
        <div className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto md:h-full">
          <Routes>
            <Route
              path="/"
              element={
                <AdminOverview
                  stats={{
                    eventsCount: events.length,
                    incubateesCount: incubatees.length,
                    mentorsCount: mentors.length,
                    notificationsCount: notifications.length,
                  }}
                  navigate={navigate}
                />
              }
            />
            <Route
              path="/events"
              element={
                <EventManagement
                  events={events}
                  onCreate={handleCreateEvent}
                  onUpdate={handleUpdateEvent}
                  onDelete={handleDeleteEvent}
                />
              }
            />
            <Route
              path="/incubatees"
              element={
                <IncubateeManagement
                  incubatees={incubatees}
                  onCreate={handleCreateIncubatee}
                  onUpdate={handleUpdateIncubatee}
                  onDelete={handleDeleteIncubatee}
                />
              }
            />
            <Route
              path="/mentors"
              element={
                <MentorManagement
                  mentors={mentors}
                  onCreate={handleCreateMentor}
                  onUpdate={handleUpdateMentor}
                  onDelete={handleDeleteMentor}
                />
              }
            />
            <Route
              path="/notifications"
              element={
                <NotificationManagement
                  notifications={notifications}
                  onCreate={handleCreateNotification}
                  onUpdate={handleUpdateNotification}
                  onDelete={handleDeleteNotification}
                />
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const AdminOverview = ({ stats, navigate }) => {
  const cards = [
    {
      title: "Events",
      count: stats.eventsCount,
      icon: <FaCalendarAlt className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-100 text-blue-700",
      path: "/admin/events",
      desc: "Manage program events, scheduling, and registration links.",
    },
    {
      title: "Incubatees",
      count: stats.incubateesCount,
      icon: <FaLightbulb className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-50 border-amber-100 text-amber-700",
      path: "/admin/incubatees",
      desc: "Track startup profiles, founders, and sectors.",
    },
    {
      title: "Mentors",
      count: stats.mentorsCount,
      icon: <FaUsers className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-100 text-emerald-700",
      path: "/admin/mentors",
      desc: "Manage advisors, mentors, roles, and LinkedIn profiles.",
    },
    {
      title: "Notifications",
      count: stats.notificationsCount,
      icon: <FaBell className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50 border-purple-100 text-purple-700",
      path: "/admin/notifications",
      desc: "Publish announcements and update alerts.",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Quick Summary</h2>
        <p className="text-slate-500 mt-1">Here is a quick look at the current database stats.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(card.path)}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.color.split(" ")[0]} border ${card.color.split(" ")[1]}`}>
                {card.icon}
              </div>
              <span className="text-4xl font-extrabold text-slate-850 tracking-tight">
                {card.count}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-500 transition-colors">
              {card.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {card.desc}
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-orange-500 group-hover:underline">
              <span>Go to management</span>
              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
