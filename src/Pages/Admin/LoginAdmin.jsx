import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import miitieLogoMini from "../../assets/miitie-logo-mini.jpg";

const LoginAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.isAdmin === true || data.isSuperAdmin === true) {
              navigate("/admin");
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let isUserAdmin = false;
      let isUserSuperAdmin = false;

      if (!userSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          isAdmin: false,
          isSuperAdmin: false,
          createdAt: new Date(),
        });
      } else {
        const data = userSnap.data();
        isUserAdmin = data.isAdmin === true;
        isUserSuperAdmin = data.isSuperAdmin === true;

        // Proactively initialize missing fields for existing users
        const updates = {};
        if (data.isAdmin === undefined) updates.isAdmin = false;
        if (data.isSuperAdmin === undefined) updates.isSuperAdmin = false;
        if (data.hasOwnProperty("isDeveloper")) {
          updates.isDeveloper = deleteField();
        }
        if (Object.keys(updates).length > 0) {
          await updateDoc(userRef, updates);
        }
      }

      if (!isUserAdmin && !isUserSuperAdmin) {
        await signOut(auth);
        toast.error("Insufficient permissions. Logged out.");
        return;
      }

      toast.success("Login successful");
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-slate-50 overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-orange-400/10 blur-[120px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none animate-pulse duration-[10s]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 group focus:outline-none"
        >
          <FaArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
          {/* Top orange line accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 to-amber-500" />

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mb-4"
            >
              <img
                src={miitieLogoMini}
                alt="MIITIE Logo"
                className="h-12 w-12 object-contain rounded-xl border border-orange-300 p-0.5 bg-white shadow-sm"
              />
            </motion.div>
            
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              MIITIE Admin Portal
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-xs">
              Authorized access only. Sign in with your Google account to manage the incubation dashboard.
            </p>
          </div>

          {/* Warning banner */}
          <div className="mb-6 flex items-start gap-3 bg-amber-50/70 border border-amber-200/50 rounded-xl p-3.5 text-amber-800 text-xs leading-relaxed">
            <FaShieldAlt className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Access is restricted to administrators of the MIITIE Incubation Centre. Unauthorized attempts will be logged.
            </span>
          </div>

          {/* Login button */}
          <motion.button
            whileHover={{ scale: 1.02, translateY: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3.5 border border-slate-200 rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          >
            <FcGoogle className="w-6 h-6" />
            <span>Continue with Google</span>
          </motion.button>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} MIITIE. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginAdmin;
