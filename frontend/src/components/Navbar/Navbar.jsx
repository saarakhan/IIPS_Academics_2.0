import { useState } from "react";
import {
  MoonIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-bold">IIPS Unofficial</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center text-sm">
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
              className="hover:text-gray-400 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Icons + Login */}
        <div className="hidden md:flex items-center space-x-4">
          <MoonIcon className="h-5 w-5 cursor-pointer" />
          <UserIcon className="h-5 w-5 cursor-pointer" />
          <button className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition">
            Login
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4 text-sm">
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
              className="hover:text-gray-400 transition-colors"
            >
              {item}
            </Link>
          ))}
          <div className="flex items-center space-x-4 mt-2">
            <MoonIcon className="h-5 w-5 cursor-pointer" />
            <UserIcon className="h-5 w-5 cursor-pointer" />
            <button className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
