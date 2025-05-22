import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import {
  MoonIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";


import { UserAuth } from "../../Context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { SignOut, session } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await SignOut();
    navigate("/");
  };

  return (
    <nav className="bg-[#FFFEFE] text-[#2B3333] px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <div className="text-2xl font-bold text-[#C79745]">
            IIPS Academics
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center text-sm">
          <Link
            
            to="/"
            className="hover:text-[#C79745] hover:underline transition-colors text-[#2B3333] "
          >
           Home
          </Link>
          {["Academics", "Placement", "Events", "About", "Contributors"].map(
            (item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="hover:text-[#C79745] hover:underline transition-colors text-[#2B3333] "
              >
                {item}
              </Link>
            )
          )}
        </div>

        {/* Desktop Icons + Login */}
        <div className="hidden md:flex items-center space-x-4 ">
          {/* check if user is logged in -> show user profile else redirect signin */}
          {/* <UserIcon className="h-10 w-10 cursor-pointer text-[#2B3333] hover:bg-[#C79745] p-2 rounded-full" /> */}

          {/* if user is already logged in change it to logout */}
          {/* <Link
            to="/signin"
            className="bg-[#2B3333] text-[#F3F6F2] px-6 py-2 shadow-lg shadow-[#2B3333] rounded-lg text-sm"
          >
            Login */}
          {/* </Link> */}

          {session ? (
            <>
              <UserIcon className="h-10 w-10 cursor-pointer text-[#2B3333] hover:bg-[#C79745] p-2 rounded-full" />
              <button
                onClick={handleLogout}
                className="bg-[#2B3333] text-[#F3F6F2] px-6 py-2 shadow-lg shadow-[#2B3333] rounded-lg text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/signin"
              className="bg-[#2B3333] text-[#F3F6F2] px-6 py-2 shadow-lg shadow-[#2B3333] rounded-lg text-sm"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden bg-[#C79745]">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 bg-[#C79745] text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-[#C79745] bg-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 px-4 space-y-3 text-sm">
          {[
            "Home",
            "Academics",
            "Placement",
            "Events",
            "About",
            "Contributors",
          ].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="block hover:text-gray-400 transition-colors text-[#2B3333]"
            >
              {item}
            </Link>
          ))}

          <div className="flex items-center space-x-2 pt-2 border-t border-gray-200 mt-2">
            <UserIcon className="h-5 w-5 cursor-pointer text-[#2B3333]" />
            {/* <Link
              to="/signin"
              className="bg-[#2B3333] text-[#F3F6F2] px-3 py-1 rounded text-sm"
            >
              Login
            </Link> */}
            {session ? (
              <button
                onClick={handleLogout}
                className="bg-[#2B3333] text-[#F3F6F2] px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/signin"
                className="bg-[#2B3333] text-[#F3F6F2] px-3 py-1 rounded text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
