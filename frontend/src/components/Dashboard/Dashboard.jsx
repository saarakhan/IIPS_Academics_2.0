import React, { useState, useEffect } from "react";
import demo from "../../assets/demo.png";
import { Line } from "rc-progress";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../Context/AuthContext";
import { StarIcon, DownloadIcon, ChevronUpIcon } from "../../Icons";
import Contributions from "./Contributions/Contributions";
import Rewards from "./Rewards/Rewards";
import Downloads from "./Downloads/Downloads";
import ProfileCompletionModal from "./ProfileCompletion/ProfileCompletionModal";


const Dashboard = () => {
  const [active, setActive] = useState("Contributions");
  const { session } = UserAuth();
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({
    uploads: 0,
    downloads: 0,
    avgRating: 0,
  });
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   const getUserProfileStatus = async () => {
  //     const {
  //       data: { user },
  //       error,
  //     } = await supabase.auth.getUser();

  //     if (user) {
  //       const { data, error } = await supabase
  //         .from("profiles")
  //         .select("first_name, last_name, course, semester, enrollment_number")
  //         .eq("id", user.id)
  //         .single();

  //       if (data) {
  //         const isIncomplete =
  //           !data.first_name ||
  //           !data.last_name ||
  //           !data.course ||
  //           !data.semester ||
  //           !data.enrollment_number;
  //         if (isIncomplete) {
  //           setIsModalOpen(true);
  //         }
  //       }
  //     }
  //   };

  //   getUserProfileStatus();
  // }, []);

  useEffect(() => {
    if (session?.user?.id) {
      console.log("error");
      const userId = session.user.id;

      const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
          // 1. Fetch Profile with course join and total_uploads field
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*, course:course_id(name, duration_years), total_uploads")
            .eq("id", userId)
            .single();

          if (profileError) throw profileError;
          setProfileData(profile);

          // 2. Calculate Profile Completion
          let completedFields = 0;
          const totalFields = 5; // first_name, last_name, enrollment_number, course_id, semester
          if (profile.first_name) completedFields++;
          if (profile.last_name) completedFields++;
          if (profile.enrollment_number) completedFields++;
          if (profile.course_id) completedFields++;
          if (profile.semester) completedFields++;
          setProfileCompletion(
            Math.round((completedFields / totalFields) * 100)
          );

          // 3. Get total_uploads from profiles table (directly from profile)
          const uploadCount = profile.total_uploads || 0;

          // 4. Fetch Download Count (user_download_log table)
          let downloadCount = 0;
          const { count: dlCount, error: dlError } = await supabase
            .from("user_download_log")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", userId);

          if (dlError) {
            console.warn("Error fetching download count:", dlError.message);
          } else {
            downloadCount = dlCount || 0;
          }

          // 5. Fetch Average Rating of User's Contributions
          const { data: avgRatingData, error: avgRatingError } = await supabase
            .from("resources")
            .select("rating_average")
            .eq("uploader_profile_id", userId)
            .eq("status", "APPROVED")
            .gt("rating_count", 0);

          if (avgRatingError) throw avgRatingError;

          let avgRating = 0;
          if (avgRatingData && avgRatingData.length > 0) {
            const sum = avgRatingData.reduce(
              (acc, r) => acc + (r.rating_average || 0),
              0
            );
            avgRating = (sum / avgRatingData.length).toFixed(1);
          }

          setStats({
            uploads: uploadCount,
            downloads: downloadCount,
            avgRating: parseFloat(avgRating) || 0,
          });
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          setError(error.message || "Failed to fetch dashboard data.");
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // buttons array
  const menuItems = [
    { label: "Contributions", icon: <ChevronUpIcon /> },
    { label: "Rewards", icon: <StarIcon size={16} /> },
    { label: "Downloads", icon: <DownloadIcon size={16} /> },
  ];
  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      {/* text  */}
      <div>
        <p className="text-center mt-5 text-2xl font-bold">Profile</p>
        <p className="text-center text-[#3B3838] mt-1">
          Manage your profile and see your contributions
        </p>
      </div>

      <div className="flex w-full justify-center gap-15 flex-col items-center lg:items-start lg:flex-row">
        {/* profile overview  */}

        <div className="border-2 w-[90%] md:w-1/2 lg:w-[30%] xl:w-[22%] flex flex-col items-center py-4 px-6 rounded-2xl ">
          {/* user image  */}
          <img
            src={profileData?.avatar_url || demo} // Use avatar_url if available
            alt="user image"
            loading="lazy"
            className="w-[100px] h-[100px] rounded-full object-cover" // Added styling for avatar
          />{" "}
          {/* user name  */}
          <p className="font-bold text-lg sm:text-2xl mt-2 ">
            {loading
              ? "Loading..."
              : error
              ? "Error"
              : profileData
              ? `${profileData.first_name || ""} ${
                  profileData.last_name || ""
                }`.trim() || "User Name"
              : "User Name"}
          </p>
          {/* user course  */}
          <p className="text-[#3B3838] text-sm sm:text-lg">
            {loading
              ? "..."
              : error
              ? "N/A"
              : profileData && profileData.course && profileData.semester
              ? `${profileData.course.name} ${
                  profileData.course.duration_years
                    ? `Year ${Math.ceil(profileData.semester / 2)}`
                    : ""
                } Semester ${profileData.semester}`.trim()
              : "Course Info N/A"}
          </p>
          {/* profile completion  */}
          <div className="w-full flex flex-col items-center mt-3">
            <div className="flex justify-between w-[90%] mb-1 text-sm sm:text-base">
              <span
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className="cursor-pointer text-blue-400"
              >
                Profile Completion
              </span>
              <span>
                {loading ? "..." : error ? "N/A" : `${profileCompletion}%`}
              </span>
            </div>
            <Line
              percent={loading || error ? 0 : profileCompletion}
              strokeWidth={4}
              strokeColor="#c79745"
              className="border-2 rounded-2xl"
            />
          </div>
          {/* user activity details */}
          <div className="w-full">
            {" "}
            <hr className="border-1  mt-5 mb-2 text" />
            {/* data  */}
            {loading ? (
              <p className="text-center">Loading stats...</p>
            ) : error ? (
              <p className="text-center text-red-500">Error loading stats.</p>
            ) : (
              <div className="flex justify-around mt-0 text-sm sm:text-base">
                <div className="flex flex-col items-center">
                  <p className="text-xl">{stats.uploads}</p>
                  <p className="text-[#C79745] ">Uploads</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xl">{stats.downloads}</p>
                  <p className="text-[#C79745]">Downloads</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xl">{stats.avgRating}</p>
                  <p className="text-[#C79745]">Ratings</p>
                </div>
              </div>
            )}
            <hr className="border-1  mt-2 mb-5" />
          </div>
          {/* buttons  */}
          <div className="w-full flex flex-col gap-3">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActive(item.label)}
                className={`flex items-center gap-4 border rounded-xl px-4 py-1 text-sm  cursor-pointer
                 transition-colors
            ${
              active === item.label
                ? "bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                : "bg-white hover:bg-gray-50"
            }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* user history  */}

        <div className="flex flex-col border-2 rounded-2xl p-3 lg:w-[60%] w-[90%] h-[500px]">
          {active == "Contributions" ? (
            <Contributions></Contributions>
          ) : active == "Rewards" ? (
            <Rewards></Rewards>
          ) : active == "Downloads" ? (
            <Downloads></Downloads>
          ) : null}
        </div>

        <ProfileCompletionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={profileData ?? undefined}
        />
      </div>
    </div>
  );
};

export default Dashboard;
