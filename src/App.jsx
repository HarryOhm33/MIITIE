import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import Admin from "./Pages/Hidden/Admin";
import LoginAdmin from "./Pages/Hidden/LoginAdmin";
import LogoutAdmin from "./Pages/Hidden/LogoutAdmin";

function AppContent() {
  const location = useLocation();
  
  // Hide main Navbar and Footer on Admin Portal pages and admin login/logout pages
  const isAdminPath =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/loginadmin") ||
    location.pathname.startsWith("/logoutadmin");

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

          {/* Admin Dashboard & Auth (Nested routes: /admin, /admin/events, /admin/incubatees, /admin/mentors, /admin/notifications) */}
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/loginadmin" element={<LoginAdmin />} />
          <Route path="/logoutadmin" element={<LogoutAdmin />} />

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
