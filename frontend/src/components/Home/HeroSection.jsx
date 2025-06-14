import Typewriter from "./typewriter";
import { motion } from "framer-motion";
import HeroImage from "../../assets/HeroImage.png"; // if you use this instead of /hero-image.png
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-[#F4F9FF] to-[#E6F0FF] min-h-[90vh] flex items-center"
      style={{
        backgroundImage:
          "radial-gradient(circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), rgba(199, 151, 69, 0.15), transparent 30%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12 z-10">
        <motion.div
          className="md:w-1/2 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-1 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-[#C79745] shadow-sm border border-[#C79745]/20">
            IIPS Academic Portal
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
            <Typewriter text="Welcome to IIPS Academics" speed={50} />
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
            We brought you everything — faculty notes, previous papers,
            syllabus, placement data, events, clubs.
          </p>

          <div className="flex flex-wrap gap-5 pt-4">
            <Link to="/subjects">
              <button className="relative px-8 py-4 rounded-xl border-2 border-black bg-white text-lg font-semibold group overflow-hidden transition-transform duration-300 hover:scale-105 shadow-md">
                Explore Academics
              </button>
            </Link>

            <button
              className="relative px-8 py-4 rounded-xl text-white text-lg font-semibold
             bg-[#2B3333] group overflow-hidden transition duration-300 hover:scale-105 hover:shadow-[0_0_20px_#C79745] border-2 border-transparent
            "
            >
              Upcoming Events
            </button>
          </div>
        </motion.div>

        <motion.div
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#C79745]/20 to-blue-300/20 rounded-2xl blur-xl"></div>
            <img
              src={HeroImage}
              alt="IIPS Academics"
              width={600}
              height={500}
              className="relative w-full max-w-lg rounded-2xl shadow-2xl"
            />

            {/* <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-sm">
                  500+ Students Online
                </span>
              </div>
            </div> */}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-sm text-gray-500 mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
