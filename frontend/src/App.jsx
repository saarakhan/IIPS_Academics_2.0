import { useState, useContext } from "react";
import {Link} from "react-router-dom"
import SignIn from "./components/SignIn/SignIn";
import { UserAuth } from "./Context/AuthContext";
import "./App.css";

function App() {
  // const user = UserAuth();
 
  return (
    <>
      <SignIn/>
    </>
  );
}

export default App;
