import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { 
      name: 'Programs', 
      path: '/programs',
      subLinks: [
        { name: 'Pre-Incubation', path: '/programs/pre' },
        { name: 'Full Incubation', path: '/programs/full' },
        { name: 'Corporate Partnership', path: '/programs/corporate' }
      ]
    },
    { name: 'Events', path: '/events' },
    { name: 'Notifications', path: '/notifications' },
    { name: 'Mentors', path: '/mentors' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <header 
      className="bg-white shadow-md sticky top-0 z-50"
      ref={navbarRef}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
            aria-label="Home"
          >
            <div className="bg-orange-500 text-white font-bold text-xl p-2 rounded mr-2 transition-transform hover:scale-105">
              MIITIE
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              Startup Incubation Centre
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <div key={index} className="relative">
                {link.subLinks ? (
                  <div className="relative group">
                    <button
                      className={`px-4 py-2 font-medium flex items-center transition-colors rounded-md ${
                        location.pathname.startsWith(link.path) 
                          ? 'text-orange-500' 
                          : 'text-gray-700 hover:text-orange-500'
                      }`}
                      onClick={() => toggleDropdown(index)}
                      aria-expanded={activeDropdown === index}
                      aria-haspopup="true"
                    >
                      {link.name}
                      {activeDropdown === index ? (
                        <FaChevronUp className="ml-1 text-xs" />
                      ) : (
                        <FaChevronDown className="ml-1 text-xs" />
                      )}
                    </button>
                    
                    <div 
                      className={`absolute left-0 mt-1 w-48 bg-white shadow-lg rounded-md py-1 z-50 transition-all duration-200 origin-top ${
                        activeDropdown === index 
                          ? 'scale-y-100 opacity-100 visible' 
                          : 'scale-y-95 opacity-0 invisible'
                      }`}
                    >
                      {link.subLinks.map((subLink, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subLink.path}
                          className={`block px-4 py-2 transition-colors ${
                            location.pathname === subLink.path
                              ? 'bg-orange-50 text-orange-500'
                              : 'text-gray-700 hover:bg-orange-50 hover:text-orange-500'
                          }`}
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`px-4 py-2 font-medium transition-colors rounded-md ${
                      location.pathname === link.path
                        ? 'text-orange-500'
                        : 'text-gray-700 hover:text-orange-500'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <Link
              to="/apply"
              className="ml-4 px-6 py-2 bg-yellow-400 text-gray-800 font-medium rounded-md hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Apply Now
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded p-1"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav 
          className={`md:hidden bg-white overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-screen py-4' : 'max-h-0 py-0'
          }`}
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link, index) => (
              <div key={index}>
                {link.subLinks ? (
                  <div className="flex flex-col">
                    <button
                      className="px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded transition-colors flex justify-between items-center"
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
                    <div 
                      className={`pl-6 overflow-hidden transition-all duration-200 ${
                        activeDropdown === index ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      {link.subLinks.map((subLink, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subLink.path}
                          className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded transition-colors"
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded transition-colors"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <Link
              to="/apply"
              className="mt-4 px-6 py-2 bg-yellow-400 text-gray-800 font-medium rounded-md hover:bg-yellow-500 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Apply Now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;