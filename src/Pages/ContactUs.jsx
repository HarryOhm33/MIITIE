import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-16 mt-[-1.6rem]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            <span className="text-orange-500">Contact</span> Us
          </h2>
          <motion.div
            className="w-24 h-1 bg-orange-500 mx-auto mt-3"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-12"
        >
          {/* Contact Info Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Get in Touch
            </h3>

            <div className="space-y-6">
              {[
                {
                  icon: <FaMapMarkerAlt className="text-orange-500" />,
                  title: "Address",
                  content: (
                    <>
                      Miitie Startup Incubation Centre
                      <br />
                      Darbhanga College of Engineering
                      <br />
                      Darbhanga, Bihar - 846004
                    </>
                  ),
                },
                {
                  icon: <FaPhoneAlt className="text-orange-500" />,
                  title: "Phone",
                  content: "+91 1234567890",
                },
                {
                  icon: <FaEnvelope className="text-orange-500" />,
                  title: "Email",
                  content: "incubation@dce.ac.in",
                },
                {
                  icon: <FaClock className="text-orange-500" />,
                  title: "Working Hours",
                  content: "Monday - Saturday: 9:00 AM - 5:00 PM",
                },
              ].map(({ icon, title, content }, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start"
                >
                  <div className="bg-orange-100 p-3 rounded-full mr-4">
                    {icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{title}</h4>
                    <p className="text-gray-600">{content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Send Us a Message
            </h3>
            <form className="space-y-4">
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your Email"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="subject" className="block text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Subject"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="message" className="block text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Your Message"
                ></textarea>
              </motion.div>

              <motion.button
                type="submit"
                variants={itemVariants}
                className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 bg-orange-50 p-8 rounded-lg"
        >
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Location Map
          </h3>
          <div className="aspect-w-16 aspect-h-9 bg-orange-100 flex items-center justify-center rounded-lg">
            <span className="text-2xl text-orange-300">Google Maps Embed</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
