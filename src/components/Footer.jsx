import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Events', path: '/events' },
    { name: 'Mentors', path: '/mentors' },
    { name: 'Contact', path: '/contact' },
  ];

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, text: 'Darbhanga College of Engineering, Darbhanga, Bihar - 846004' },
    { icon: <FaPhoneAlt />, text: '+91 1234567890' },
    { icon: <FaEnvelope />, text: 'incubation@dce.ac.in' },
  ];

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Column */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-orange-400">MIITIE Incubation Centre</h3>
            <p className="text-gray-300 mb-4">
              Empowering student entrepreneurs with resources, mentorship, and infrastructure to transform innovative ideas into successful businesses.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path} 
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-400 mr-3 mt-1">{item.icon}</span>
                  <span className="text-gray-300">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MIITIE Startup Incubation Centre, DCE Darbhanga. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;