import { useEffect } from "react";

import { useState } from "react";
import { MdClose, MdWarning } from "react-icons/md";
import { supabase } from "../../supabaseClient";

export default function RejectModal({ resourceId, onClose, onAction }) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // const { error: supabaseError } = await supabase
      //   .from('resources')
      //   .delete({
      //     status: 'REJECTED',
      //     rejection_reason: reason,
      // rejected_at: new Date().toISOString(),
      // rejected_by_admin_id: '0b5648d6-7f4f-43b6-88cb-7bbc9ff226a4',
      //   })
      //   .eq('id', resourceId);

      // if (supabaseError) {
      //   throw supabaseError;
      // }

      // First, get the resource PDF PATH
      const { data: resourceData, error: fetchError } = await supabase
        .from("resources")
        .select("file_path")
        .eq("id", resourceId)
        .single();

      if (fetchError) {
        console.error(
          "Failed to fetch resource for deletion:",
          fetchError.message
        );
        return;
      }
      // console.log(resourceData);
      const pdfPath = resourceData.file_path;

      if (!pdfPath) {
        console.warn("No PDF path found. Skipping file deletion.");
      }

      //Delete the resource from the database
      const { error: deleteDbError } = await supabase
        .from("resources")
        .update({
          status: "REJECTED",
          rejection_reason: reason,
        })
        .eq("id", resourceId);

      if (deleteDbError) {
        console.error(
          "Failed to delete resource from DB:",
          deleteDbError.message
        );
        return;
      }

      // Delete the PDF file from Supabase Storage bucket
      if (pdfPath) {
        const { error: deleteFileError } = await supabase.storage
          .from("uploads")
          .remove([pdfPath]);

        if (deleteFileError) {
          console.error(
            "Failed to delete file from bucket:",
            deleteFileError.message
          );
        } else {
          console.log("PDF file deleted from bucket.");
        }
      }

      onAction();
      onClose();
    } catch (err) {
      console.error("Error rejecting resource:", err);
      setError("Failed to reject resource. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-rose-50 p-6 border-b border-rose-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-100 rounded-full">
              <MdWarning className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Reject Resource
              </h3>
              <p className="text-gray-600 mt-1">
                Please provide a reason for rejecting this resource. This will
                be visible to the contributor.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
              <div className="flex items-center gap-2">
                <MdWarning className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Rejection Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why this resource is being rejected..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
              rows={6}
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Be specific and constructive to help the contributor understand
              the issue.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isSubmitting}
              className="px-6 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Rejecting...
                </>
              ) : (
                <>
                  <MdClose className="w-4 h-4" />
                  Reject Resource
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
