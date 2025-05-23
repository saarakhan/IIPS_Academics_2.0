import { useState } from "react";
import Notes from "./Notes";
import PYQs from "./PYQs";
import Syllabus from "./Syllabus";

const Contributions = () => {
  const [activeTab, setActiveTab] = useState("Notes");
  // tabs
  const tabs = [
    { name: "Notes", path: "/" },
    { name: "PYQs", path: "/academics" },
    { name: "Syllabus", path: "/placements" },
  ];
  return (
    <div>
      {" "}
      <p className="text-3xl font-bold ">Your Contributions</p>
      <p className="text-base ">Resources you've shared with the community.</p>
      <div className="flex flex-wrap  gap-2 py-2 px-2 sm:w-fit border mt-2 rounded-lg w-full">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-1 rounded border  cursor-pointer ${
              activeTab === tab.name ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      {activeTab === "Notes" ? (
        <Notes />
      ) : activeTab === "PYQs" ? (
        <PYQs />
      ) : activeTab === "Syllabus" ? (
        <Syllabus />
      ) : null}
      <button className="px-2 py-2 w-full bg-[#1E1E1E] rounded-2xl text-white cursor-pointer hover:bg-black mt-4">
        Upload New Resources
      </button>
    </div>
  );
};

export default Contributions;
