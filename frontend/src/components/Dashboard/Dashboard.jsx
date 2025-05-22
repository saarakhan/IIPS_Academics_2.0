import React, { useState } from "react";
import demo from "../../assets/demo.png";
import { Line } from "rc-progress";
import { StarIcon, DownloadIcon, ChevronUpIcon } from "../../Icons";
import Contributions from "./Contributions/Contributions";
import Rewards from "./Rewards/Rewards";
import Downloads from "./Downloads/Downloads";

const Dashboard = () => {
  const [active, setActive] = useState("Contributions");

  // buttons array
  const menuItems = [
    { label: "Contributions", icon: <ChevronUpIcon /> },
    { label: "Rewards", icon: <StarIcon size={16} /> },
    { label: "Downloads", icon: <DownloadIcon size={16} /> },
  ];
  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      {/* text  */}
      <div>
        <p className="text-center mt-5 text-2xl font-bold">Profile</p>
        <p className="text-center text-[#3B3838] mt-1">
          Manage your profile and see your contributions
        </p>
      </div>

      <div className="flex w-full justify-center gap-15 flex-col items-center lg:items-start lg:flex-row">
        {/* profile overview  */}

        <div className="border-2 w-[90%] md:w-1/2 lg:w-[30%] xl:w-[22%] flex flex-col items-center py-4 px-6 rounded-2xl ">
          {/* user image  */}
          <img
            src={demo}
            alt="user image"
            loading="lazy"
            className="w-[100px]"
          />{" "}
          {/* user name  */}
          <p className="font-bold text-lg  sm:text-2xl mt-2 ">Ayush Sharma</p>
          {/* user course  */}
          <p className="text-[#3B3838] text-sm sm:text-lg">MCA III Year</p>
          {/* profile completion  */}
          <div className="w-full flex flex-col items-center mt-3">
            <div className="flex justify-between w-[90%] mb-1 text-sm sm:text-base">
              <span>Profile Completion</span>
              <span>85%</span>
            </div>
            <Line
              percent={85}
              strokeWidth={4}
              strokeColor="#c79745"
              className="border-2 rounded-2xl"
            />
          </div>
          {/* user activity details */}
          <div className="w-full">
            {" "}
            <hr className="border-1  mt-5 mb-2 text" />
            {/* data  */}
            <div className="flex justify-around mt-0 text-sm sm:text-base">
              <div className="flex flex-col items-center">
                <p className="text-xl">24</p>
                <p className="text-[#C79745] ">Uploads</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl">156</p>
                <p className="text-[#C79745]">Downloads</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl">4.8</p>
                <p className="text-[#C79745]">Ratings</p>
              </div>
            </div>
            <hr className="border-1  mt-2 mb-5" />
          </div>
          {/* buttons  */}
          <div className="w-full flex flex-col gap-3">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActive(item.label)}
                className={`flex items-center gap-4 border rounded-xl px-4 py-1 text-sm  cursor-pointer
                 transition-colors
            ${
              active === item.label
                ? "bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                : "bg-white hover:bg-gray-50"
            }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* user history  */}

        <div className="flex flex-col border-2 rounded-2xl p-3 lg:w-[60%] w-[90%] h-[500px]">
          {active == "Contributions" ? (
            <Contributions></Contributions>
          ) : active == "Rewards" ? (
            <Rewards></Rewards>
          ) : active == "Downloads" ? (
            <Downloads></Downloads>
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
