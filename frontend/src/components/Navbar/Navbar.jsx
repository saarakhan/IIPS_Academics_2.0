import { UserAuth } from "../../Context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
// import UserProfileIcon from '../Dashboard/UserProfileIcon/UserProfileIcon';
import LogoutModal from "../LogoutModal/logoutModal";
import Avatar from "@mui/material/Avatar";
import { supabase } from "../../supabaseClient";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session } = UserAuth();
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [OpenLogoutModal, SetOpenLogoutModal] = useState(false);
  
  const handleClose = useCallback(() => {
    SetOpenLogoutModal(false);
  }, []);

  useEffect(() => {
    if (session?.user?.user_metadata?.full_name) {
      setName(session.user.user_metadata.full_name);
    }
  }, [session]);

  useEffect(() => {
    const cachedAvatar = localStorage.getItem("avatarUrl");
    if (cachedAvatar) {
      setAvatarUrl(cachedAvatar);
      return;
    }

    const fetchAvatar = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", session?.user?.id)
        .single();

      if (error) {
        console.error("Error fetching avatar URL:", error.message);
        return;
      }

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
        localStorage.setItem("avatarUrl", data.avatar_url);
      }
    };

    if (session?.user?.id) {
      fetchAvatar();
    }
  }, [session?.user?.id]);

  const location = useLocation();

  const pathMatch = (item) =>
    item.toLowerCase() === "home"
      ? location.pathname === "/" || location.pathname === "/home"
      : location.pathname === `/${item.toLowerCase()}`;

  return (
    <nav
      className="bg-[#FFFEFE] text-[#2B3333] px-4 py-2 border-b border-[#C79745] top-0 z-50"
      style={{
        boxShadow: "0px 4px 16px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="w-full flex sm:justify-around justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <div className="text-2xl font-bold text-[#C79745]">
            IIPS Academics
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-2 items-center text-sm">
          {["Home", "Academics", "Placements", "Contact", "Contributors"].map(
            (item) => (
              <Link
                key={item}
                to={`/${
                  item.toLowerCase() === "home" ? "" : item.toLowerCase()
                }`}
                className={`px-4 py-2 font-medium rounded-md transition-all whitespace-nowrap ${
                  pathMatch(item)
                    ? "bg-[#F5F5F5] text-[#2B3333]"
                    : "text-[#2B3333] hover:bg-[#F5F5F5]"
                }`}
              >
                {item}
              </Link>
            )
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <>
              <Link
                to={
                  session.user.user_metadata.role === "admin"
                    ? "/admin"
                    : "/dashboard"
                }
                className="flex items-center space-x-2"
              >
                {/* User Icon with no padding, visible color and size */}
                {/* <UserIcon className="h-10 w-10 cursor-pointer text-[#2B3333] rounded-full border border-gray-300" /> */}
                <Avatar alt={name} src={avatarUrl} />
                <span>{name}</span>
              </Link>

              <button
                onClick={() => {
                  SetOpenLogoutModal(true);
                }}
                className="bg-[#2B3333] text-[#F3F6F2] px-6 py-2 rounded-lg text-sm hover:bg-black transition-colors ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/signin"
              className="bg-[#2B3333] text-[#F3F6F2] px-6 py-2 rounded-lg text-sm hover:bg-black transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-md focus:outline-none"
        >
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6 text-[#2B3333]" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-[#2B3333]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg px-4 py-3 space-y-2 text-sm">
          {["Home", "Academics", "Placements", "Contact", "Contributors"].map(
            (item) => (
              <Link
                key={item}
                to={`/${
                  item.toLowerCase() === "home" ? "" : item.toLowerCase()
                }`}
                className={`block px-4 py-2 rounded-md transition-all ${
                  pathMatch(item)
                    ? "bg-[#2B3333] text-white"
                    : "text-[#2B3333] hover:bg-[#2B3333] hover:text-white"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            )
          )}

          <div className="pt-3 border-t border-gray-200">
            {session ? (
              <div className="flex flex-col items-start space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 text-[#2B3333] hover:bg-[#C79745] rounded-md w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5" />

                  <span> {name}</span>
                </Link>
                <button
                  onClick={() => {
                    SetOpenLogoutModal(true);
                  }}
                  className="bg-[#2B3333] text-[#F3F6F2] hover:bg-black px-4 py-2 rounded text-sm w-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="block bg-[#2B3333] text-[#F3F6F2] hover:bg-black px-4 py-2 rounded text-sm text-center"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      <LogoutModal
        OpenLogoutModal={OpenLogoutModal}
        handleClose={handleClose}
      />
    </nav>
  );
}
