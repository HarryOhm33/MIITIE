import { FaCalendarAlt, FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';

const Events = () => {
  const upcomingEvents = [
    {
      title: "Startup Bootcamp 2023",
      date: "15 Nov 2023",
      time: "10:00 AM - 4:00 PM",
      location: "DCE Auditorium",
      description: "Intensive workshop on lean startup methodologies",
      image: "/event-bootcamp.jpg"
    },
    {
      title: "Investor Connect",
      date: "28 Nov 2023",
      time: "2:00 PM - 5:00 PM",
      location: "Incubation Centre",
      description: "Networking session with angel investors and VCs",
      image: "/event-investor.jpg"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Upcoming <span className="text-orange-500">Events</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-orange-100 flex items-center justify-center">
                <span className="text-5xl text-orange-300">Event Image</span>
                {/* Replace with actual image: <img src={event.image} alt={event.title} className="w-full h-full object-cover" /> */}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="flex flex-wrap gap-4 mt-4">
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
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-yellow-400 text-gray-800 font-medium rounded-md hover:bg-yellow-500 transition-colors">
            View Past Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default Events;