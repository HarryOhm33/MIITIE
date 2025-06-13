import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { incubateesData } from "../../assets/incubatees";
import { toast } from "react-hot-toast";

export const initIncubatees = async () => {
  try {
    const uid = auth.currentUser?.uid || "unknown";

    // Sort incubatees by `id` in ascending order
    const sortedIncubatees = [...incubateesData].sort((a, b) => a.id - b.id);

    // Upload each incubatee one by one in sorted order
    for (const incubatee of sortedIncubatees) {
      const incubateeRef = doc(collection(db, "incubatees"));
      await setDoc(incubateeRef, {
        ...incubatee,
        id: incubateeRef.id, // Firebase-generated ID
        createdAt: new Date(),
        createdBy: uid,
      });
      setTimeout(() => {
        console.log(`Initialized`, incubatee.startupName);
      }, 1000);
    }

    toast.success("All incubatees initialized to Firestore in order");
  } catch (error) {
    console.error("Error initializing incubatees:", error);
    toast.error("Failed to initialize incubatees");
  }
};
