import { FaLinkedin, FaUniversity, FaBriefcase } from 'react-icons/fa';

const AdvisorsMentors = () => {
  const teamMembers = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Director, DCE Darbhanga",
      expertise: "Academic Leadership",
      image: "/advisor-1.jpg",
      linkedin: "#"
    },
    {
      name: "Ms. Priya Sharma",
      role: "Startup Founder",
      expertise: "E-commerce & Retail",
      image: "/advisor-2.jpg",
      linkedin: "#"
    },
    {
      name: "Mr. Amit Patel",
      role: "VC Partner",
      expertise: "Investment & Funding",
      image: "/advisor-3.jpg",
      linkedin: "#"
    },
    {
      name: "Dr. Sunita Verma",
      role: "Professor, Innovation",
      expertise: "Product Development",
      image: "/advisor-4.jpg",
      linkedin: "#"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Our <span className="text-orange-500">Advisors & Mentors</span>
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-40 h-40 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                <span className="text-4xl text-orange-300">Photo</span>
                {/* Replace with actual image: <img src={member.image} alt={member.name} className="w-full h-full object-cover" /> */}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
              <p className="text-orange-500 font-medium">{member.role}</p>
              <div className="flex items-center justify-center mt-2 text-gray-600 text-sm">
                <FaBriefcase className="mr-1" />
                <span>{member.expertise}</span>
              </div>
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-3 p-2 bg-gray-100 rounded-full hover:bg-orange-100 transition-colors"
              >
                <FaLinkedin className="text-gray-700" />
              </a>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors">
            Become a Mentor
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdvisorsMentors;