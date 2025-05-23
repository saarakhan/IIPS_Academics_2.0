import HeroImage from "../../assets/HeroImage.png";
import CardGroup from "./CardGroup";
import SectionNav from "../Navbar/SectionNav.jsx"
import Typewriter from "./typewriter.jsx"
import Footer from "./Footer.jsx";

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
