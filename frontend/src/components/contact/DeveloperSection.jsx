import demo from "../../assets/demo.png";
import saara from "../../assets/developer-img/saara.jpg";
import aarti from "../../assets/developer-img/aarti.jpg";
import shivi from "../../assets/developer-img/shivi.jpg";
import ram from "../../assets/developer-img/ram.jpg";
import anirudh from "../../assets/developer-img/anirudh.jpg";
import Ayush from "../../assets/developer-img/Ayush.jpg"

import { FaGithub } from "react-icons/fa";

const developers = [
  {
    name: "Ayush Sharma",
    role: "Project Mentor & Full Stack Developer",
    image: Ayush,
    linkedin: "https://www.linkedin.com/in/ayush-sharma-a155a8267/",
    github: "https://github.com/AyushSharma72",
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
    image: demo,
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
    <>
      <section className="mb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2b3333]">
              Meet Our Developers
            </h2>
            <div className="w-24 h-1 bg-[#c79745] mx-auto mt-4 mb-4 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Our talented team of developers works tirelessly to create amazing
              experiences for our IIPS Community.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-10 px-4 py-6">
            {developers.map((developer, index) => (
              <div
                key={index}
                className="w-[250px] bg-white shadow-md rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={developer.image}
                  alt={developer.name}
                  className="h-[160px] w-[160px] rounded-full mx-auto mb-4 object-cover"
                  loading="lazy"
                />
                <h3
                  className="text-lg font-semibold text-black cursor-pointer hover:text-[#C79745]"
                  onClick={() => window.open(developer.linkedin, "_blank")}
                >
                  {developer.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{developer.role}</p>
                <div className="flex justify-center mt-2">
                  <FaGithub
                    className="text-xl text-black hover:text-[#C79745] cursor-pointer"
                    onClick={() => window.open(developer.github, "_blank")}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
