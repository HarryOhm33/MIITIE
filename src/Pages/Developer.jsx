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
import EventManagement from "../components/Dev/EventManagement";

const Developer = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/logindev");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        // console.log("Admin data:", userSnap.data());
        // console.log("isDeveloper value:", userSnap.data()?.isDeveloper);

        if (!userSnap.exists() || !userSnap.data().isDeveloper) {
          await signOut(auth);
          toast.error("Insufficient Permission!! Logged Out");
          navigate("/logindev");
          return;
        }

        // ✅ User is developer, fetch events
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Developer Dashboard
        </h1>

        {/* Other developer components can go here */}

        <EventManagement
          events={events}
          onCreate={handleCreateEvent}
          onUpdate={handleUpdateEvent}
          onDelete={handleDeleteEvent}
        />
      </div>
    </div>
  );
};

export default Developer;
