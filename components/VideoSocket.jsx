"use client";

import React, { useEffect, useRef } from "react";
import io from "socket.io-client";

const VideoSocket = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const socket = io(); // Initialize the WebSocket connection

    socket.on("processed_frame", (frameData) => {
      const frameArray = new Uint8Array(frameData);
      const blob = new Blob([frameArray], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);

      // Display the processed frame
      videoRef.current.src = imageUrl;
    });

    return () => {
      socket.disconnect(); // Disconnect the WebSocket when the component unmounts
    };
  }, []);

  return (
    <div>
      <h2>Processed Video</h2>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default VideoSocket;
