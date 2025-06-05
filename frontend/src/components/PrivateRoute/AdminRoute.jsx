import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../../Context/AuthContext";
import { supabase } from "../../supabaseClient";
import { toast } from "react-hot-toast";

const AdminRoute = ({ children }) => {
  const { session } = UserAuth();
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading

  useEffect(() => {
    if (!session) return;
    
    const checkRole = async () => {
      if (!session?.user?.id) {
        console.log("go away");
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

    checkRole();
  }, [session]);

  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen text-3xl font-bold">
        Checking Role...
      </div>
    );
  }
  if (isAuthorized === false && !session) {
    return <Navigate to="/signin" replace />;
  }

  if (!isAuthorized) {
    return (
      <>
        <Navigate to="/" replace />;{toast.error("Unauthorized access")}
      </>
    );
  }

  return children;
};

export default AdminRoute;
