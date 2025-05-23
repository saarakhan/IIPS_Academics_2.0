import { Link } from "react-router-dom";
import HeroImage from "../../assets/HeroImage.png";
import CardGroup from "./CardGroup";
import SectionNav from "../Navbar/SectionNav.jsx"
import Typewriter from "./typewriter.jsx"
function HeroSection() {
  return (
    <section className="bg-[#F3F6F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <Typewriter text="Welcome to IIPS Academics" speed={50} />
          </h1>
          <p className="text-xl md:text-2xl text-gray-700">
            We brought you everything faculty notes, previous papers, syllabus,
            placement data, events, clubs.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white border-2 border-black px-6 py-3 rounded-lg font-semibold shadow-[8px_5px_4px_0px_rgba(0,0,0,0.25)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_2px_4px_0px_rgba(0,0,0,0.25)] transition-all">
              Explore Academics
            </button>
            <button className="bg-[#2B3333] text-white px-6 py-3 rounded-lg font-semibold shadow-[8px_5px_4px_0px_rgba(0,0,0,0.25)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_2px_4px_0px_rgba(0,0,0,0.25)] transition-all">
              Upcoming Events
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img 
            src={HeroImage} 
            alt="Hero" 
            className="w-full max-w-md rounded-lg" 
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-[#C79745]">
      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">IIPS Academics</h3>
          <p className="text-gray-600">
            The unofficial website for IIPS providing resources and info for students.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {["Academics", "Placements", "Events", "About"].map((item) => (
              <li key={item}>
                <Link 
                  to={`/${item.toLowerCase()}`} 
                  className="text-gray-700 hover:text-[#C79745] transition-colors"
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
                  to={`/${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-gray-700 hover:text-[#C79745] transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[#C79745] py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2025 IIPS Academics. All rights reserved
        </div>
      </div>
    </footer>
  );
}

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <SectionNav />
      <main className="flex-grow">
        <CardGroup />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
