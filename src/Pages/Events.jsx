import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRegClock,
  FaUserPlus,
  FaTimes,
  FaSearchPlus,
  FaSearchMinus,
} from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { events } from "../assets/events";
import { Link } from "react-router-dom";

const Events = () => {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const upcomingEvents = events.filter((event) => event.isUpcoming);

  const openFullscreen = (image, alt) => {
    setFullscreenImage({ image, alt });
    setIsFullscreen(true);
    document.body.style.overflow = "hidden";
    setZoom(1); // Reset zoom
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = "auto";
    setZoom(1);
  };

  const handleWheelZoom = (e) => {
    if (!isFullscreen) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(3, Math.max(0.5, prev + delta)));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
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
        {/* Heading */}
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
          {upcomingEvents.map((event) => (
            <motion.div
              key={event.id}
              variants={cardVariants}
              className="bg-white border border-orange-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
            >
              <div
                className="relative h-56 w-full overflow-hidden group cursor-pointer"
                onClick={() => openFullscreen(event.image, event.alt)}
              >
                <img
                  src={event.image}
                  alt={event.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                  {event.registrationRequired && (
                    <div className="flex items-center text-orange-500 font-medium">
                      <FaUserPlus className="mr-2" />
                      <span>Registration Required</span>
                    </div>
                  )}
                </div>

                {event.registrationRequired ? (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Register Now
                  </a>
                ) : (
                  <div className="mt-6 px-6 py-2 bg-gray-100 text-gray-600 rounded-md">
                    Open to all
                  </div>
                )}
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
          <Link
            to="/past-events"
            className="inline-block px-8 py-3 bg-yellow-400 text-gray-800 font-medium rounded-md hover:bg-yellow-500 transition-colors"
          >
            View Past Events
          </Link>
        </motion.div>

        {/* Fullscreen Image Viewer */}
        <AnimatePresence>
          {isFullscreen && fullscreenImage && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeFullscreen}
              onWheel={handleWheelZoom}
            >
              <motion.div
                className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                ref={imageContainerRef}
              >
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 z-10 text-white hover:text-orange-400 transition-colors"
                  onClick={closeFullscreen}
                  aria-label="Close fullscreen"
                >
                  <FaTimes className="text-3xl" />
                </button>

                {/* Zoom Buttons (mobile) */}
                <div className="absolute bottom-4 left-4 flex gap-4 sm:hidden">
                  <button
                    className="bg-white/90 text-orange-600 p-2 rounded-full shadow"
                    onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
                  >
                    <FaSearchPlus />
                  </button>
                  <button
                    className="bg-white/90 text-orange-600 p-2 rounded-full shadow"
                    onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.2))}
                  >
                    <FaSearchMinus />
                  </button>
                </div>

                {/* Zoomable Image */}
                <motion.div
                  drag
                  dragMomentum={false}
                  className="cursor-grab active:cursor-grabbing max-h-full max-w-full overflow-hidden"
                  style={{ scale: zoom }}
                >
                  <img
                    src={fullscreenImage.image}
                    alt={fullscreenImage.alt}
                    className="object-contain max-h-[90vh] max-w-full select-none pointer-events-none"
                    draggable={false}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Events;
