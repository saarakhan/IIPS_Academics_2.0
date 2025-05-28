import { ArrowLeftIcon, BuildingIcon } from "../../../Icons";
import { Link, useNavigate } from "react-router-dom";
const Header = ({ subject }) => {
  const navigate = useNavigate();
  return (
   <div>
  <header className="">
    <div className="container mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-white bg-[#2b3333] hover:bg-black transition-colors duration-200 px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Academics
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-[#1c1f23] tracking-tight">{subject.name}</h1>
        <div className="flex items-center text-sm text-gray-700 font-medium">
          <BuildingIcon className="h-4 w-4 mr-2 text-gray-800" />
          {subject.department || "Department"}

          {subject.code && (
            <>
              <span className="mx-2 text-gray-400">•</span>
              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                {subject.code}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  </header>
</div>

  );
};

export default Header;
