import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import IncubationPrograms from "./Pages/IncubationPrograms";
import Events from "./Pages/Events";
import AdvisorsMentors from "./Pages/AdvisorsMentors";
import Facilities from "./Pages/Facilities";
import ContactUs from "./Pages/ContactUs";
import Apply from "./Pages/Apply";
import NotFound from "./Pages/NotFound";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<IncubationPrograms />} />
            <Route path="/events" element={<Events />} />
            <Route path="/mentors" element={<AdvisorsMentors />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
