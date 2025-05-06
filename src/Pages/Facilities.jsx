import { FaWifi, FaDesktop, FaChalkboardTeacher, FaCoffee } from 'react-icons/fa';

const Facilities = () => {
  const facilities = [
    {
      title: "Coworking Space",
      icon: <FaDesktop className="text-4xl text-orange-500" />,
      description: "Modern workstations with high-speed internet for collaborative work"
    },
    {
      title: "Meeting Rooms",
      icon: <FaChalkboardTeacher className="text-4xl text-orange-500" />,
      description: "Equipped with presentation tools for client meetings and discussions"
    },
    {
      title: "High-Speed Internet",
      icon: <FaWifi className="text-4xl text-orange-500" />,
      description: "Dedicated leased line for uninterrupted connectivity"
    },
    {
      title: "Cafeteria",
      icon: <FaCoffee className="text-4xl text-orange-500" />,
      description: "Refreshment zone for networking and informal discussions"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Our <span className="text-orange-500">Facilities</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {facilities.map((facility, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                {facility.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{facility.title}</h3>
              <p className="text-gray-600">{facility.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Virtual Tour</h3>
          <div className="aspect-w-16 aspect-h-9 bg-orange-100 flex items-center justify-center rounded-lg">
            <span className="text-2xl text-orange-300">360° Virtual Tour Embed</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;