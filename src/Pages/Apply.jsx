import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLightbulb,
} from "react-icons/fa";
import toast from "react-hot-toast";

const Apply = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    projectTitle: "",
    startupIdea: "",
    teamMembers: "",
    stage: "idea",
    fundingNeeded: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

    // Truncate long fields to prevent "request too long" error
    const truncatedData = {
      ...formData,
      startupIdea: formData.startupIdea.substring(0, 1000), // Limit to 1000 chars
      address: formData.address.substring(0, 500), // Limit to 500 chars
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          form_type: "MIITIE Application Form",
          ...truncatedData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Application submitted successfully!");
        setSubmitSuccess(true);
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          mobile: "",
          address: "",
          projectTitle: "",
          startupIdea: "",
          teamMembers: "",
          stage: "idea",
          fundingNeeded: "",
        });
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      toast.error(
        error.message ||
          "Submission failed. Please try again with shorter responses."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-r from-orange-50 to-yellow-50 py-16"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Application Submitted!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for applying to the MIITIE Startup Incubation Centre.
            We've received your application and will review it shortly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              to="/programs"
              className="px-6 py-3 border border-orange-500 text-orange-500 font-medium rounded-md hover:bg-orange-50 transition-colors"
            >
              Explore Programs
            </Link>
          </div>
        </motion.div>
      </motion.div>
    );
  }

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
            Apply to <span className="text-orange-500">MIITIE Incubation</span>
          </h1>
          <motion.div
            className="w-24 h-1 bg-orange-500 mx-auto mt-3"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Fill out this form to apply for our startup incubation programs. Our
            team will review your application and get back to you soon.
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
              Application Form
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
              {/* Personal Information */}
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
                      placeholder="John Doe"
                    />
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Email Address <span className="text-orange-500">*</span>
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
                      placeholder="john@example.com"
                    />
                    <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Mobile Number <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
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
                    htmlFor="address"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Address <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                      placeholder="Your complete address"
                      maxLength="500"
                    ></textarea>
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                    <span className="text-xs text-gray-500 block text-right mt-1">
                      {formData.address.length}/500 characters
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Startup Information */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                  <FaLightbulb className="mr-2 text-orange-500" />
                  Startup Details
                </h3>

                <div>
                  <label
                    htmlFor="projectTitle"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Project Title <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="projectTitle"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your innovative project name"
                    maxLength="100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="startupIdea"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Brief Idea <span className="text-orange-500">*</span>
                  </label>
                  <textarea
                    id="startupIdea"
                    name="startupIdea"
                    value={formData.startupIdea}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe your startup idea in 200-300 words"
                    maxLength="1000"
                  ></textarea>
                  <span className="text-xs text-gray-500 block text-right mt-1">
                    {formData.startupIdea.length}/1000 characters
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="teamMembers"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Team Members
                  </label>
                  <input
                    type="text"
                    id="teamMembers"
                    name="teamMembers"
                    value={formData.teamMembers}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Names and roles of team members"
                    maxLength="200"
                  />
                </div>
              </motion.div>
            </div>

            {/* Additional Information */}
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-6">
                Additional Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="stage"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Current Stage <span className="text-orange-500">*</span>
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="idea">Idea Stage</option>
                    <option value="prototype">Prototype Development</option>
                    <option value="mvp">MVP Ready</option>
                    <option value="revenue">Generating Revenue</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="fundingNeeded"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Funding Needed (₹)
                  </label>
                  <input
                    type="text"
                    id="fundingNeeded"
                    name="fundingNeeded"
                    value={formData.fundingNeeded}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Estimated funding requirement"
                    maxLength="50"
                  />
                </div>
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
                  "Submit Application"
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default Apply;
