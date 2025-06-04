import { useState, useEffect } from "react";
import demo from "../../assets/demo.png";
import saara from "../../assets/developer-img/saara.jpg";
import aarti from "../../assets/developer-img/aarti.jpg";
import shivi from "../../assets/developer-img/shivi.jpg";
import ram from "../../assets/developer-img/ram.jpg";
import anirudh from "../../assets/developer-img/anirudh.jpg";
import { FaGithub } from "react-icons/fa";
const developers = [
  {
    name: "Ayush Sharma",
    role: "Mentor",
    image: demo,
    linkedin: "https://www.linkedin.com/in/ayush-sharma-a155a8267/",
    github: "https://github.com/AyushSharma72",
  },
  {
    name: "Saara Khan",
    role: "Developer",
    image: saara,
    linkedin: "https://www.linkedin.com/in/saarakhan001/",
    github: "https://github.com/saarakhan",
  },
  {
    name: "Shivi Tiwari",
    role: "Developer",
    image: shivi,
    linkedin: "https://www.linkedin.com/in/shivi-tiwari-7a669b289/",
    github: "https://github.com/shivi028",
  },
  {
    name: "Anirudh Saksena",
    role: "Developer",
    image: anirudh,
    linkedin: "https://www.linkedin.com/in/anirudh-saksena-b41607258/",
    github: "https://github.com/A-Knee09",
  },
  {
    name: "Animesh Mishra",
    role: "Developer",
    image: demo,
    linkedin: "https://www.linkedin.com/in/animesh-mishra-944287256/",
    github: "https://github.com/aniismess",
  },
  {
    name: "Ram Patidar",
    role: "Developer",
    image: ram,
    linkedin: "https://www.linkedin.com/in/ram--patidar/",
    github: "https://github.com/ram40803",
  },
  {
    name: "Aarti Verma",
    role: "Developer",
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

          <div className="space-y-10">
            {/* First Row - 4 Developers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {developers.slice(0, 4).map((developer, index) => (
                <div className="text-center" key={index}>
                  <img
                    src={developer.image}
                    alt={developer.name}
                    className="h-[225px] w-[225px] rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3
                    className="text-[16px] font-semibold text-black cursor-pointer hover:text-[#C79745]"
                    onClick={() => window.open(developer.linkedin, "_blank")}
                  >
                    {developer.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <p className="text-sm text-gray-600">{developer.role}</p>
                    <FaGithub
                      className="text-black hover:text-[#C79745] cursor-pointer"
                      onClick={() => window.open(developer.github, "_blank")}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Second Row - 3 Developers Centered */}
            <div className="flex justify-center gap-6 flex-wrap">
              {developers.slice(4).map((developer, index) => (
                <div className="text-center" key={index}>
                  <img
                    src={developer.image}
                    alt={developer.name}
                    className="h-[225px] w-[225px] rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3
                    className="text-[16px] font-semibold text-black cursor-pointer hover:text-[#C79745]"
                    onClick={() => window.open(developer.linkedin, "_blank")}
                  >
                    {developer.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <p className="text-sm text-gray-600">{developer.role}</p>
                    <FaGithub
                      className="text-black hover:text-[#C79745] cursor-pointer"
                      onClick={() => window.open(developer.github, "_blank")}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
