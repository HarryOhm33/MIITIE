import { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FaEnvelope, FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const [isMailNotif, setIsMailNotif] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUserEmail(user.email || "");
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setIsMailNotif(userSnap.data().isMailNotif === true);
          }
        }
      } catch (error) {
        console.error("Error fetching admin settings:", error);
        toast.error("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, []);

  const handleToggle = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    setSaving(true);
    const newValue = !isMailNotif;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        isMailNotif: newValue,
      });

      setIsMailNotif(newValue);
      toast.success(
        newValue
          ? "Email notifications enabled!"
          : "Email notifications disabled."
      );
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error("Failed to save preference.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">Admin Settings</h3>
      </div>

      {/* Light Settings Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
              <FaEnvelope className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">Email Notifications</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Receive email alerts for new form submissions
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggle}
            disabled={saving}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
              isMailNotif ? "bg-orange-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
                isMailNotif ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Message Banner */}
        <div
          className={`flex items-center gap-2.5 p-3.5 rounded-xl text-xs font-semibold border transition-all ${
            isMailNotif
              ? "bg-orange-50 border-orange-200 text-orange-800"
              : "bg-slate-50 border-slate-200 text-slate-600"
          }`}
        >
          {isMailNotif ? (
            <>
              <FaCheck className="text-orange-600 w-3.5 h-3.5 shrink-0" />
              <span>You will receive email notifications at <strong className="text-slate-900 font-bold">{userEmail}</strong></span>
            </>
          ) : (
            <>
              <FaTimes className="text-slate-400 w-3.5 h-3.5 shrink-0" />
              <span>Email notifications are currently disabled.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
