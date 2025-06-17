import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../../Context/AuthContext";
import { supabase } from "../../supabaseClient";
import { toast } from "react-hot-toast";

const AdminRoute = ({ children }) => {
  const { session } = UserAuth();
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading

  useEffect(() => {
    const checkRole = async () => {
      if (!session?.user?.id) {
        setIsAuthorized(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || !data) {
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(data.role === "admin");
    };

    if (session) {
      checkRole();
    } else {
      setIsAuthorized(false); // Not logged in
    }
  }, [session]);

  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen text-3xl font-bold">
        Checking Role...
      </div>
    );
  }

  if (!session || !isAuthorized) {
    toast.error("Unauthorized access");
    return <Navigate to={session ? "/" : "/signin"} replace />;
  }

  return children;
};

export default AdminRoute;
