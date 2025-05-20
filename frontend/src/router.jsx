import {createBrowserRouter} from "react-router-dom";
import SignUp from "./components/SignUp/SIgnUp";
import SignIn from "./components/SignIn/SignIn";
import Dashboard from "./routes/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/signin", element: <SignIn /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);