import { Link, useLocation } from "react-router-dom";

export default function SectionNav() {
  const tabs = [
    { name: "Home", path: "/" },
    { name: "Academics", path: "/academics" },
    { name: "Placements", path: "/placements" },
    { name: "Events", path: "/events" },
    { name: "About", path: "/about" },
    { name: "Contributors", path: "/contributors" },
  ];

  const { pathname } = useLocation();

  return (
    <div className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex justify-center">
        <div className="bg-[#FFFEFE] border border-[#2B3333] rounded-md flex px-2 py-1 overflow-x-auto gap-2 shadow-sm">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                pathname === tab.path
                  ? "bg-[#2B3333] text-white"
                  : "text-[#2B3333] hover:bg-[#2B3333] hover:text-[#FFFEFE]"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

