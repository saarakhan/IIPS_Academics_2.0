import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Welcom from "./assets/welcome_video.MOV";
import { Toaster } from "react-hot-toast";
<<<<<<< HEAD
import Footer from './components/Home/Footer'
=======
// import "./App.css"

>>>>>>> 25b22303ac6659cc17291b7978b711bebae96a91
function App() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoAnimationDone, setVideoAnimationDone] = useState(false);
  const [shouldShowVideo, setShouldShowVideo] = useState(false);

  // play video only once
  useEffect(() => {
    const hasSeenVideo = sessionStorage.getItem("hasSeenWelcomeVideo");

    if (!hasSeenVideo) {
      setShouldShowVideo(true);
    } else {
      setVideoEnded(true);
      setVideoAnimationDone(true);
    }
  }, []);

  const handleVideoEnd = () => {
    sessionStorage.setItem("hasSeenWelcomeVideo", "true");
    setVideoEnded(true);
  };
  

  return (
<<<<<<< HEAD
    <div >
      {/* <AnimatePresence>
        {!videoAnimationDone && (
=======
    <div>
      <AnimatePresence>
        {shouldShowVideo && !videoAnimationDone && (
>>>>>>> 25b22303ac6659cc17291b7978b711bebae96a91
          <motion.div
            key="video-wrapper"
            className="absolute top-0 left-0 w-full h-full z-50"
            initial={{ scaleY: 1 }}
            animate={videoEnded ? { scaleY: 0 } : { scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
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

      {/* Main App Content */}
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
