import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import miitieLogo from "../assets/miitie-logo.jpg"; // Adjust the path as necessary

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navbarRef = useRef(null);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    {
      name: "Programs",
      path: "/programs",
    },
    { name: "Events", path: "/events" },
    { name: "Mentors", path: "/mentors" },
    { name: "Incubatees", path: "/incubatees" },
    { name: "Facilities", path: "/facilities" },
    { name: "Contact", path: "/contact" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <header
      className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100"
      ref={navbarRef}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded-md group"
            aria-label="Home"
          >
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={miitieLogo}
                  alt="MIITIE Logo"
                  className="h-12 object-contain rounded-lg border-2 border-orange-300 p-0.5"
                />
              </motion.div>
              <span className="ml-2 text-lg font-bold text-gray-800 hidden sm:block">
                Incubation Centre
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <div key={index} className="relative h-full flex items-center">
                {link.subLinks ? (
                  <div className="relative group h-full flex items-center">
                    <Link
                      to={link.path}
                      className={`px-4 py-2 font-medium flex items-center transition-colors rounded-md h-full ${
                        location.pathname.startsWith(link.path)
                          ? "text-orange-500"
                          : "text-gray-700 hover:text-orange-500"
                      }`}
                      onClick={(e) => {
                        if (activeDropdown === index) {
                          e.preventDefault();
                        }
                        toggleDropdown(index);
                      }}
                      aria-haspopup="true"
                    >
                      {link.name}
                      {activeDropdown === index ? (
                        <FaChevronUp className="ml-1 text-xs" />
                      ) : (
                        <FaChevronDown className="ml-1 text-xs" />
                      )}
                    </Link>

                    <AnimatePresence>
                      {activeDropdown === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 top-full mt-1 w-56 bg-white shadow-lg rounded-md py-1 z-50 border border-gray-100"
                        >
                          {link.subLinks.map((subLink, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subLink.path}
                              className={`block px-4 py-2.5 transition-colors text-sm ${
                                location.pathname === subLink.path
                                  ? "bg-orange-50 text-orange-500 font-medium"
                                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                              }`}
                            >
                              {subLink.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`px-4 py-2 font-medium transition-colors rounded-md ${
                      location.pathname === link.path
                        ? "text-orange-500"
                        : "text-gray-700 hover:text-orange-500"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <Link
              to="/apply"
              className="ml-4 px-5 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Apply Now
            </Link>
          </nav>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md p-1"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? (
              <FaTimes size={22} className="text-orange-500" />
            ) : (
              <FaBars size={22} />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white overflow-hidden"
            >
              <div className="flex flex-col space-y-1 pb-4">
                {navLinks.map((link, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 last:border-0"
                  >
                    {link.subLinks ? (
                      <div className="flex flex-col">
                        <button
                          className={`px-4 py-3 text-left flex justify-between items-center w-full ${
                            location.pathname.startsWith(link.path)
                              ? "text-orange-500 font-medium"
                              : "text-gray-700"
                          }`}
                          onClick={() => toggleDropdown(index)}
                          aria-expanded={activeDropdown === index}
                        >
                          {link.name}
                          {activeDropdown === index ? (
                            <FaChevronUp className="ml-1 text-xs" />
                          ) : (
                            <FaChevronDown className="ml-1 text-xs" />
                          )}
                        </button>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{
                            height: activeDropdown === index ? "auto" : 0,
                          }}
                          className="overflow-hidden pl-4"
                        >
                          {link.subLinks.map((subLink, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subLink.path}
                              className={`block px-4 py-2.5 text-sm ${
                                location.pathname === subLink.path
                                  ? "bg-orange-50 text-orange-500 font-medium"
                                  : "text-gray-700 hover:bg-orange-50"
                              }`}
                            >
                              {subLink.name}
                            </Link>
                          ))}
                        </motion.div>
                      </div>
                    ) : (
                      <Link
                        to={link.path}
                        className={`block px-4 py-3 ${
                          location.pathname === link.path
                            ? "text-orange-500 font-medium"
                            : "text-gray-700 hover:bg-orange-50"
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
                <Link
                  to="/apply"
                  className="mx-4 mt-3 px-5 py-2.5 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 text-center transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Apply Now
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
