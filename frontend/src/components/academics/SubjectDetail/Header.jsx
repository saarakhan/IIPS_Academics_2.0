import { ArrowLeftIcon, BuildingIcon } from "../../../Icons";
import { Link, useNavigate } from "react-router-dom";
const Header = ({ subject }) => {
  const navigate = useNavigate();
  return (
    <div>
      <header className="bg-[#F3F6F2] shadow-md">
        <div className="container mx-auto py-5 px-6">
          <div className="flex justify-between items-center mb-1">
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer inline-flex items-center  text-sm bg-[#2b3333] hover:bg-black transition-colors  text-white px-3 py-1 rounded-full"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back
            </button>
          </div>
          <h1 className="text-2xl font-bold">{subject.name}</h1>
          <div className="flex items-center mt-1 text-sm">
            <BuildingIcon className="h-3.5 w-3.5 mr-1.5 text-black" />
            {subject.department || "Department"}
            {subject.code && (
              <>
                <span className="mx-2">•</span>
                <span className="font-medium">{subject.code}</span>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
