import { motion } from "framer-motion";
import {
  FaYoutube,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import miitieLogo from "../assets/miitie-logo.png";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Programs", path: "/programs" },
    { name: "Events", path: "/events" },
    { name: "Mentors", path: "/mentors" },
    { name: "Incubatees", path: "/incubatees" },
    { name: "Facilities", path: "/facilities" },
    { name: "Admin Dashboard", path: "/admin" },
  ];

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      text: "Heritage Building, Darbhanga College of Engineering, Darbhanga, Bihar - 846005",
    },
    {
      icon: <FaPhoneAlt />,
      text: "+91-7004906223",
      link: "tel:+917004906223",
    },
    {
      icon: <FaEnvelope />,
      text: "miitiedarbhanga0407@gmail.com",
      link: "mailto:miitiedarbhanga0407@gmail.com",
    },
  ];

  const socialLinks = [
    {
      icon: <FaYoutube size={20} />,
      url: "https://www.youtube.com/channel/UC1qosWn6v4BrixCmpdxMVUQ",
    },
    { icon: <FaTwitter size={20} />, url: "https://x.com/miitie_mithila" },
    {
      icon: <FaLinkedin size={20} />,
      url: "https://www.linkedin.com/in/m-i-i-t-i-e-752458280/",
    },
    {
      icon: <FaInstagram size={20} />,
      url: "https://www.instagram.com/miitie_mithila/",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.footer
      className="bg-gray-800 text-white pt-12 pb-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Column */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <motion.div
              className="flex items-center mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={miitieLogo}
                alt="MIITIE Logo"
                loading="lazy"
                className="w-40 object-contain rounded-lg border-2 border-orange-300 p-0.5 mr-2"
              />
              <h3 className="text-xl font-bold text-orange-400">
                Incubation Centre
              </h3>
            </motion.div>
            <motion.p className="text-gray-300 mb-4" whileHover={{ x: 5 }}>
              Empowering student entrepreneurs with resources, mentorship, and
              infrastructure to transform innovative ideas into successful
              businesses.
            </motion.p>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-orange-400 transition-colors cursor-pointer"
                  whileHover={{
                    y: -3,
                    scale: 1.2,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <p className="text-[11px] text-gray-500/50 tracking-wider font-normal select-none transition-colors duration-300">
              An effort by{" "}
              <a
                href="https://www.linkedin.com/in/sakshi-kumari-576630292/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-300 cursor-pointer"
              >
                Sakshi
              </a>
              ,{" "}
              <a
                href="https://www.linkedin.com/in/harryohm33/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-300 cursor-pointer"
              >
                Hari
              </a>
              , and{" "}
              <a
                href="https://www.linkedin.com/in/ankit-kumar-43495927b/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-300 cursor-pointer"
              >
                Ankit
              </a>{" "}
              — 2K23 Batch
            </p>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div variants={itemVariants}>
            <motion.h3
              className="text-xl font-bold mb-4 text-orange-400"
              whileHover={{ scale: 1.02 }}
            >
              Quick Links
            </motion.h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-orange-400 transition-colors block"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div variants={itemVariants}>
            <motion.h3
              className="text-xl font-bold mb-4 text-orange-400"
              whileHover={{ scale: 1.02 }}
            >
              Contact Us
            </motion.h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-orange-400 mr-3 mt-1">{item.icon}</span>
                  {item.link ? (
                    <a
                      href={item.link}
                      className="text-gray-300 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-gray-300">{item.text}</span>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400"
          variants={itemVariants}
        >
          <p>
            &copy; {new Date().getFullYear()} MIITIE Incubation Centre, DCE
            Darbhanga. All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
