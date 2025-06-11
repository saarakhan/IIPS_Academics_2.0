import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { FaUpload, FaStar, FaRegCommentDots } from "react-icons/fa";

export default function TopContributors() {
  const [topContributors, setTopContributors] = useState([]);

  useEffect(() => {
    const fetchTopContributors = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, course, total_uploads, rewards_points")
        .gt("total_uploads", 0);

      if (error) {
        console.error("Error fetching contributors:", error.message);
        return;
      }

      const sorted = data
        .map((person) => ({
          name: `${person.first_name} ${person.last_name}`,
          course: person.course,
          uploads: person.total_uploads || 0,
          rating: (4.5 + Math.random() * 0.4).toFixed(1),
        }))
        .sort((a, b) => b.uploads - a.uploads)
        .slice(0, 3);

      setTopContributors(sorted);
    };

    fetchTopContributors();
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-20 xl:px-32 py-16 bg-[#f9fbfd]">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          Top Contributors
        </h2>
        <p className="text-[#C79745] text-base sm:text-lg">
          Recognizing our amazing student contributors
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {topContributors.map((contributor, i) => (
          <div
            key={i}
            className="bg-white shadow-[5px_7px_8px_rgba(0,0,0,0.25)] rounded-lg px-1 py-6 transition duration-300 hover:shadow-[5px_7px_8px_rgba(132,166,211,0.65)] flex flex-col items-center"
          >
            <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 border flex items-center justify-center text-gray-400 text-4xl">
              👤
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {contributor.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{contributor.course}</p>

            <div className="flex justify-center gap-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <FaUpload className="text-[#C79745]" />
                {contributor.uploads} uploads
              </div>
              <div className="flex items-center gap-1">
                <FaStar className="text-[#C79745]" />
                {contributor.rating}
              </div>
            </div>

            {/* Optional Connect Button */}
            {/* <button className="mt-auto flex items-center justify-center gap-2 border border-[#C79745] text-[#C79745] px-4 py-2 rounded-md hover:bg-[#fff4e0] transition text-sm">
              <FaRegCommentDots className="text-base" />
              Connect
            </button> */}
          </div>
        ))}
      </div>
    </section>
  );
}
