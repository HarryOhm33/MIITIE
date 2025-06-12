import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { incubateesData } from "../../assets/incubatees";
import { toast } from "react-hot-toast";

export const initIncubatees = async () => {
  try {
    const uid = auth.currentUser?.uid || "unknown";

    for (const incubatee of incubateesData) {
      const incubateeRef = doc(collection(db, "incubatees"));
      await setDoc(incubateeRef, {
        id: incubateeRef.id,
        ...incubatee,
        createdAt: new Date(),
        createdBy: uid,
      });
    }

    toast.success("All incubatees initialized to Firestore");
  } catch (error) {
    console.error("Error initializing incubatees:", error);
    toast.error("Failed to initialize incubatees");
  }
};
