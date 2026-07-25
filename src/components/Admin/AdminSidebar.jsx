import { Link, useLocation } from "react-router-dom";
import {
  FaSignOutAlt,
  FaChartPie,
  FaCalendarAlt,
  FaLightbulb,
  FaUsers,
  FaBell,
  FaUsersCog,
} from "react-icons/fa";
import miitieLogoMini from "../../assets/miitie-logo-mini.png";

const AdminSidebar = ({ userName, onLogout, isSuperAdmin }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Overview", path: "/admin", icon: <FaChartPie className="w-5 h-5" /> },
    { name: "Events", path: "/admin/events", icon: <FaCalendarAlt className="w-5 h-5" /> },
    { name: "Incubatees", path: "/admin/incubatees", icon: <FaLightbulb className="w-5 h-5" /> },
    { name: "Mentors", path: "/admin/mentors", icon: <FaUsers className="w-5 h-5" /> },
    { name: "Notifications", path: "/admin/notifications", icon: <FaBell className="w-5 h-5" /> },
  ];

  return (
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
          const isActive =
            location.pathname === item.path ||
            (item.path === "/admin" && location.pathname === "/admin/");
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-3 md:px-4 py-1.5 md:py-3 rounded-xl transition-all duration-200 w-full text-center md:text-left ${isActive
                  ? "text-orange-400 md:text-white md:bg-gradient-to-r md:from-orange-500 md:to-amber-500 md:shadow-md md:shadow-orange-500/10"
                  : "hover:text-slate-100 text-slate-400"
                }`}
            >
              {item.icon}
              <span className="text-[9px] md:text-sm font-semibold tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer / Logout (Desktop Only) */}
      <div className="hidden md:block p-4 border-t border-slate-800 space-y-2">
        {isSuperAdmin && (
          <Link
            to="/superadmin"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl transition-all duration-200 border-0"
          >
            <FaUsersCog className="w-4 h-4" />
            <span>Super Admin Dashboard</span>
          </Link>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 focus:outline-none cursor-pointer border-0"
        >
          <FaSignOutAlt className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
