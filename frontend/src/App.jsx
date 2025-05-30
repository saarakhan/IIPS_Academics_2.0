import React, { useState } from "react";
import { motion } from "framer-motion"
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Welcom from "../src/assets/welcome.mov";
import { Toaster } from "react-hot-toast";


function App() {
  // return (
  //   <>
          // <Toaster position="top-right" reverseOrder={false} />
  //     <Navbar />
  //     <Outlet />
  //   </>
  // );

  const [videoEnded, setVideoEnded] = useState(false);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center">
      {!videoEnded ? (
        <video
          src={Welcom}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          onError={handleVideoEnd}
          className="w-full h-full object-cover"
        />
      ) : (
        <motion.div
          className="w-full h-full bg-white"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3 }}
        >
          <Toaster position="top-right" reverseOrder={false} />
          <Navbar />
          <Outlet />
        </motion.div>
      )}
    </div>
  );
}

export default App;
