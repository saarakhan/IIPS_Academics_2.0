import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {HeroImage} from "../assets/HeroImage";
import CardGroup from "./CardGroup";

function HeroSection() {
  return (
    <section className="bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to IIPS Academics</h1>
          <p className="text-gray-700 mb-6">
            We brought you everything faculty notes, previous papers, syllabus, placement data, events, clubs
          </p>
          <div className="flex gap-4">
            <button className="bg-white border shadow px-4 py-2 rounded font-semibold">Explore Academics</button>
            <button className="bg-gray-800 text-white shadow px-4 py-2 rounded">Upcoming Events</button>
          </div>
        </div>
        <img src={HeroImage} alt="Hero" className="rounded-lg w-full" />
      </div>
    </section>
  );
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
          className={`px-4 py-1 rounded border ${activeTab === tab.name ? "bg-black text-white" : "bg-gray-200"}`}
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
          <p className="text-gray-600">The unofficial website for IIPS providing resources and info for students.</p>
        </div>
        <div>
          <h4 className="font-bold">Quick Links</h4>
          <ul className="text-gray-700">
            <li><Link to="/academics">Academics</Link></li>
            <li><Link to="/placements">Placements</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Resources</h4>
          <ul className="text-gray-700">
            <li><Link to="/materials">Study Material</Link></li>
            <li><Link to="/papers">Previous Year Papers</Link></li>
            <li><Link to="/syllabus">Syllabus</Link></li>
            <li><Link to="/timetable">Timetable</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-6">© 2025 IIPS Academics. All rights reserved</div>
    </footer>
  );
}

const Home = () => {
  return (
    <>
      <HeroSection/>
      <TabNav/>
      <CardGroup/>
      <Footer/>
    </>
  );
};

export default Home;
