import { createBrowserRouter } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import SubjectDetail from "./components/academics/SubjectDetail/SubjectDetail";
import Subject from "./components/academics/Subject/Subject";
import App from "./App";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import Home from "./components/Home/Home";
import SignUp from "./components/SIgnUp/SignUp.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "academics", element: <Subject /> },
      { path: "subject/:id", element: <SubjectDetail /> },
      {
        path: "dashboard",
        element: (
          // <PrivateRoute>
          <Dashboard />
          // </PrivateRoute>
        ),
      },
    ],
  },
  { path: '/signup', element: <SignUp /> },
  { path: '/signin', element: <SignIn /> },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);

export default router;
