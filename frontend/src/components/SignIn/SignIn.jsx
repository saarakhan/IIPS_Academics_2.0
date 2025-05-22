import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../Context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { SignInUser, signInWithGoogle, signInWithGitHub } = UserAuth();
  const navigate = useNavigate();

  // checking
  const auth = UserAuth();
  const SignIn = auth?.SignIn;
  if (!SignIn) {
    console.log("Not Sign");
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { success, data, error } = await SignInUser(email, password);

    if (!success) {
      setError(error);
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      navigate("/dashboard");
    }
  };

  const handleSignInByGoogle = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  const { success, error } = await signInWithGoogle();
  setLoading(false);

  if (!success) {
    setError(error);
    setTimeout(() => setError(""), 3000);
  } else {
    navigate("/dashboard");
  }
};

const handleSignInByGitHub = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  const { success, error } = await signInWithGitHub();
  setLoading(false);

  if (!success) {
    setError(error);
    setTimeout(() => setError(""), 3000);
  } else {
    navigate("/dashboard");
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fbf2e3] bg-opacity-50 backdrop-blur-[10px]">

      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md bg-[#F3F6F2] bg-opacity-50 backdrop-blur-lg shadow-xl rounded-lg p-8 sm:p-10 transform scale-95 animate-[popIn_0.3s_ease-out_forwards]"
      >
        <h2 className="text-2xl font-bold pb-2 text-center text-[#C79745]">
          Sign in
        </h2>

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
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-[#2B3333] py-3 shadow-lg shadow-[#2B3333] rounded-lg transition duration-300 text-white"
        >
          Sign In
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
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
            Continue with Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
             onClick={handleSignInByGitHub}
          >
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="h-5 w-5 mr-2" />
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
