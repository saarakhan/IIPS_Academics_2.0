// import { useState, useContext, useEffect } from "react";
// import {Link} from "react-router-dom"
import SignIn from "./components/SignIn/SignIn";
// import { AuthContextProvider, UserAuth } from "./Context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import Dashboard from "./Dashboard/Dashboard";
import Home from "./components/Home/Home";

function App() {


  return (
    <>
    <Navbar/>
    <Routes>
       <Route path="/" element={<Home />} />
      <Route path='/signin' element={<SignIn/>} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
           </PrivateRoute>
        }
      />

    </Routes>
     
 
    </>
  );
}

export default App;
