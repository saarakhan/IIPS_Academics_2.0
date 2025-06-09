import saara from "../../assets/developer-img/saara.jpg";
import aarti from "../../assets/developer-img/aarti.jpg";
import shivi from "../../assets/developer-img/shivi.jpg";
import ram from "../../assets/developer-img/ram.jpg";
import anirudh from "../../assets/developer-img/anirudh.jpg";
import Ayush from "../../assets/developer-img/Ayush.jpg";
import { FaUsers, FaLinkedin, FaGithub } from "react-icons/fa";

const developers = [
  {
    name: "Ayush Sharma",
    role: "Project Mentor & Full Stack Developer",
    image: Ayush,
    linkedin: "https://www.linkedin.com/in/ayush-sharma-a155a8267/",
    github: "https://github.com/AyushSharma72",
    badge: "Mentor",
  },
  {
    name: "Saara Khan",
    role: "Full Stack Developer",
    image: saara,
    linkedin: "https://www.linkedin.com/in/saarakhan001/",
    github: "https://github.com/saarakhan",
  },
  {
    name: "Shivi Tiwari",
    role: "Full Stack Developer",
    image: shivi,
    linkedin: "https://www.linkedin.com/in/shivi-tiwari-7a669b289/",
    github: "https://github.com/shivi028",
  },
  {
    name: "Anirudh Saksena",
    role: "UI/UX Designer & Frontend Developer",
    image: anirudh,
    linkedin: "https://www.linkedin.com/in/anirudh-saksena-b41607258/",
    github: "https://github.com/A-Knee09",
  },
  {
    name: "Animesh Mishra",
    role: "Backend Developer & Database Administrator",
    image: "/placeholder.svg?height=200&width=200",
    linkedin: "https://www.linkedin.com/in/animesh-mishra-944287256/",
    github: "https://github.com/aniismess",
  },
  {
    name: "Ram Patidar",
    role: "Frontend Developer",
    image: ram,
    linkedin: "https://www.linkedin.com/in/ram--patidar/",
    github: "https://github.com/ram40803",
  },
  {
    name: "Aarti Verma",
    role: "Frontend Developer",
    image: aarti,
    linkedin: "https://www.linkedin.com/in/aarti-verma-627983267",
    github: "https://github.com/AartiVerma4",
  },
];

export default function DevelopersSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaUsers className="w-8 h-8 text-[#c79745]" />
            <h2 className="text-4xl md:text-5xl font-bold text-[#2b3333]">
              Meet Our Team
            </h2>
          </div>
          <div className="w-24 h-1 bg-[#c79745] mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Our passionate team of developers and designers work collaboratively
            to create exceptional experiences for the IIPS community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {developers.map((developer, index) => (
            <div
              key={index}
              className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-lg overflow-hidden border border-gray-100"
            >
              <div className="p-6 text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-gray-100 group-hover:ring-[#c79745] transition-all duration-300">
                    <img
                      src={developer.image || "/placeholder.svg"}
                      alt={developer.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  {developer.badge && (
                    <span className="absolute -top-2 -right-2 bg-[#c79745] text-white text-xs px-2 py-1 rounded-full">
                      {developer.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#2b3333] mb-2 group-hover:text-[#c79745] transition-colors duration-200">
                  {developer.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {developer.role}
                </p>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => window.open(developer.linkedin, "_blank")}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-[#c79745] hover:bg-[#c79745] hover:text-white transition-all duration-200"
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(developer.github, "_blank")}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-[#2b3333] hover:bg-[#2b3333] hover:text-white transition-all duration-200"
                  >
                    <FaGithub className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
