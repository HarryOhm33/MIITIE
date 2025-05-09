import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaCoffee,
  FaDesktop,
  FaWifi,
} from "react-icons/fa";
import { useEffect } from "react";

const Facilities = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const facilities = [
    {
      title: "Coworking Space",
      icon: <FaDesktop className="text-2xl text-white" />,
      description:
        "Modern workstations with high-speed internet for collaborative work",
      image:
        "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Meeting Rooms",
      icon: <FaChalkboardTeacher className="text-2xl text-white" />,
      description:
        "Equipped with presentation tools for client meetings and discussions",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "High-Speed Internet",
      icon: <FaWifi className="text-2xl text-white" />,
      description: "Dedicated leased line for uninterrupted connectivity",
      image:
        "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Cafeteria",
      icon: <FaCoffee className="text-2xl text-white" />,
      description: "Refreshment zone for networking and informal discussions",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-16 mt-[-1rem]">
      <div className="container mx-auto px-4">
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 ">
            Our <span className="text-orange-500">Facilities</span>
          </h2>
          <motion.div
            className="w-24 h-1 bg-orange-500 mx-auto mt-3"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>

        {/* Animated Facilities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <div className="h-56 w-full overflow-hidden">
                  {" "}
                  {/* Increased image height here */}
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3 bg-orange-500 p-2 rounded-full shadow-lg">
                  {facility.icon}
                </div>
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {facility.title}
                </h3>
                <p className="text-gray-600 text-sm">{facility.description}</p>
                <button
                  className="mt-3 text-orange-500 hover:underline"
                  onClick={() => alert("More images coming soon!")} // Add functionality as needed
                >
                  View More Images
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Virtual Tour Section */}
        <motion.div
          className="mt-16 bg-white p-8 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Take a Virtual Tour
          </h3>
          <div className="aspect-w-16 aspect-h-9 bg-orange-100 flex items-center justify-center rounded-lg overflow-hidden py-6">
            <iframe
              width="560"
              height="315"
              className="rounded-lg"
              src="https://www.youtube.com/embed/clOImDZiS9g?si=Dw9Z9uM-7_8sbxCu"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Facilities;
