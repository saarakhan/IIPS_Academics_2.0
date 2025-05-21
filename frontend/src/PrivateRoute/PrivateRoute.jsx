import { UserAuth } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { session } = UserAuth();
    console.log("PrivateRoute user:", session);

   // Better: Ensure session is present AND contains a valid token or user object
  if (!session || !session.access_token) {
    return <Navigate to="/signin" replace />;
  }


  return children;
};

export default PrivateRoute;
