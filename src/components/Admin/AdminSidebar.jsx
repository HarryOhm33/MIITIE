import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaSignOutAlt,
  FaCalendarAlt,
  FaLightbulb,
  FaUsers,
  FaBell,
  FaUsersCog,
  FaUserGraduate,
  FaRocket,
  FaEnvelopeOpenText,
  FaEllipsisH,
  FaTimes,
} from "react-icons/fa";
import miitieLogoMini from "../../assets/miitie-logo-mini.png";
import { db } from "../../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const AdminSidebar = ({ userName, onLogout, isSuperAdmin }) => {
  const location = useLocation();
  const [hasPendingMentors, setHasPendingMentors] = useState(false);
  const [hasPendingIncubations, setHasPendingIncubations] = useState(false);
  const [hasPendingContacts, setHasPendingContacts] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const unsubMentors = onSnapshot(
      query(collection(db, "mentor_applications"), where("status", "==", "Pending")),
      (snapshot) => setHasPendingMentors(!snapshot.empty),
      (err) => console.error("Error listening to mentor apps:", err)
    );

    const unsubIncubations = onSnapshot(
      query(collection(db, "incubation_applications"), where("status", "==", "Pending")),
      (snapshot) => setHasPendingIncubations(!snapshot.empty),
      (err) => console.error("Error listening to incubation apps:", err)
    );

    const unsubContacts = onSnapshot(
      query(collection(db, "contact_submissions"), where("status", "==", "Pending")),
      (snapshot) => setHasPendingContacts(!snapshot.empty),
      (err) => console.error("Error listening to contact messages:", err)
    );

    return () => {
      unsubMentors();
      unsubIncubations();
      unsubContacts();
    };
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { name: "Events", path: "/admin/events", icon: <FaCalendarAlt className="w-5 h-5" /> },
    { name: "Incubatees", path: "/admin/incubatees", icon: <FaLightbulb className="w-5 h-5" /> },
    { name: "Notifications", path: "/admin/notifications", icon: <FaBell className="w-5 h-5" /> },
    { name: "Mentors", path: "/admin/mentors", icon: <FaUsers className="w-5 h-5" /> },
    {
      name: "Mentor Apps",
      path: "/admin/mentor-applications",
      icon: <FaUserGraduate className="w-5 h-5" />,
      hasBadge: hasPendingMentors,
    },
    {
      name: "Incubation Apps",
      path: "/admin/incubation-applications",
      icon: <FaRocket className="w-5 h-5" />,
      hasBadge: hasPendingIncubations,
    },
    {
      name: "Contact Messages",
      path: "/admin/contact-submissions",
      icon: <FaEnvelopeOpenText className="w-5 h-5" />,
      hasBadge: hasPendingContacts,
    },
  ];

  // Mobile Bottom Bar displays first 4 primary items + "More"
  const mobilePrimaryItems = menuItems.slice(0, 4);
  const mobileHiddenItemsHasBadge = menuItems.slice(4).some((item) => item.hasBadge);

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col shrink-0 border-r border-slate-800 shadow-2xl h-full z-30">
        {/* Logo Branding */}
        <div className="flex p-6 items-center gap-3 border-b border-slate-800">
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

        {/* User Info Quick Card */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/45">
          <p className="text-xs text-slate-500 font-medium">Logged in as</p>
          <p className="text-sm font-semibold text-slate-200 truncate mt-0.5">{userName}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  isActive
                    ? "text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-md shadow-orange-500/10"
                    : "hover:text-slate-100 text-slate-400"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-sm font-semibold tracking-tight">{item.name}</span>
                {item.hasBadge && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-orange-500/20 animate-pulse ml-auto"
                    title="Pending items for review"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
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

      {/* ================= MOBILE BOTTOM BAR (MAX 5 BUTTONS) ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 text-slate-300 border-t border-slate-800 shadow-2xl z-40 flex items-center justify-around px-1">
        {/* First 4 Primary Buttons */}
        {mobilePrimaryItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 flex-1 text-center ${
                isActive ? "text-orange-400 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-slate-900 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[60px]">
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* 5th Button: MORE */}
        <button
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 flex-1 text-center border-0 bg-transparent cursor-pointer ${
            isDrawerOpen || location.pathname.includes("-applications") || location.pathname.includes("-submissions")
              ? "text-orange-400 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <FaEllipsisH className="w-5 h-5" />
            {mobileHiddenItemsHasBadge && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-slate-900 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">More</span>
        </button>
      </div>

      {/* ================= MOBILE SLIDE-OUT DRAWER (SLIDES FROM LEFT) ================= */}
      {/* Backdrop Overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 transition-opacity duration-300 cursor-pointer"
        />
      )}

      {/* Drawer Container */}
      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={miitieLogoMini}
              alt="MIITIE Logo"
              className="h-9 w-9 object-contain rounded-xl border border-orange-400 p-0.5 bg-white shadow"
            />
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight leading-none">MIITIE</h1>
              <span className="text-[9px] text-orange-400 uppercase tracking-widest font-semibold mt-1 block">Admin Suite</span>
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
            aria-label="Close Drawer"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Quick Card */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/45">
          <p className="text-xs text-slate-500 font-medium">Logged in as</p>
          <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">{userName}</p>
        </div>

        {/* Navigation Links inside Drawer */}
        <nav className="flex flex-col flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsDrawerOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  isActive
                    ? "text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-md shadow-orange-500/10"
                    : "hover:text-slate-100 text-slate-400"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-sm font-semibold tracking-tight">{item.name}</span>
                {item.hasBadge && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-orange-500/20 animate-pulse ml-auto"
                    title="Pending items for review"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer / Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2 mb-16 md:mb-0">
          {isSuperAdmin && (
            <Link
              to="/superadmin"
              onClick={() => setIsDrawerOpen(false)}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl transition-all duration-200 border-0"
            >
              <FaUsersCog className="w-4 h-4" />
              <span>Super Admin Dashboard</span>
            </Link>
          )}
          <button
            onClick={() => {
              setIsDrawerOpen(false);
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 focus:outline-none cursor-pointer border-0 bg-transparent"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
