import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          form_type: "MIITIE Contact Form", // Add this unique identifier
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Form submitted! We will get back to you shortly.");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      toast.error(error.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                      Heritage Building,
                      <br />
                      Darbhanga College of Engineering,
                      <br />
                      Darbhanga, Bihar - 846004
                    </>
                  ),
                },
                {
                  icon: <FaPhoneAlt className="text-orange-500" />,
                  title: "Phone",
                  content: (
                    <>
                      <a
                        href="tel:+917250840578"
                        className="hover:text-orange-500 transition-colors"
                      >
                        +91-7250840578
                      </a>
                      <br />
                      <a
                        href="tel:+917004906223"
                        className="hover:text-orange-500 transition-colors"
                      >
                        +91-7004906223
                      </a>
                    </>
                  ),
                },
                {
                  icon: <FaEnvelope className="text-orange-500" />,
                  title: "Email",
                  content: (
                    <a
                      href="mailto:miitiedarbhanga0407@gmail.com"
                      className="hover:text-orange-500 transition-colors"
                    >
                      miitiedarbhanga0407@gmail.com
                    </a>
                  ),
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
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your Email"
                    required
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
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Subject"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="message" className="block text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Your Message"
                  required
                ></textarea>
              </motion.div>

              <motion.button
                type="submit"
                variants={itemVariants}
                className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
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
          className="mt-16 bg-orange-50 p-4 sm:p-8 rounded-lg"
        >
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Location Map
          </h3>
          <div className="relative overflow-hidden pb-[56.25%] rounded-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d547.8457293722956!2d85.86481847194746!3d26.17928765360071!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39edb75b85cc6827%3A0x6323aca3b97a9fe1!2sDarbhanga%20College%20of%20Engineering%2C%20Darbhanga!5e0!3m2!1sen!2sin!4v1746726113619!5m2!1sen!2sin"
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MIITIE Location Map"
              style={{
                pointerEvents: "auto", // Crucial for mobile interactions
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
