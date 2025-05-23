import React, { useEffect, useState } from "react";
import { UserAuth } from "../../../Context/AuthContext";
import { supabase } from "../../../supabaseClient";
import { StarIcon, CalendarIcon } from "../../../Icons"; // Assuming you'll use these
import noData from "../../../assets/noData.svg"; // For empty state

const Rewards = () => {
  const { session } = UserAuth();
  const [rewardsLog, setRewardsLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchRewards = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("user_rewards_log")
          .select(
            "id, reward_type, points_awarded, description, awarded_at, related_resource_id, resource:related_resource_id(title)"
          )
          .eq("profile_id", session.user.id)
          .order("awarded_at", { ascending: false });

        if (fetchError) throw fetchError;
        setRewardsLog(data || []);
      } catch (err) {
        console.error("Error fetching rewards:", err);
        setError(err.message || "Failed to fetch rewards.");
        setRewardsLog([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [session]);

  if (loading) {
    return <div className="text-center py-8">Loading your rewards...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mt-3 flex flex-col gap-3 h-[450px] overflow-y-auto pr-2 custom-scrollbar p-4">
      {rewardsLog.length > 0 ? (
        rewardsLog.map((log) => (
          <div
            key={log.id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-gray-800">
                {log.reward_type} - {log.description || "Reward"}
              </h3>
              <span className="px-3 py-1 text-sm rounded-full font-medium bg-yellow-400 text-yellow-800">
                +{log.points_awarded} Points
              </span>
            </div>
            {log.resource?.title && (
              <p className="text-sm text-gray-600 mb-1">
                Related to: <span className="font-medium">{log.resource.title}</span>
              </p>
            )}
            <div className="flex items-center text-xs text-gray-500">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>
                Awarded on: {new Date(log.awarded_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full justify-center flex flex-col items-center text-center">
          <img src={noData} className="w-[250px] md:w-[300px]" alt="No rewards yet" />
          <p className="mt-4 text-xl text-gray-700">
            No rewards earned yet.
          </p>
          <p className="text-sm text-gray-500">
            Keep contributing to earn points!
          </p>
        </div>
      )}
    </div>
  );
};

export default Rewards;
