import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import AdminSidebar from "../components/Admin/AdminSidebar";
import miitieLogoMini from "../assets/miitie-logo-mini.jpg";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/loginadmin");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800 antialiased">
      {/* Mobile Top Header */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <img
            src={miitieLogoMini}
            alt="MIITIE Logo"
            className="h-8 w-8 object-contain rounded-lg border border-orange-400 p-0.5 bg-white shadow"
          />
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight leading-none">MIITIE</h1>
            <span className="text-[8px] text-orange-400 uppercase tracking-widest font-semibold mt-0.5 block">Admin Suite</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-400 transition-colors cursor-pointer border-0 bg-transparent"
          title="Sign Out"
        >
          <FaSignOutAlt className="w-5 h-5" />
        </button>
      </header>

      {/* Admin Sidebar Navigation */}
      <AdminSidebar userName={userName} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="flex-grow flex-1 overflow-y-auto md:h-full pb-20 md:pb-6 p-4 sm:p-6 lg:p-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
