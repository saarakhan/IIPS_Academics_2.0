import { useState } from "react";
import { MdVisibility, MdCheck, MdClose, MdDescription, MdPerson, MdCalendarToday, MdOutlineSubject, MdOutlineStorage } from "react-icons/md";
import PreviewModal from "./PreviewModal";
import RejectModal from "./RejectModal";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";

export default function ResourceCard({ resource, onAction }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const approve = async () => {
    // const adminId = "0b5648d6-7f4f-43b6-88cb-7bbc9ff226a4"; // to be replaced with actual admin ID

    // 1. Approve resource
    const { error: updateError } = await supabase
      .from("resources")
      .update({
        status: "APPROVED",
        approved_at: new Date().toISOString(),
        // approved_by_admin_id: adminId,
      })
      .eq("id", resource.id);

    if (updateError) {
      toast.error("Failed to approve resource.");
      return;
    }

    toast.success("Resource approved!");

    // 2. Insert reward log
    // for notes -> 15 points else 5
    const pointValue = resource.resource_type === "NOTE" ? 15 : 5;

    const { error: rewardsError } = await supabase.from("user_rewards_log").insert({
      profile_id: resource.uploader_profile_id,
      reward_type: resource.resource_type,
      points_awarded: pointValue,
      related_resource_id: resource.id,
      awarded_at: new Date().toISOString(),
      awarded_by_admin_id: adminId,
    });

    if (rewardsError) {
      console.error("Insert failed:", rewardsError);
      toast.error("Failed to reward resource.");
      return;
    }

    toast.success("Resource rewarded!");

    // 3. Fetch current reward points
    const { data: profileData, error: fetchProfileError } = await supabase.from("profiles").select("rewards_points").eq("id", resource.uploader_profile_id).single();

    if (fetchProfileError || !profileData) {
      console.error("Failed to fetch profile:", fetchProfileError);
      toast.error("Failed to fetch profile.");
      return;
    }

    // 4. Update profile reward points
    const newPoints = profileData.rewards_points + pointValue;

    const { error: profileUpdateError } = await supabase.from("profiles").update({ rewards_points: newPoints }).eq("id", resource.uploader_profile_id);

    if (profileUpdateError) {
      console.error("Profile update failed:", profileUpdateError);
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated!");
    }

    onAction();
  };

  const getStatusBadge = status => {
    switch (status) {
      case "PENDING":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500 text-white">Pending</span>;
      case "APPROVED":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">Approved</span>;
      case "REJECTED":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">{status}</span>;
    }
  };

  const getActionButtons = status => {
    const baseButtonClass =
      "inline-flex items-center justify-center px-3 py-1 border-2 border-[#2B3333] rounded-md shadow-sm font-semibold text-sm transition-colors hover:shadow-[6px_7px_4px_rgba(0,0,0,0.1)]";
    const iconButtonClass = "w-4 h-4";

    switch (status) {
      case "PENDING":
        return (
          <div className="flex gap-1 sm:gap-2">
            <button onClick={() => setShowPreview(true)} className={`${baseButtonClass} bg-white text-[#2B3333] `} aria-label="Preview">
              <MdVisibility className={iconButtonClass} />
              {/* <span className="sr-only sm:not-sr-only sm:ml-1">Preview</span> */}
            </button>
            <button onClick={approve} className={`${baseButtonClass} bg-green-500 text-white border-green-600 hover:bg-green-600`} aria-label="Approve">
              <MdCheck className={iconButtonClass} />
              {/* <span className="sr-only sm:not-sr-only sm:ml-1">Approve</span> */}
            </button>
            <button onClick={() => setShowReject(true)} className={`${baseButtonClass} bg-red-500 text-white border-red-600 hover:bg-red-600`} aria-label="Reject">
              <MdClose className={iconButtonClass} />
              {/* <span className="sr-only sm:not-sr-only sm:ml-1">Reject</span> */}
            </button>
          </div>
        );
      case "APPROVED":
        return (
          <div className="flex gap-1 sm:gap-2">
            <button onClick={() => setShowPreview(true)} className={`${baseButtonClass} bg-white text-[#2B3333] `} aria-label="Preview">
              <MdVisibility className={iconButtonClass} />
              {/* <span className="sr-only sm:not-sr-only sm:ml-1">Preview</span> */}
            </button>
            <button onClick={() => setShowReject(true)} className={`${baseButtonClass} bg-red-500 text-white border-red-600 hover:bg-red-600`} aria-label="Reject">
              <MdClose className={iconButtonClass} />
              {/* <span className="sr-only sm:not-sr-only sm:ml-1">Reject</span> */}
            </button>
          </div>
        );
      case "REJECTED":
        return <span className="text-sm text-gray-500 italic">Preview not available</span>;

      default:
        return null;
    }
  };
  // if (!resource || resource.status === "REJECTED") return null;

  return (
    <div className="border-2 border-gray-300 rounded-md p-3 sm:p-4 hover:shadow-[7px_8px_4.8px_rgba(0,0,0,0.1)] bg-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3 items-start">
          <MdDescription className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-1">
              <h4 className="font-medium text-gray-900 break-words line-clamp-2 sm:line-clamp-1">{resource?.subjects.name}</h4>
              <div className="mt-1 sm:mt-0">{getStatusBadge(resource.status)}</div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600">
              <span className="flex items-center gap-1 truncate">
                <MdPerson className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <span className="truncate">
                  {resource.profiles?.first_name} {resource.profiles?.last_name}
                </span>
              </span>
              <span className="flex items-center gap-1 truncate">
                <MdCalendarToday className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <span className="truncate">
                  {new Date(resource.uploaded_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </span>
              <span className="flex items-center gap-1 truncate">
                <MdOutlineSubject className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <span className="truncate">
                  {resource.profiles?.course || "N/A"} | Sem: {resource.profiles?.semester || "N/A"}
                </span>
              </span>
              <span className="flex items-center gap-1 truncate">
                <MdOutlineStorage className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <span className="truncate">{(resource.file_size_bytes / (1024 * 1024)).toFixed(1)} MB</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end sm:justify-normal">{getActionButtons(resource.status)}</div>
      </div>
      {showPreview && resource.status !== "REJECTED" && <PreviewModal filePath={resource.file_path} onClose={() => setShowPreview(false)} />}

      {showReject && <RejectModal resourceId={resource.id} onClose={() => setShowReject(false)} onAction={onAction} />}
    </div>
  );
}
