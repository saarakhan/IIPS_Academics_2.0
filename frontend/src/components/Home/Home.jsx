import { useState } from "react";
import { Link } from "react-router-dom";
import  HeroImage  from "../../assets/HeroImage.png";
import CardGroup from "./CardGroup";

function HeroSection() {
  return (
    <section className="bg-gray-100 py-10 px-4 h-screen">
      <div className="flex justify-around items-center">
        <div className="flex flex-col gap-7 w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to IIPS Academics
          </h1>
          <p className="text-2xl">
            We brought you everything faculty notes, previous papers, syllabus,
            placement data, events, clubs.
          </p>

          <div className="flex gap-4">
            <button className="bg-white border  px-4 py-2 rounded-xl font-semibold  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              Explore Academics
            </button>
            <button className="bg-gray-800 text-white  px-4 py-2 rounded-xl  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              Upcoming Events
            </button>
          </div>
        </div>
        <img src={HeroImage} alt="Hero" className="rounded-lg w-1/4" />
      </div>
    </section>
  );x
}

const tabs = [
  { name: "Home", path: "/" },
  { name: "Academics", path: "/academics" },
  { name: "Placements", path: "/placements" },
  { name: "Events", path: "/events" },
  { name: "About", path: "/about" },
  { name: "Contributors", path: "/contributors" },
];

function TabNav() {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <div className="flex flex-wrap justify-center gap-2 py-4">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`px-4 py-1 rounded border ${
            activeTab === tab.name ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t mt-12 py-6">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <h3 className="font-bold">IIPS Academics</h3>
          <p className="text-gray-600">
            The unofficial website for IIPS providing resources and info for
            students.
          </p>
        </div>
        <div>
          <h4 className="font-bold">Quick Links</h4>
          <ul className="text-gray-700">
            <li>
              <Link to="/academics">Academics</Link>
            </li>
            <li>
              <Link to="/placements">Placements</Link>
            </li>
            <li>
              <Link to="/events">Events</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Resources</h4>
          <ul className="text-gray-700">
            <li>
              <Link to="/materials">Study Material</Link>
            </li>
            <li>
              <Link to="/papers">Previous Year Papers</Link>
            </li>
            <li>
              <Link to="/syllabus">Syllabus</Link>
            </li>
            <li>
              <Link to="/timetable">Timetable</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-6">
        © 2025 IIPS Academics. All rights reserved
      </div>
    </footer>
  );
}

const Home = () => {
  return (
    <>
      <HeroSection />
      <TabNav />
      <CardGroup />
      <Footer />
    </>
  );
};

export default Home;
