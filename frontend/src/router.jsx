import { Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp/SIgnUp";
import SignIn from "./components/SignIn/SignIn";
import Dashboard from "./Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute/PrivateRoute"; // Optional if using protected route logic

function Router() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
           </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default Router;
