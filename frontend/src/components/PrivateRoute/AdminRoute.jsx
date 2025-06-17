import { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../../Context/AuthContext";
import { supabase } from "../../supabaseClient";
import { toast } from "react-hot-toast";

const AdminRoute = ({ children }) => {
  const { session } = UserAuth();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      if (!session?.user?.id) return;

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
    }
  }, [session]);

  // Not logged in
  if (!session) {
    toast.error("Unauthorized access");
    return <Navigate to="/signin" replace />;
  }

  // Still checking
  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen text-3xl font-bold">
        Checking Role...
      </div>
    );
  }

  // Not admin
  if (!isAuthorized) {
    toast.error("Unauthorized access");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
