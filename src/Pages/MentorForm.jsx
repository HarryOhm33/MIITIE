import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaGraduationCap,
  FaLinkedin,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const MentorForm = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    expertise: "",
    experience: "",
    linkedin: "",
    motivation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
          form_type: "MIITIE Mentor Application",
          ...formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Mentor application submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          profession: "",
          expertise: "",
          experience: "",
          linkedin: "",
          motivation: "",
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
    <div className="min-h-screen bg-gradient-to-r from-orange-50 to-yellow-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Become a <span className="text-orange-500">Mentor</span>
          </h1>
          <motion.div
            className="w-24 h-1 bg-orange-500 mx-auto mt-3"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Share your expertise and guide the next generation of entrepreneurs.
            Fill out this form to join our mentor network.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-orange-500 to-yellow-400">
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white"
            >
              Mentor Application
            </motion.h2>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="p-6 md:p-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div variants={itemVariants} className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                  <FaUser className="mr-2 text-orange-500" />
                  Personal Information
                </h3>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Full Name <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                      placeholder="Your full name"
                    />
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Email <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                      placeholder="your@email.com"
                    />
                    <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Phone <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                      placeholder="+91 9876543210"
                    />
                    <FaPhone className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                    <FaLinkedin className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                  <FaBriefcase className="mr-2 text-orange-500" />
                  Professional Information
                </h3>

                <div>
                  <label
                    htmlFor="profession"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Current Profession{" "}
                    <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                      placeholder="Your current role"
                    />
                    <FaBriefcase className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="expertise"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Areas of Expertise{" "}
                    <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="expertise"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                      placeholder="e.g., Marketing, Finance, Tech"
                    />
                    <FaGraduationCap className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Years of Experience{" "}
                    <span className="text-orange-500">*</span>
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select experience</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-6">
                Additional Information
              </h3>
              <div>
                <label
                  htmlFor="motivation"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Why do you want to mentor startups?{" "}
                  <span className="text-orange-500">*</span>
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  rows="5"
                  value={formData.motivation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Share your motivation and what you hope to contribute"
                  maxLength="1000"
                ></textarea>
                <span className="text-xs text-gray-500 block text-right mt-1">
                  {formData.motivation.length}/1000 characters
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6"
            >
              <p className="text-gray-600 text-sm">
                By submitting this form, you agree to our{" "}
                <Link to="/terms" className="text-orange-500 hover:underline">
                  Terms and Conditions
                </Link>
                .
              </p>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Apply to Mentor"
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default MentorForm;
