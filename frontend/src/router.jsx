import { createBrowserRouter, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import SubjectDetail from "./components/academics/SubjectDetail/SubjectDetail";
import Subject from "./components/academics/Subject/Subject";
import App from "./App";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import Home from "./components/Home/Home";
import SignUp from "./components/SIgnUp/SignUp.jsx";
import StudentContributions from "./components/StudentContributions/StudentContributions.jsx";
import ContactPage from "./components/contact/ContactPage.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import Placement from "./components/Placement/Placement";
import AdminRoute from "./components/PrivateRoute/AdminRoute.jsx";
import NotFound from "./components/Error/NotFound.jsx";
import RequestPasswordReset from "./components/Auth/RequestPasswordReset.jsx";
import UpdatePassword from "./components/Auth/UpdatePassword.jsx";
import OtpVerificationPage from "./components/SignIn/OtpVerificationPage.jsx";
import TeacherDashboardPage from "./components/Teacher/TeacherDashboardPage.jsx";
import TeacherAdminRoute from "./components/PrivateRoute/TeacherAdminRoute.jsx";
import Unauthorized from "./components/Error/Unauthorized.jsx";
import VerificationDashboard from "./components/Admin/VerificationDashboard.jsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "signin", element: <SignIn /> },
      { path: "otp-verification", element: <OtpVerificationPage /> },
      { path: "signup", element: <SignUp /> },
      { path: "request-password-reset", element: <RequestPasswordReset /> },
      { path: "update-password", element: <UpdatePassword /> },
      { path: "academics", element: <Subject /> },
      { path: "subject/:id", element: <SubjectDetail /> },
      { path: "Contributors", element: <StudentContributions /> },
      { path: "Contact", element: <ContactPage /> },
      { path: "placements", element: <Placement /> },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "admin/id-verfication",
        element: (
          <AdminRoute>
            <VerificationDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "teacher-dashboard",
        element: (
          <TeacherAdminRoute>
            <TeacherDashboardPage />
          </TeacherAdminRoute>
        ),
      },
      { path: "404", element: <NotFound /> },
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
]);

export default router;
