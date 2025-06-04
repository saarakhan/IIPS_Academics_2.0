import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Welcom from "../src/assets/welcome_video.mov";
import { Toaster } from "react-hot-toast";
import Footer from './components/Home/Footer'
function App() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoAnimationDone, setVideoAnimationDone] = useState(false);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  return (
    <div >
      {/* <AnimatePresence>
        {!videoAnimationDone && (
          <motion.div
            key="video-wrapper"
            className="absolute top-0 left-0 w-full h-full z-50"
            initial={{ scaleY: 1 }}
            animate={videoEnded ? { scaleY: 0 } : { scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }} // ⬅️ shrink from bottom
            onAnimationComplete={() => {
              if (videoEnded) setVideoAnimationDone(true);
            }}
          >
            <video
              src={Welcom}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnd}
              onError={handleVideoEnd}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Main App Content (static) */}
      <div className="relative z-0 w-full h-full">
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar />
        <Outlet />
        <Footer/>
      </div>
    </div>
  );
}

export default App;
