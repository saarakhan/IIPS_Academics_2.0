import { useState } from "react";
import {
  MdVisibility,
  MdCheck,
  MdClose,
  MdDescription,
  MdPerson,
  MdCalendarToday,
  MdOutlineSubject,
  MdOutlineStorage,
} from "react-icons/md";
import PreviewModal from "./PreviewModal";
import RejectModal from "./RejectModal";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";

export default function ResourceCard({ resource, onAction }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const approve = async () => {
    const { error } = await supabase
      .from("resources")
      .update({
        status: "APPROVED",
        approved_at: new Date().toISOString(),
        approved_by_admin_id: "0b5648d6-7f4f-43b6-88cb-7bbc9ff226a4", // to be replaced by actual admin id
      })
      .eq("id", resource.id);

    if (!error) {
      toast.success("Resource approved!");
      onAction();
    } else {
      toast.error("Failed to approve resource.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500 text-white">
            Pending
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
            {status}
          </span>
        );
    }
  };

  const getActionButtons = (status) => {
    const baseButtonClass =
      "inline-flex items-center justify-center p-2 rounded-md";
    const iconButtonClass = "w-4 h-4";

    switch (status) {
      case "PENDING":
        return (
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setShowPreview(true)}
              className={`${baseButtonClass} text-gray-700 hover:bg-gray-100`}
              aria-label="Preview"
            >
              <MdVisibility className={iconButtonClass} />
              <span className="sr-only sm:not-sr-only sm:ml-1">Preview</span>
            </button>
            <button
              onClick={approve}
              className={`${baseButtonClass} text-white bg-green-500 hover:bg-green-600`}
              aria-label="Approve"
            >
              <MdCheck className={iconButtonClass} />
              <span className="sr-only sm:not-sr-only sm:ml-1">Approve</span>
            </button>
            <button
              onClick={() => setShowReject(true)}
              className={`${baseButtonClass} text-white bg-red-500 hover:bg-red-600`}
              aria-label="Reject"
            >
              <MdClose className={iconButtonClass} />
              <span className="sr-only sm:not-sr-only sm:ml-1">Reject</span>
            </button>
          </div>
        );
      case "APPROVED":
        return (
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setShowPreview(true)}
              className={`${baseButtonClass} text-gray-700 hover:bg-gray-100`}
              aria-label="Preview"
            >
              <MdVisibility className={iconButtonClass} />
              <span className="sr-only sm:not-sr-only sm:ml-1">Preview</span>
            </button>
            <button
              onClick={() => setShowReject(true)}
              className={`${baseButtonClass} text-white bg-red-500 hover:bg-red-600`}
              aria-label="Reject"
            >
              <MdClose className={iconButtonClass} />
              <span className="sr-only sm:not-sr-only sm:ml-1">Reject</span>
            </button>
          </div>
        );
      case "REJECTED":
        return (
          <button
            onClick={() => setShowPreview(true)}
            className={`${baseButtonClass} text-gray-700 hover:bg-gray-100`}
            aria-label="Preview"
          >
            <MdVisibility className={iconButtonClass} />
            <span className="sr-only sm:not-sr-only sm:ml-1">Preview</span>
          </button>
        );
      default:
        return null;
    }
  };

  if (!resource || resource.status === "REJECTED") return null;

  return (
    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm bg-white">
      {console.log(resource)}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3 items-start">
          <MdDescription className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-1">
              <h4 className="font-medium text-gray-900 break-words line-clamp-2 sm:line-clamp-1">
                {resource?.subjects.name}
              </h4>
              <div className="mt-1 sm:mt-0">
                {getStatusBadge(resource.status)}
              </div>
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
                  {resource.profiles?.course || "N/A"} | Sem:{" "}
                  {resource.profiles?.semester || "N/A"}
                </span>
              </span>
              <span className="flex items-center gap-1 truncate">
                <MdOutlineStorage className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <span className="truncate">
                  {(resource.file_size_bytes / (1024 * 1024)).toFixed(1)} MB
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end sm:justify-normal">
          {getActionButtons(resource.status)}
        </div>
      </div>

      {showPreview && (
        <PreviewModal
          filePath={resource.file_path}
          onClose={() => setShowPreview(false)}
        />
      )}
      {showReject && (
        <RejectModal
          resourceId={resource.id}
          onClose={() => setShowReject(false)}
          onAction={onAction}
        />
      )}
    </div>
  );
}
