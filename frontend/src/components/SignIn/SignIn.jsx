import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../Context/AuthContext";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { SignInUser, signInWithGoogle, signInWithGitHub } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { success, data, error: signInError } = await SignInUser(email, password); // Renamed error to avoid conflict
    setLoading(false);

    if (!success) {
      setError(signInError);
      toast.error(signInError || "Login failed"); 

      setTimeout(() => {
        setError(null); 
      }, 3000);
    } else {
      toast.success("Logged in successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  const handleSignInByGoogle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { success, error: googleError } = await signInWithGoogle(); 
    setLoading(false);

    if (!success) {
      setError(googleError);
      toast.error(googleError || "Google sign-in failed");
      setTimeout(() => setError(null), 3000);
    } else {
      toast.success("Signed in with Google!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  const handleSignInByGitHub = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { success, error: githubError } = await signInWithGitHub(); // Renamed error
    setLoading(false);

    if (!success) {
      setError(githubError);
      toast.error(githubError || "GitHub sign-in failed");

      setTimeout(() => setError(null), 3000);
    } else {
      toast.success("Signed in with GitHub!"); 
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-transparent backdrop-blur-sm">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md bg-[#F3F6F2] bg-opacity-50 backdrop-blur-lg shadow-xl rounded-lg p-8 sm:p-10 transform scale-95 animate-[popIn_0.3s_ease-out_forwards]"
      >
        <div className="relative flex items-center justify-center">
          <h2 className="text-2xl font-bold pb-2 text-[#C79745] text-center">
            Sign in
          </h2>
          <button
            type="button" 
            onClick={() => navigate("/")}
            className="absolute right-0 top-0 p-1"
          >
            <XMarkIcon className="h-8 w-8 p-1 text-[#2B3333] hover:bg-[#C79745] rounded-full" />
          </button>
        </div>

        <div className="flex flex-col py-2">
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 mt-1 border border-gray-300 text-[#2b3333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C79745]"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="flex flex-col py-2">
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 mt-1 border border-gray-300 text-[#2b3333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C79745]"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
          <div className="text-right mt-1">
            <Link
              to="/request-password-reset"
              className="text-sm text-[#C79745] hover:text-[#b3863c] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 py-3 rounded-lg text-white transition duration-300 ${loading
              ? "bg-[#2B3333]/70 cursor-not-allowed"
              : "bg-[#2B3333] hover:shadow-lg shadow-[#2B3333]"
            }`}
        >
          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <span>Signing In...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </button>


        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <div className="flex flex-col py-2">
          <button
            type="button"
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-2"
            onClick={handleSignInByGoogle}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5 mr-2"
            />
            Continue with Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={handleSignInByGitHub}
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              className="h-5 w-5 mr-2"
            />
            Continue with GitHub
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-center pt-4 text-sm">{error}</p>
        )}
      </form>

      {/* Keyframes for pop-in animation */}
      <style>
        {`
          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SignIn;
