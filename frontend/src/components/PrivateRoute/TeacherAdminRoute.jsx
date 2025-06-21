import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../../Context/AuthContext";

const TeacherAdminRoute = ({ children }) => {
  const { profile, loadingProfile, loadingAuth } = UserAuth();

  if (loadingProfile || loadingAuth) return null;
  if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default TeacherAdminRoute;
