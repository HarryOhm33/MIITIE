import { useEffect, useState } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaSignOutAlt, FaShieldAlt, FaUsersCog, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import miitieLogoMini from "../assets/miitie-logo-mini.png";

const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

        if (!userSnap.exists() || userSnap.data().isSuperAdmin !== true) {
          toast.error("Unauthorized: Super Admin access required.");
          navigate("/admin");
          return;
        }

        setUserName(user.displayName || "Super Admin");
      } catch (error) {
        console.error("Super Admin auth error:", error);
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
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800 antialiased">
      {/* Mobile Top Header */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-850 shrink-0">
        <div className="flex items-center gap-2">
          <img
            src={miitieLogoMini}
            alt="MIITIE Logo"
            className="h-8 w-8 object-contain rounded-lg border border-amber-400 p-0.5 bg-white shadow"
          />
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight leading-none">MIITIE</h1>
            <span className="text-[8px] text-amber-400 uppercase tracking-widest font-semibold mt-0.5 block">Super Admin</span>
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

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-300 flex flex-row md:flex-col shrink-0 border-t md:border-t-0 md:border-r border-slate-850 shadow-2xl fixed md:relative bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-auto h-16 md:h-full z-50 md:z-auto">
        {/* Logo Branding */}
        <div className="hidden md:flex p-6 items-center gap-3 border-b border-slate-850">
          <img
            src={miitieLogoMini}
            alt="MIITIE Logo"
            className="h-10 w-10 object-contain rounded-xl border border-amber-400 p-0.5 bg-white shadow"
          />
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none">MIITIE</h1>
            <span className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold mt-1 block">Super Admin</span>
          </div>
        </div>

        {/* User Profile Info */}
        <div className="hidden md:block px-6 py-4 border-b border-slate-850 bg-slate-900/30">
          <p className="text-xs text-slate-500 font-medium">System Operator</p>
          <p className="text-sm font-semibold text-slate-200 truncate mt-0.5">{userName}</p>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-row md:flex-col md:flex-1 justify-around md:justify-start items-center w-full px-2 md:px-4 py-0 md:py-6 space-y-0 md:space-y-1.5 overflow-x-auto md:overflow-y-auto">
          <Link
            to="/superadmin"
            className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-3 md:px-4 py-1.5 md:py-3 rounded-xl transition-all duration-200 w-full text-center md:text-left ${location.pathname === "/superadmin" || location.pathname === "/superadmin/"
                ? "text-amber-400 md:text-white md:bg-gradient-to-r md:from-amber-600 md:to-orange-600 md:shadow-md md:shadow-amber-500/10"
                : "hover:text-slate-100 text-slate-400"
              }`}
          >
            <FaUsersCog className="w-5 h-5" />
            <span className="text-[9px] md:text-sm font-semibold tracking-tight">Users Control</span>
          </Link>

          {/* Quick link back to standard admin portal */}
          <Link
            to="/admin"
            className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-3 md:px-4 py-1.5 md:py-3 rounded-xl transition-all duration-200 w-full text-center md:text-left hover:text-slate-100 text-slate-400"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-[9px] md:text-sm font-semibold tracking-tight">Admin Area</span>
          </Link>
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="hidden md:block p-4 border-t border-slate-850">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 focus:outline-none cursor-pointer border-0"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex-1 overflow-y-auto md:h-full pb-20 md:pb-6 p-4 sm:p-6 lg:p-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
