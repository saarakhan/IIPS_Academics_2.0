import { useState, useMemo, useEffect } from "react";
import {
  FaSearch,
  FaBookOpen,
  FaUpload,
  FaAward,
  FaSyncAlt,
} from "react-icons/fa";
import { supabase } from "../../supabaseClient";

export default function StudentContributions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [contributionsData, setContributionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, course, total_uploads, rewards_points");

      if (error) {
        console.error("Error fetching contributions:", error.message);
        setContributionsData([]);
      } else {
        const formattedData = data.map((item, index) => ({
          id: index,
          name: `${item.first_name} ${item.last_name}`,
          course: item.course,
          uploads: item.total_uploads || 0,
          rewardPoints: item.rewards_points || 0,
        }));
        setContributionsData(formattedData);
      }
      setLoading(false);
    };

    fetchContributions();
  }, []);

  const uniqueCourses = [...new Set(contributionsData.map((item) => item.course))];

  const filteredData = useMemo(() => {
    return contributionsData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse =
        selectedCourse === "" || selectedCourse === "all" || item.course === selectedCourse;
      return matchesSearch && matchesCourse;
    });
  }, [searchQuery, selectedCourse, contributionsData]);

  const totalStudents = filteredData.length;
  const totalRewardPoints = filteredData.reduce((sum, item) => sum + item.rewardPoints, 0);
  const totalUploads = filteredData.reduce((sum, item) => sum + item.uploads, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-gray-800 mb-2">Student Contributions</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Students", value: totalStudents, icon: <FaBookOpen className="h-8 w-8 text-[#C28C36]" /> },
          { label: "Total Uploads", value: totalUploads, icon: <FaUpload className="h-8 w-8 text-[#C28C36]" /> },
          { label: "Total Reward Points", value: totalRewardPoints, icon: <FaAward className="h-8 w-8 text-[#C28C36]" /> },
        ].map((item, i) => (
          <div key={i} className="bg-white shadow-sm border rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="text-3xl font-serif font-bold">{item.value}</p>
            </div>
            {item.icon}
          </div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="all">All Courses</option>
            {uniqueCourses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <button
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          onClick={() => {
            setSearchQuery("");
            setSelectedCourse("");
          }}
        >
          <FaSyncAlt className="mr-2" />
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading contributions...</div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-serif font-bold text-gray-700">Student Name</th>
                  <th className="px-4 py-3 text-left font-serif font-bold text-gray-700">Course</th>
                  <th className="px-4 py-3 text-left font-serif font-bold text-gray-700">Uploads</th>
                  <th className="px-4 py-3 text-left font-serif font-bold text-gray-700">Reward Points</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{student.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="inline-block px-2 py-1 border border-gray-300 text-sm rounded-md">
                        {student.course}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{student.uploads}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-[#C28C36]">{student.rewardPoints} pts</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FaSearch className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-700 mb-2">No contributions found</h3>
            <p className="text-gray-500 max-w-md">
              No contributions match your search criteria. Try a different name or clear the filters.
            </p>
            <button
              className="mt-4 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              onClick={() => {
                setSearchQuery("");
                setSelectedCourse("");
              }}
            >
              <FaSyncAlt className="mr-2" />
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
