import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
const socialLinks = [
  { icon: <FaFacebookF />, name: "Facebook"  },
  { icon: <FaTwitter />, name: "Twitter" },
  { icon: <FaLinkedinIn />, name: "LinkedIn" },
  { icon: <FaInstagram />, name: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              IIPS <span className="text-[#C79745]">Academics</span>
            </h3>
            <p className="text-gray-400 mb-4">
              This website of IIPS providing resources and info for students.
            </p>

            <div className="flex space-x-4">
      {socialLinks.map((social, index) => (
        <a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          title={social.name}
          className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#C79745] transition-colors cursor-pointer"
        >
          <span className="text-white text-lg">{social.icon}</span>
        </a>
      ))}
    </div>    

          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Academics", "Placements", "Events", "About"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-[#C79745] transition-colors block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              {["Study Material", "Previous Year Papers", "Syllabus", "Timetable"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-400 hover:text-[#C79745] transition-colors block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              {["Help Center", "Guidelines", "Report Issue", "Feedback"].map((support) => (
                <li key={support}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#C79745] transition-colors block"
                  >
                    {support}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 IIPS Academics. All rights reserved. | University Affiliation</p>
        </div>
      </div>
    </footer>
  );
}
