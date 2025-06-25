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
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
    }
  };

  useEffect(() => {
    if (session?.user?.id) fetchProfile();
  }, [session]);

  const fileInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(null);

  const fetchDashboardData = async () => {
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
          "*, course:course_id(name, duration_years), total_uploads, avatar_url, verified, idcard_url"
        )
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      setProfileData(profile);

      let completedFields = 0;
      const totalFields = 6; // Updated to include idcard_url
      if (profile.first_name) completedFields++;
      if (profile.last_name) completedFields++;
      if (profile.enrollment_number) completedFields++;
      if (profile.course_id) completedFields++;
      if (profile.semester) completedFields++;
      if (profile.idcard_url) completedFields++; // Check for ID card upload

      const currentProfileCompletion = Math.round(
        (completedFields / totalFields) * 100
      );
      setProfileCompletion(currentProfileCompletion);

      if (currentProfileCompletion === 100 && profile.verified === true) {
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
      if (!dlError) downloadCount = dlCount || 0;

      const { data: avgRatingData, error: avgRatingError } = await supabase
        .from("resources")
        .select("rating_average")
        .eq("uploader_profile_id", userId)
        .eq("status", "APPROVED")
        .gt("rating_count", 0);
      if (avgRatingError) throw avgRatingError;

      let avgRating = 0;
      if (avgRatingData?.length) {
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
    fetchDashboardData();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id) return;
    const interval = setInterval(async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("verified")
        .eq("id", session.user.id)
        .single();
      if (!error && profile?.verified === true) {
        SetCanUpload(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [session?.user?.id]);

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !session?.user?.id) {
      setAvatarError("No file selected or user not available.");
      fileInputRef.current && (fileInputRef.current.value = "");
      return;
    }

    const acceptedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!acceptedImageTypes.includes(file.type)) {
      setAvatarError("Invalid file type. Please select a JPG, PNG, or GIF.");
      fileInputRef.current && (fileInputRef.current.value = "");
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
      if (!urlData?.publicUrl)
        throw new Error("Could not get public URL for avatar.");

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);
      if (updateError) throw updateError;

      setProfileData((prev) => ({ ...prev, avatar_url: urlData.publicUrl }));
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setAvatarError(`Upload failed: ${err.message}`);
    } finally {
      setUploadingAvatar(false);
      fileInputRef.current && (fileInputRef.current.value = "");
    }
  };

  const menuItems = [
    { label: "Contributions", icon: <ChevronUpIcon /> },
    { label: "Rewards", icon: <StarIcon size={16} /> },
    { label: "Downloads", icon: <DownloadIcon size={16} /> },
  ];

  // Check if profile is complete but not verified
  const isProfileCompleteButNotVerified =
    profileCompletion === 100 && profileData?.verified !== true;
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="w-full bg-[#F4F9FF] p-5 text-center">
        <p className="text-[40px] font-bold">Profile</p>
        <p className="text-[#3B3838]">
          Manage your profile and see your contributions
        </p>
      </div>

      {/* Verification Pending Message */}
      {!loading && !error && isProfileCompleteButNotVerified && (
        <div className="w-full max-w-7xl mt-4 px-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800 font-medium">
                  Profile Verification Pending
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Your profile verification is pending with the admin. You'll be
                  able to upload resources once your profile is approved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full max-w-7xl justify-center gap-4 lg:gap-8 mt-8 flex-col lg:flex-row p-5 md:p-0">
        {/* Sidebar */}
        <div className="border-2 w-full lg:w-72 xl:w-80 flex flex-col items-center py-6 px-6 rounded-xl h-fit lg:h-[656px] bg-white shadow-[5px_7px_8px_rgba(0,0,0,0.25)] custom-scrollbar overflow-auto ">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            hidden
          />

          <div className="relative group mb-4 ">
            <img
              src={profileData?.avatar_url || demo}
              alt="avatar"
              className={`w-24 h-24 lg:w-28 lg:h-28 rounded-full object-cover border-2 ${
                uploadingAvatar ? "opacity-50" : "opacity-100"
              }`}
            />
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-full">
                <div className="w-8 h-8 border-4 border-t-[#C79745] border-r-[#C79745] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {!uploadingAvatar && session?.user?.id === profileData?.id && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-[#C79745] text-white p-1.5 rounded-full shadow-md hover:bg-[#b3863c]"
                title="Change profile picture"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {avatarError && (
            <p className="text-xs text-red-500 mb-2 text-center">
              {avatarError}
            </p>
          )}

          <div className="text-center mb-6 w-full">
            <p className="font-bold text-lg lg:text-xl mb-2 break-words">
              {loading
                ? "Loading..."
                : error
                ? "Error"
                : `${profileData?.first_name || ""} ${
                    profileData?.last_name || ""
                  }`.trim() || "User Name"}
            </p>
            <p className="text-[#3B3838] text-sm lg:text-base break-words">
              {loading
                ? "..."
                : error
                ? "N/A"
                : profileData?.course?.name && profileData?.semester
                ? `${profileData.course.name} ${profileData.semester}th Semester`
                : "Course Info N/A"}
            </p>
          </div>

          {/* Profile Completion */}
          <div className="w-full mb-4">
            <div
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-between gap-4 border rounded-lg px-4 py-3 text-sm cursor-pointer bg-white hover:bg-gray-50"
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

          <div className="w-full mb-6">
            <Line
              percent={loading || error ? 0 : profileCompletion}
              strokeWidth={4}
              strokeColor="#c79745"
              className="w-full border-2 rounded-2xl"
            />
          </div>

          {/* Stats */}
          <div className="w-full mb-6">
            <hr className="mb-4" />
            {loading ? (
              <p className="text-center text-sm">Loading stats...</p>
            ) : error ? (
              <p className="text-center text-red-500 text-sm">
                Error loading stats.
              </p>
            ) : (
              <div className="flex justify-around text-center ">
                <div>
                  <p className="text-xl lg:text-2xl font-bold">
                    {stats.uploads}
                  </p>
                  <p className="text-[#C79745] text-xs lg:text-sm">Uploads</p>
                </div>
                <div>
                  <p className="text-xl lg:text-2xl font-bold">
                    {stats.downloads}
                  </p>
                  <p className="text-[#C79745] text-xs lg:text-sm">Downloads</p>
                </div>
                <div>
                  <p className="text-xl lg:text-2xl font-bold">
                    {stats.avgRating}
                  </p>
                  <p className="text-[#C79745] text-xs lg:text-sm">Ratings</p>
                </div>
              </div>
            )}
            <hr className="mt-4" />
          </div>

          {/* Menu Buttons */}
          <div className="w-full flex flex-col gap-3">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActive(item.label)}
                className={`flex items-center gap-4 border-2 rounded-lg px-4 py-3 text-sm transition-colors w-full ${
                  active === item.label
                    ? "bg-gray-100 shadow-[5px_7px_4px_rgba(0,0,0,0.25)]"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex mb-10 flex-col border-2 rounded-xl w-full lg:flex-1 h-[650px] bg-white shadow-[5px_7px_8px_rgba(0,0,0,0.25)]">
          <div className="p-6 h-full overflow-y-auto">
            {active === "Contributions" ? (
              <Contributions canUpload={canUpload} loading={loading} />
            ) : active === "Rewards" ? (
              <Rewards />
            ) : (
              <Downloads />
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ProfileCompletionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={profile}
        onProfileUpdate={fetchProfile}
      />
    </div>
  );
};

export default Dashboard;
