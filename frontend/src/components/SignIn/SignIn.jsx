import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../Context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { SignInUser } = UserAuth();
  const navigate = useNavigate();

  // checking
  const auth = UserAuth();
  const SignIn = auth?.SignIn;
  if(!SignIn) {
    console.log("Not Sign")
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    const {  success, data, error } = await SignInUser(email, password);

    if (!success) {
      setError(error);
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      navigate("/dashboard");
    }

    
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 sm:p-10"
      >
        <h2 className="text-2xl font-bold pb-2 text-center text-gray-800">
          Sign in
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Don't have an account yet?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>

        <div className="flex flex-col py-2">
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 mt-1 border border-gray-300 text-[#2b3333] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-3 mt-1 border border-gray-300 text-[#2b3333] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            name="password"
            id="password"
            placeholder="Password" 
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Sign In
        </button>

        {error && (
          <p className="text-red-600 text-center pt-4 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
};

export default SignIn;
