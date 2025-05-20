import { useState, useContext, useEffect } from "react";
import {Link} from "react-router-dom"
import SignIn from "./components/SignIn/SignIn";
import { UserAuth } from "./Context/AuthContext";
import { createClient } from "@supabase/supabase-js";
import Navbar from "./components/Navbar/Navbar";

function App() {


  return (
    <>
    <Navbar/>
    </>
  );
}

export default App;
