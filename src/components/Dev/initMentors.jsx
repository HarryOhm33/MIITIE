import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
// import { mentorsData } from "../../assets/mentor";
import { toast } from "react-hot-toast";
import { uploadImage } from "../../utils/cloudinary"; // ✅ reuse existing function

import naveenJha from "../../assets/mentor-img/naveen-jha.jpg";
import ajayShukla from "../../assets/mentor-img/ajay-shukla.jpg";
import pradeepChoudhary from "../../assets/mentor-img/pradeep-choudhary.jpg";
import arvindJha from "../../assets/mentor-img/arvind-jha.jpg";
import pkMishra from "../../assets/mentor-img/pk-mishra.png";
import rakeshJha from "../../assets/mentor-img/rakesh-jha.jpg";

const mentorsData = [
  {
    cardPosition: 1,
    name: "Sri Naveen Jha",
    role: "Chief Advisor",
    designation: "Sr. ALI Fellow, Harvard University",
    social: "https://www.linkedin.com/in/naveenforchange/",
    image: naveenJha,
  },
  {
    cardPosition: 2,
    name: "Prof. P.K. Mishra",
    role: "Advisor",
    designation: "Professor (HAG), IIT BHU",
    social: "https://www.linkedin.com/in/pradeep-kumar-mishra-3399243/",
    image: pkMishra,
  },
  {
    cardPosition: 3,
    name: "Sri Arvind Jha",
    role: "Advisor",
    designation: "Founder, Mithila Angel Network",
    social: "https://www.linkedin.com/in/jalajboy/",
    image: arvindJha,
  },
  {
    cardPosition: 4,
    name: "Sri Pradeep Kant Choudhary",
    role: "Advisor",
    designation: "Chairman, ANADI Foundation",
    social: "https://www.linkedin.com/in/pradeep-kant-choudhary-0b825922b/",
    image: pradeepChoudhary,
  },
  {
    cardPosition: 5,
    name: "Sri Ajay Suman Shukla",
    role: "Advisor",
    designation: "Sr. Vice PrescardPositionent, Spice Money",
    social: "https://www.linkedin.com/in/ajay-suman-shukla-69534312/",
    image: ajayShukla,
  },
  {
    cardPosition: 6,
    name: "Sri Rakesh K Jha",
    role: "Advisor",
    designation: "Founder, Craftvala",
    social: "https://www.facebook.com/craftvala.artroom/",
    image: rakeshJha,
  },
];

export const initMentors = async () => {
  try {
    const uid = auth.currentUser?.uid || "unknown";

    for (const mentor of mentorsData) {
      const mentorRef = doc(collection(db, "mentors"));

      let imageUrl = "";

      if (mentor.image) {
        try {
          const result = await uploadImage(mentor.image);
          imageUrl = result.url;
        } catch (err) {
          console.error(`Failed to upload image for ${mentor.name}:`, err);
          toast.error(`Image upload failed for ${mentor.name}`);
        }
      }

      await setDoc(mentorRef, {
        id: mentorRef.id,
        ...mentor,
        image: imageUrl,
        createdAt: new Date(),
        createdBy: uid,
      });
    }

    toast.success("All mentors initialized to Firestore");
  } catch (error) {
    console.error("Error initializing mentors:", error);
    toast.error("Failed to initialize mentors");
  }
};
