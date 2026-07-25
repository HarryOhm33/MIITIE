import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaLightbulb, FaUsers, FaBell } from "react-icons/fa";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const AdminOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    eventsCount: 0,
    incubateesCount: 0,
    mentorsCount: 0,
    notificationsCount: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [eventsSnap, incubateesSnap, mentorsSnap, notificationsSnap] = await Promise.all([
          getDocs(collection(db, "events")),
          getDocs(collection(db, "incubatees")),
          getDocs(collection(db, "mentors")),
          getDocs(collection(db, "notifications")),
        ]);
        setStats({
          eventsCount: eventsSnap.size,
          incubateesCount: incubateesSnap.size,
          mentorsCount: mentorsSnap.size,
          notificationsCount: notificationsSnap.size,
        });
      } catch (error) {
        console.error("Error fetching overview counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Events",
      count: stats.eventsCount,
      icon: <FaCalendarAlt className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-100 text-blue-700",
      path: "/admin/events",
      desc: "Manage program events, scheduling, and registration links.",
    },
    {
      title: "Incubatees",
      count: stats.incubateesCount,
      icon: <FaLightbulb className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-50 border-amber-100 text-amber-700",
      path: "/admin/incubatees",
      desc: "Track startup profiles, founders, and sectors.",
    },
    {
      title: "Mentors",
      count: stats.mentorsCount,
      icon: <FaUsers className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-100 text-emerald-700",
      path: "/admin/mentors",
      desc: "Manage advisors, mentors, roles, and LinkedIn profiles.",
    },
    {
      title: "Notifications",
      count: stats.notificationsCount,
      icon: <FaBell className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50 border-purple-100 text-purple-700",
      path: "/admin/notifications",
      desc: "Publish announcements and update alerts.",
    },
  ];

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Quick Summary</h2>
        <p className="text-slate-500 mt-1">Here is a quick look at the current database stats.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(card.path)}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.color.split(" ")[0]} border ${card.color.split(" ")[1]}`}>
                {card.icon}
              </div>
              <span className="text-4xl font-extrabold text-slate-800 tracking-tight">
                {card.count}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-500 transition-colors">
              {card.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {card.desc}
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-orange-500 group-hover:underline">
              <span>Go to management</span>
              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
