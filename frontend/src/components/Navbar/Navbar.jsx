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
  
  
  const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem("userProfile")));

  useEffect(() => {
   
    const currentProfile = JSON.parse(localStorage.getItem("userProfile"));
    setUserProfile(currentProfile);

    if (currentProfile?.first_name || currentProfile?.last_name) {
      setName(`${currentProfile.first_name || ""} ${currentProfile.last_name || ""}`.trim());
    } else if (session?.user?.user_metadata?.full_name) {
      setName(session.user.user_metadata.full_name);
    } else if (session?.user?.email) {
      setName(session.user.email.split('@')[0]);
    } else {
      setName("");
    }
    
    
    const handleStorageChange = () => {
        const updatedProfile = JSON.parse(localStorage.getItem("userProfile"));
        setUserProfile(updatedProfile);
        if (updatedProfile?.first_name || updatedProfile?.last_name) {
            setName(`${updatedProfile.first_name || ""} ${updatedProfile.last_name || ""}`.trim());
        } else if (session?.user?.user_metadata?.full_name) { 
            setName(session.user.user_metadata.full_name);
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, [session]);


  const handleClose = useCallback(() => {
    SetOpenLogoutModal(false);
  }, []);

  useEffect(() => {
    
    if (!name && session?.user?.user_metadata?.full_name) {
      setName(session.user.user_metadata.full_name);
    } else if (!name && session?.user?.email && (!userProfile?.first_name && !userProfile?.last_name)) {
     
      setName(session.user.email.split('@')[0]);
    }
  }, [session, name, userProfile]);

  useEffect(() => {
   
    if (userProfile?.avatar_url) {
      setAvatarUrl(userProfile.avatar_url);
      return;
    }

    
    const fetchAvatar = async () => {
      if (!session?.user?.id) {
        setAvatarUrl(null); 
        return;
      }
      
      const cachedAvatar = localStorage.getItem(`avatarUrl-${session.user.id}`); 
      if (cachedAvatar) {
        setAvatarUrl(cachedAvatar);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", session.user.id) // Ensure we use the actual user ID
        .single();

      if (error) {
        console.error("Error fetching avatar URL for Navbar:", error.message);
        setAvatarUrl(null); 
        return;
      }

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
        localStorage.setItem(`avatarUrl-${session.user.id}`, data.avatar_url);
      } else {
        setAvatarUrl(null); 
      }
    };

    fetchAvatar();
    
  }, [session?.user?.id, userProfile?.avatar_url]); 

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
          {}
          {session && userProfile && userProfile.role === "admin" && (
            <Link
              to="/admin"
              className={`px-4 py-2 font-medium rounded-md transition-all whitespace-nowrap ${
                pathMatch("admin")
                  ? "bg-[#F5F5F5] text-[#2B3333]"
                  : "text-[#2B3333] hover:bg-[#F5F5F5]"
              }`}
            >
              Admin Panel
            </Link>
          )}
        </div>

        {}
        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <>
              <Link
                to={(userProfile && userProfile.role === "admin") ? "/admin" : "/dashboard"} // Defensive check for userProfile and role
                className="flex items-center space-x-2"
              >
                <Avatar alt={name || "User"} src={avatarUrl || undefined} /> {/* Provide fallback for alt and ensure src is not null */}
                <span>{name || "Profile"}</span>
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

      {}
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
          {}
          {session && userProfile && userProfile.role === "admin" && (
             <Link
                to="/admin"
                className={`block px-4 py-2 rounded-md transition-all ${
                  pathMatch("admin")
                    ? "bg-[#2B3333] text-white"
                    : "text-[#2B3333] hover:bg-[#2B3333] hover:text-white"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Admin Panel
              </Link>
          )}

          <div className="pt-3 border-t border-gray-200">
            {session ? (
              <div className="flex flex-col items-start space-y-2">
                <Link
                  to={(userProfile && userProfile.role === "admin") ? "/admin" : "/dashboard"} 
                  className="flex items-center space-x-2 px-4 py-2 text-[#2B3333] hover:bg-[#C79745] rounded-md w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  {}
                  <Avatar alt={name || "User"} src={avatarUrl || undefined} sx={{ width: 24, height: 24 }} />
                  <span> {name || "Profile"}</span>
                </Link>
                <button
                  onClick={() => {
                    SetOpenLogoutModal(true);
                    setMenuOpen(false); 
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
