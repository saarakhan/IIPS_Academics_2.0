import { useEffect, useState } from "react";
import { UserAuth } from "../../../Context/AuthContext";
import { supabase } from "../../../supabaseClient";
import { CalendarIcon } from "../../../Icons";
import noData from "../../../assets/noData.svg";
import { FaTrophy } from "react-icons/fa";

const Rewards = () => {
  const { session } = UserAuth();
  const [rewardsLog, setRewardsLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total_rewards, SetTotal_rewards] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchRewards = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: rewardData, error: rewardError } = await supabase
          .from("profiles")
          .select("rewards_points")
          .eq("id", session.user.id)
          .single();

        if (rewardError) throw rewardError;

        SetTotal_rewards(rewardData?.rewards_points || 0);

        const { data: rewardsLogData, error: fetchError } = await supabase
          .from("user_rewards_log")
          .select(
            "id, reward_type, points_awarded, description, awarded_at, related_resource_id, resource:related_resource_id(title)"
          )
          .eq("profile_id", session.user.id)
          .order("awarded_at", { ascending: false });

        if (fetchError) throw fetchError;

        setRewardsLog(rewardsLogData || []);
      } catch (err) {
        console.error("Error fetching rewards:", err);
        setError(err.message || "Failed to fetch rewards.");
        setRewardsLog([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [session?.user?.id]);

  if (loading) {
    return <div className="text-center py-8">Loading your rewards...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Section - Fixed height */}
      <div className="pb-4">
        <p className="text-3xl font-bold">Rewards</p>
        <p className="text-base text-gray-600">Rewards you have earned</p>
      </div>
      
      {/* Summary Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-center">
        <div className="border rounded-lg p-3">
          <p className="text-yellow-400 font-bold text-2xl">{total_rewards}</p>
          <p className="text-xl text-gray-600">Total Points</p>
        </div>
      </div>
      
      {/* Scrollable Rewards List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {rewardsLog.length > 0 ? (
          <div className="space-y-3">
            {rewardsLog.map((log) => (
              <div
                key={log.id}
                className="flex justify-between items-center bg-white shadow-sm px-4 py-3 border-b-2 border-gray-100 rounded-lg"
              >
                <div className="flex gap-3 items-center">
                  <div className="bg-gray-100 rounded-2xl p-2">
                    <FaTrophy className="text-orange-300 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {log.resource?.title || "Untitled Reward"}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>
                        {new Date(log.awarded_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                  +{log.points_awarded} {log.reward_type}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center py-8">
            <img
              src={noData}
              className="w-[200px] md:w-[250px]"
              alt="No rewards yet"
            />
            <p className="mt-4 text-lg text-gray-700">No rewards earned yet.</p>
            <p className="text-sm text-gray-500">
              Keep contributing to earn points!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
