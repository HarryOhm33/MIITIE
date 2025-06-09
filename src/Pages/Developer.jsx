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
import toast from "react-hot-toast";
import { FaChevronDown, FaChevronUp, FaSignOutAlt } from "react-icons/fa";
import EventManagement from "../components/Dev/EventManagement";

const Developer = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);
  const [userName, setUserName] = useState("");

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
          toast.error("Insufficient Permission!! Logged Out");
          navigate("/logindev");
          return;
        }

        setUserName(user.displayName || "Developer");
        fetchEvents();
      } catch (error) {
        console.error("Error checking developer access:", error);
        navigate("/logindev");
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

  const handleCreateEvent = async (event) => {
    try {
      const eventRef = doc(collection(db, "events"));
      await setDoc(eventRef, {
        ...event,
        createdAt: new Date(),
        createdBy: auth.currentUser?.uid || "unknown",
      });
      toast.success("Event created successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
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
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/logindev");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 max-w-6xl flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Developer Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden md:inline-block">
              Welcome, {userName}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Event Management Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-100 transition-colors">
            <button
              onClick={() => toggleSection("events")}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Event Management
                </h2>
                <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                  {events.length} Events
                </span>
              </div>
              {expandedSection === "events" ? (
                <FaChevronUp className="text-gray-400 transition-transform duration-200" />
              ) : (
                <FaChevronDown className="text-gray-400 transition-transform duration-200" />
              )}
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-auto ${
                expandedSection === "events" ? "max-h-[80vh]" : "max-h-0"
              }`}
            >
              <div className="p-6 border-t border-gray-100">
                <EventManagement
                  events={events}
                  onCreate={handleCreateEvent}
                  onUpdate={handleUpdateEvent}
                  onDelete={handleDeleteEvent}
                />
              </div>
            </div>
          </div>

          {/* Add more sections here */}
        </div>
      </div>
    </div>
  );
};

export default Developer;
