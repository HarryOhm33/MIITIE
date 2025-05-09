import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import { useEffect } from "react";

const Events = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const upcomingEvents = [
    {
      title: "Startup Bootcamp 2023",
      date: "15 Nov 2023",
      time: "10:00 AM - 4:00 PM",
      location: "DCE Auditorium",
      description: "Intensive workshop on lean startup methodologies",
      image: "/event-bootcamp.jpg",
    },
    {
      title: "Investor Connect",
      date: "28 Nov 2023",
      time: "2:00 PM - 5:00 PM",
      location: "Incubation Centre",
      description: "Networking session with angel investors and VCs",
      image: "/event-investor.jpg",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-28 mt-[-4.4rem]">
      <div className="container mx-auto px-4">
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            Upcoming <span className="text-orange-500">Events</span>
          </h2>
          <motion.div
            className="w-24 h-1 bg-orange-500 mx-auto mt-3"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ transformOrigin: "center" }}
          />
        </motion.div>

        {/* Event Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1 }}
              className="bg-white border border-orange-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2 text-orange-500" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaRegClock className="mr-2 text-orange-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-orange-500" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <button className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                  Register Now
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View Past Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-yellow-400 text-gray-800 font-medium rounded-md hover:bg-yellow-500 transition-colors">
            View Past Events
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
