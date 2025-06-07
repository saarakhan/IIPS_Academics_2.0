import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="bg-[#F4F9FF] min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-xl">
        <h1 className="text-6xl md:text-7xl font-bold text-[#2B3333] mb-6">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link to="/">
          <button className="bg-white border-2 border-black px-6 py-3 rounded-lg font-semibold shadow-[8px_5px_4px_0px_rgba(0,0,0,0.25)] hover:shadow-[4px_2px_4px_0px_rgba(0,0,0,0.25)] transition-all cursor-pointer">
            Go Back Home
          </button>
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
