import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./Pages/About";
import Notifications from "./Pages/Notifications";
import Home from "./Pages/Home";
import IncubationPrograms from "./Pages/IncubationPrograms";
import Events from "./Pages/Events";
import AdvisorsMentors from "./Pages/AdvisorsMentors";
import Facilities from "./Pages/Facilities";
import ContactUs from "./Pages/ContactUs";
import Apply from "./Pages/Apply";
import NotFound from "./Pages/NotFound";
import Terms from "./Pages/Terms";
import MentorForm from "./Pages/MentorForm";
import PastEvents from "./Pages/PastEvents";
import Incubatees from "./Pages/Incubatees";
import Admin from "./layouts/AdminLayout";
import LoginAdmin from "./Pages/Admin/LoginAdmin";
import LogoutAdmin from "./Pages/Admin/LogoutAdmin";

// Admin Dashboard Pages
import AdminEvents from "./Pages/Admin/AdminEvents";
import AdminIncubatees from "./Pages/Admin/AdminIncubatees";
import AdminMentors from "./Pages/Admin/AdminMentors";
import AdminMentorApplications from "./Pages/Admin/AdminMentorApplications";
import AdminIncubationApplications from "./Pages/Admin/AdminIncubationApplications";
import AdminContactSubmissions from "./Pages/Admin/AdminContactSubmissions";
import AdminNotifications from "./Pages/Admin/AdminNotifications";

// Super Admin Pages
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import SuperAdminDashboard from "./Pages/SuperAdmin/SuperAdminDashboard";

function AppContent() {
  const location = useLocation();
  
  // Hide main Navbar and Footer on Admin & Super Admin Portal pages and login/logout pages
  const isAdminPath =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/loginadmin") ||
    location.pathname.startsWith("/logoutadmin") ||
    location.pathname.startsWith("/superadmin");

  return (
    <div className={`flex flex-col ${isAdminPath ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      <Navbar />
      <main className={`flex-grow flex flex-col ${isAdminPath ? "h-[calc(100vh-64px)] overflow-hidden" : ""}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<IncubationPrograms />} />
          <Route path="/events" element={<Events />} />
          <Route path="/past-events" element={<PastEvents />} />
          <Route path="/mentors" element={<AdvisorsMentors />} />
          <Route path="/mentor-form" element={<MentorForm />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/incubatees" element={<Incubatees />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/about" element={<About />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/terms" element={<Terms />} />

          {/* Admin Dashboard Layout & Sub-Routes */}
          <Route path="/admin" element={<Admin />}>
            <Route index element={<Navigate to="events" replace />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="incubatees" element={<AdminIncubatees />} />
            <Route path="mentors" element={<AdminMentors />} />
            <Route path="mentor-applications" element={<AdminMentorApplications />} />
            <Route path="incubation-applications" element={<AdminIncubationApplications />} />
            <Route path="contact-submissions" element={<AdminContactSubmissions />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>
          <Route path="/loginadmin" element={<LoginAdmin />} />
          <Route path="/logoutadmin" element={<LogoutAdmin />} />

          {/* Super Admin Dashboard Layout & Sub-Routes */}
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
