import React, { useState } from "react";
import PYQs from "./PYQs";
import Syllabus from "./Syllabus";
import Notes from "./Notes";

const Contributions = ({canUpload}) => {
  const [activeTab, setActiveTab] = useState("Notes");

  // const [uploadCounter, setUploadCounter] = useState(0);

  // tabs
  <style>{`
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `}</style>;

  const tabs = [{ name: "Notes" }, { name: "PYQs" }, { name: "Syllabus" }];
  return (
    <div
      className="overflow-auto no-scrollbar"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {" "}
      <p className="text-3xl font-bold ">Your Contributions</p>
      <p className="text-base ">Resources you've shared with the community.</p>
      <div className="flex flex-wrap  gap-2 py-2 px-2 sm:w-fit border mt-2 rounded-lg w-full">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-1 rounded-md font-medium transition-colors ${
              activeTab === tab.name
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      {activeTab === "Notes" ? (
        <Notes canUpload={canUpload} />
      ) : activeTab === "PYQs" ? (
        <PYQs canUpload={canUpload} />
      ) : activeTab === "Syllabus" ? (
        <Syllabus canUpload={canUpload} />
      ) : null}
    </div>
  );
};

export default Contributions;
