import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRegClock,
  FaUserPlus,
  FaTimes,
} from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import {
  collection,
  query,
  getDocs,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

const ZoomableImage = ({ src, alt, onClose }) => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { tension: 300, friction: 30 },
  }));

  const bind = useGesture(
    {
      onDrag: ({ offset: [dx, dy], event, tap }) => {
        event.preventDefault();
        if (tap && scale.get() <= 1) {
          onClose();
          return;
        }
        api.start({ x: dx, y: dy });
      },
      onPinch: ({ offset: [d], event }) => {
        event.preventDefault();
        api.start({ scale: d });
      },
      onWheel: ({ delta: [, dy], event }) => {
        event.preventDefault();
        api.start({
          scale: Math.max(0.5, Math.min(5, scale.get() - dy * 0.005)), // Increased sensitivity
        });
      },
      onDoubleClick: ({ event }) => {
        event.preventDefault();
        const newScale = scale.get() > 1 ? 1 : 2;
        api.start({ scale: newScale, x: 0, y: 0 });
      },
    },
    {
      drag: {
        from: () => [x.get(), y.get()],
        bounds: () => {
          const currentScale = scale.get();
          if (currentScale <= 1)
            return { left: 0, right: 0, top: 0, bottom: 0 };

          const img = imgRef.current;
          if (!img) return { left: 0, right: 0, top: 0, bottom: 0 };

          const width = img.offsetWidth;
          const height = img.offsetHeight;
          const scaledWidth = width * currentScale;
          const scaledHeight = height * currentScale;

          return {
            left: -(scaledWidth - width) / 2,
            right: (scaledWidth - width) / 2,
            top: -(scaledHeight - height) / 2,
            bottom: (scaledHeight - height) / 2,
          };
        },
        rubberband: 0.1,
      },
      pinch: {
        scaleBounds: { min: 0.5, max: 5 },
        rubberband: true,
      },
      wheel: {
        eventOptions: { passive: false },
      },
    }
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden touch-none"
      onClick={(e) => {
        if (e.target === containerRef.current && scale.get() <= 1) {
          onClose();
        }
      }}
    >
      <animated.img
        {...bind()}
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          x,
          y,
          scale,
          touchAction: "none",
          cursor: scale.get() > 1 ? "grab" : "default",
        }}
        className="object-contain max-h-[90vh] max-w-full select-none"
        draggable={false}
      />
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("date", ">", today.toISOString()));
      const querySnapshot = await getDocs(q);

      const eventsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort events by date
      eventsList.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(eventsList);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const openFullscreen = (image, alt) => {
    setFullscreenImage({ image, alt });
    setIsFullscreen(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = "auto";
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

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : (
          /* Event Cards */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {events.length > 0 ? (
              events.map((event) => (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  className="bg-white border border-orange-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div
                    className="relative h-56 w-full overflow-hidden group cursor-zoom-in"
                    onClick={() => openFullscreen(event.image, event.alt)}
                  >
                    <img
                      src={event.image}
                      alt={event.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-2 text-orange-500" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="mr-2 text-orange-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="mr-2 text-orange-500" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {event.registrationRequired && (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                      >
                        <FaUserPlus className="mr-2" />
                        Register Now
                      </a>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 col-span-2">
                <p className="text-gray-600">No upcoming events available</p>
              </div>
            )}
          </motion.div>
        )}

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

        {/* Fullscreen Image Modal */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            >
              <button
                onClick={closeFullscreen}
                className="absolute top-4 right-4 text-white text-2xl hover:text-orange-500 transition-colors"
              >
                <FaTimes />
              </button>
              <ZoomableImage
                src={fullscreenImage?.image}
                alt={fullscreenImage?.alt}
                onClose={closeFullscreen}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Events;
