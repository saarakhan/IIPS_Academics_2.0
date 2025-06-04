import React, { useState, useEffect, useRef } from "react";
import demo from "../../assets/demo.png";
import { Line } from "rc-progress";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../Context/AuthContext";
import {
  StarIcon,
  DownloadIcon,
  ChevronUpIcon,
  PlusIcon,
  UserIcon,
} from "../../Icons";
import imageCompression from "browser-image-compression";
import Contributions from "./Contributions/Contributions";
import Rewards from "./Rewards/Rewards";
import Downloads from "./Downloads/Downloads";
import ProfileCompletionModal from "./ProfileCompletion/ProfileCompletionModal";

const Dashboard = () => {
  const [active, setActive] = useState("Contributions");
  const { session } = UserAuth();
  const [profileData, setProfileData] = useState(null);
  const [canUpload, SetCanUpload] = useState(false);

  const [stats, setStats] = useState({
    uploads: 0,
    downloads: 0,
    avgRating: 0,
  });
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(null);

  const fetchDashboardData = async () => {
    // Made this a standalone function
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    const userId = session.user.id;
    setLoading(true);
    setError(null);
    setAvatarError(null);

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          "*, course:course_id(name, duration_years), total_uploads, avatar_url"
        )
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      setProfileData(profile);

      let completedFields = 0;
      const totalFields = 5;
      if (profile.first_name) completedFields++;
      if (profile.last_name) completedFields++;
      if (profile.enrollment_number) completedFields++;
      if (profile.course_id) completedFields++;
      if (profile.semester) completedFields++;
      const currentProfileCompletion = Math.round(
        (completedFields / totalFields) * 100
      );
      setProfileCompletion(currentProfileCompletion);

      if (currentProfileCompletion === 100) {
        SetCanUpload(true);
      } else {
        SetCanUpload(false);
      }

      const uploadCount = profile.total_uploads || 0;

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

  useEffect(() => {
    fetchDashboardData(); // Call the standalone function
  }, [session?.user?.id]);

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !session?.user?.id) {
      setAvatarError("No file selected or user not available.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setAvatarError(null);

    const acceptedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!acceptedImageTypes.includes(file.type)) {
      setAvatarError("Invalid file type. Please select a JPG, PNG, or GIF.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    setUploadingAvatar(true);
    try {
      const compressedFile = await imageCompression(file, options);

      if (compressedFile.size > 1 * 1024 * 1024) {
        setAvatarError("Compressed file is still too large (max 1MB).");
        setUploadingAvatar(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const fileExt = compressedFile.name.split(".").pop() || "png";
      const filePath = `${session.user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressedFile, {
          upsert: true,
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (!urlData || !urlData.publicUrl) {
        throw new Error("Could not get public URL for avatar.");
      }
      const newAvatarUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      setProfileData((prevProfileData) => ({
        ...prevProfileData,
        avatar_url: newAvatarUrl,
      }));
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setAvatarError(`Upload failed: ${err.message}`);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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

        <div className="border-2 w-[90%] md:w-1/2 lg:w-[30%] xl:w-[22%] flex flex-col items-center py-4 px-6 rounded-2xl relative">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/png, image/jpeg, image/gif"
            style={{ display: "none" }}
          />

          {/* User image and upload button container */}
          <div className="relative group">
            <img
              src={profileData?.avatar_url || demo}
              alt="user image"
              loading="lazy"
              className={`w-[100px] h-[100px] rounded-full object-cover border-2 ${
                uploadingAvatar ? "opacity-50" : "opacity-100"
              } transition-opacity`}
            />
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-full">
                <div className="w-8 h-8 border-4 border-t-[#C79745] border-r-[#C79745] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {!uploadingAvatar && session?.user?.id === profileData?.id && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-[#C79745] text-white p-1.5 rounded-full shadow-md hover:bg-[#b3863c] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Change profile picture"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          {avatarError && (
            <p className="text-xs text-red-500 mt-1 text-center">
              {avatarError}
            </p>
          )}

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
            {loading ? (
              "..."
            ) : error ? (
              "N/A"
            ) : profileData && profileData.course && profileData.semester ? (
              <>
                {profileData.course.name} {profileData.semester}
                <sup>th</sup> Semester
              </>
            ) : (
              "Course Info N/A"
            )}
          </p>

          {/* profile completion section - styled like a button */}
          <div className="w-full mt-4 mb-4">
            <div
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-between gap-4 border rounded-xl px-4 py-2 text-sm cursor-pointer bg-white hover:bg-gray-50 transition-colors w-full"
              title="View or update profile details"
            >
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">
                  Profile Completion
                </span>
              </div>
              <span className="text-[#C79745] font-semibold">
                {loading ? "..." : error ? "N/A" : `${profileCompletion}%`}
              </span>
            </div>
          </div>
          <Line
            percent={loading || error ? 0 : profileCompletion}
            strokeWidth={4}
            strokeColor="#c79745"
            className="w-[95%] border-2 rounded-2xl"
          />

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
                className={`flex items-center gap-4 border rounded-xl px-4 py-2 text-sm  cursor-pointer
                 transition-colors w-full
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
            <Contributions canUpload={canUpload}></Contributions>
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
          onProfileUpdate={fetchDashboardData} // Pass the fetchDashboardData function as callback
        />
      </div>
    </div>
  );
};

export default Dashboard;
