import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { CalendarIcon } from "../../../Icons";
import noData from "../../../assets/noData.svg";
import { FaTrophy } from "react-icons/fa";
import { UserAuth } from "../../../Context/AuthContext";

function Card({ children }) {
  return <div className="bg-white border-b-2 cursor-pointer">{children}</div>;
}

function CardContent({ children }) {
  return <div className="p-4 flex items-center justify-between">{children}</div>;
}

const rewardTypeColorMap = {
  NOTE: "bg-[#8eba6c] text-white",
  PYQ: "bg-[#6c92ba] text-white",
  SYLLABUS: "bg-[#ba876c] text-white",
};

export default function Rewards() {
  const { session } = UserAuth();
  const [rewardsLog, setRewardsLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchRewards = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("rewards_points")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;
        setTotalPoints(profileData?.rewards_points || 0);

        const { data: logData, error: logError } = await supabase
          .from("user_rewards_log")
          .select(
            "id, reward_type, points_awarded, description, awarded_at, related_resource_id, resource:related_resource_id(title)"
          )
          .eq("profile_id", session.user.id)
          .order("awarded_at", { ascending: false });

        if (logError) throw logError;
        setRewardsLog(logData || []);
      } catch (err) {
        console.error("Error fetching rewards:", err);
        setError("Failed to fetch rewards.");
        setRewardsLog([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [session?.user?.id]);

  if (loading) return <div className="text-center py-8">Loading your rewards...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Header Row with Points on Right */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-3xl font-bold">Rewards</p>
          <p className="text-base text-gray-600">Rewards you have earned</p>
        </div>
        <div className="border-2 rounded-md px-4 py-3 text-center shrink-0 w-fit">
          <p className="text-yellow-400 font-bold text-2xl">{totalPoints}</p>
          <p className="text-sm text-gray-600">Total Points</p>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {rewardsLog.length > 0 ? (
          <div className="flex flex-col gap-2">
            {rewardsLog.map((item) => (
              <Card key={item.id}>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 w-full justify-between">
                    <div className="flex gap-3 items-start">
                      <div className="p-2 bg-gray-200 rounded-full shrink-0">
                        <FaTrophy className="text-orange-300 text-lg" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm sm:text-base break-words">
                            {item.resource?.title || item.description || "Untitled Reward"}
                          </h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm text-[#3B3838]">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="text-xs sm:text-sm">
                              {new Date(item.awarded_at).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rewards + Type Tags */}
                    <div className="flex flex-row-reverse gap-2 items-center ml-auto sm:ml-12 sm:self-center self-start mt-2 sm:mt-0">
                      <span
                        className="px-3 py-1 text-sm font-semibold rounded-xl"
                        style={{ backgroundColor: "#528069", color: "#FFFEFE" }}
                      >
                        +{item.points_awarded}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${rewardTypeColorMap[item.reward_type] || "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {item.reward_type}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="w-full justify-center flex flex-col items-center text-center py-8">
            <img src={noData} className="w-[200px] md:w-[250px]" alt="No rewards yet" />
            <p className="mt-4 text-lg text-gray-700">No rewards earned yet.</p>
            <p className="text-sm text-gray-500">Keep contributing to earn points!</p>
          </div>
        )}
      </div>
    </div>
  );
}

