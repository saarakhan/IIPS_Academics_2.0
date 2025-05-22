import { useEffect, useState } from "react";
import { MoonIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { UserAuth } from "../../Context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, SignOut } = UserAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session && session.user) {
        const { data } = await import("../../supabaseClient").then(m => m.supabase)
          .then(supabase => supabase
            .from('profiles')
            .select('full_name, email, avatar_url')
            .eq('id', session.user.id)
            .single()
          );
        setProfile(data);
      } else {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [session]);

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
          {session && session.user ? (
            <>
              {profile && profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="h-8 w-8 rounded-full border-2 border-blue-400" />
              ) : (
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg border-2 border-blue-400">
                  {profile && profile.full_name
                    ? profile.full_name.charAt(0).toUpperCase()
                    : session.user.email.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={SignOut}
                className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
              <Link to="/signin">Login</Link>
            </>
          )}
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
            {session && session.user ? (
              <>
                {profile && profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" className="h-8 w-8 rounded-full border-2 border-blue-400" />
                ) : (
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg border-2 border-blue-400">
                    {profile && profile.full_name
                      ? profile.full_name.charAt(0).toUpperCase()
                      : session.user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  onClick={SignOut}
                  className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
                <Link to="/signin">Login</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
