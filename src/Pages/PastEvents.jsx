import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt, FaRegClock, FaTimes } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
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
import { Link } from "react-router-dom";

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
          scale: Math.max(0.5, Math.min(5, scale.get() - dy * 0.005)),
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

const PastEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchPastEvents();
  }, []);

  const fetchPastEvents = async () => {
    try {
      const now = new Date();
      const eventsRef = collection(db, "events");
      const querySnapshot = await getDocs(eventsRef);

      const eventsList = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((event) => {
          if (!event.date) return false;
          const cutoff = new Date(event.date);
          cutoff.setHours(20, 0, 0, 0); // 8:00 PM cutoff
          return now > cutoff;
        });

      // Sort events by date in descending order (most recent first)
      eventsList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(eventsList);
    } catch (error) {
      console.error("Error fetching past events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-12">
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
            Past <span className="text-orange-500">Events</span>
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
        ) : /* Event Cards */
        events.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event) => (
              <motion.div
                key={event.id}
                variants={cardVariants}
                className="bg-white border border-orange-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
              >
                <div
                  className="relative h-48 w-full overflow-hidden group cursor-pointer"
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
                  <p className="text-gray-600 mb-4 text-sm">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-4 text-xs">
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2 text-orange-500" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-orange-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaRegClock className="mr-2 text-orange-500" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No past events available</p>
          </div>
        )}

        {/* Back to Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/events"
            className="inline-block px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors"
          >
            View Upcoming Events
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
                className="absolute top-4 right-4 text-white text-2xl hover:text-orange-500 transition-colors border-0 bg-transparent cursor-pointer"
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

export default PastEvents;
