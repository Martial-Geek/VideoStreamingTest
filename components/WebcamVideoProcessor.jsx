"use client";

import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

// const WebcamCapture = () => {
//   const videoRef = useRef(null);
//   const socketRef = useRef(null);
//   const processedVideoRef = useRef(null);
//   const frameBuffer = useRef([]);
//   const frameRate = 1; // Adjust this to match the frame rate set on the server

//   useEffect(() => {
//     socketRef.current = io("http://127.0.0.1:5000/");

//     socketRef.current.on("connect", () => {
//       console.log("Connected");
//     });

//     socketRef.current.on("processed_frame", (frameData) => {
//       // Add the received frame data to the buffer
//       frameBuffer.current.push(`data:image/jpeg;base64,${frameData}`);
//     });

//     const renderFrame = () => {
//       if (frameBuffer.current.length > 0) {
//         // Display the next frame in the buffer
//         processedVideoRef.current.src = frameBuffer.current.shift();
//       }
//       // Request the next frame to be displayed
//       requestAnimationFrame(renderFrame);
//     };

//     const startRendering = () => {
//       // Start rendering frames at the specified frame rate
//       setInterval(renderFrame, 1000 / frameRate);
//     };

//     const startRecording = async () => {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;

//       const captureFrame = async () => {
//         const canvas = document.createElement("canvas");
//         const targetWidth = 200;
//         const targetHeight =
//           (videoRef.current.videoHeight / videoRef.current.videoWidth) *
//           targetWidth;
//         canvas.width = targetWidth;
//         canvas.height = targetHeight;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(videoRef.current, 0, 0, targetWidth, targetHeight);

//         canvas.toBlob(
//           async (blob) => {
//             if (blob) {
//               const jpegBlob = new Blob([blob], { type: "image/jpeg" });
//               const arrayBuffer = await new Response(jpegBlob).arrayBuffer();
//               const base64_frame = btoa(
//                 new Uint8Array(arrayBuffer).reduce(
//                   (data, byte) => data + String.fromCharCode(byte),
//                   ""
//                 )
//               );
//               socketRef.current.emit("upload_frame", base64_frame);
//             }
//             requestAnimationFrame(captureFrame);
//           },
//           "image/jpeg",
//           0.5
//         );
//       };

//       startRendering(); // Start rendering frames at the desired frame rate
//       captureFrame();
//     };

//     startRecording();

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <h2>Webcam Video Capture</h2>
//       <video ref={videoRef} autoPlay playsInline controls />

//       <h2>Processed Video</h2>
//       {/* <video ref={processedVideoRef} autoPlay playsInline controls /> */}
//       <img ref={processedVideoRef} src="" alt="" />
//     </div>
//   );
// };

// export default WebcamCapture;

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const processedVideoRef = useRef(null);
  const frameBuffer = useRef([]);
  const frameRate = 1; // Adjust this to match the frame rate set on the server
  const [cameraActive, setCameraActive] = useState(true); // Track camera state

  useEffect(() => {
    socketRef.current = io("http://127.0.0.1:5000/");

    socketRef.current.on("connect", () => {
      console.log("Connected");
    });

    socketRef.current.on("processed_frame", (frameData) => {
      // Add the received frame data to the buffer
      frameBuffer.current.push(`data:image/jpeg;base64,${frameData}`);
    });

    const renderFrame = () => {
      if (frameBuffer.current.length > 0) {
        // Display the next frame in the buffer
        processedVideoRef.current.src = frameBuffer.current.shift();
      }
      // Request the next frame to be displayed
      requestAnimationFrame(renderFrame);
    };

    const startRendering = () => {
      // Start rendering frames at the specified frame rate
      setInterval(renderFrame, 1000 / frameRate);
    };

    const startRecording = async () => {
      if (!cameraActive) {
        // Stop the camera stream if it's not active
        videoRef.current.srcObject = null;
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      const captureFrame = async () => {
        const canvas = document.createElement("canvas");
        const targetWidth = 200;
        const targetHeight =
          (videoRef.current.videoHeight / videoRef.current.videoWidth) *
          targetWidth;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, targetWidth, targetHeight);

        canvas.toBlob(
          async (blob) => {
            if (blob) {
              const jpegBlob = new Blob([blob], { type: "image/jpeg" });
              const arrayBuffer = await new Response(jpegBlob).arrayBuffer();
              const base64_frame = btoa(
                new Uint8Array(arrayBuffer).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ""
                )
              );
              socketRef.current.emit("upload_frame", base64_frame);
            }
            requestAnimationFrame(captureFrame);
          },
          "image/jpeg",
          0.5
        );
      };

      startRendering(); // Start rendering frames at the desired frame rate
      captureFrame();
    };

    startRecording();

    return () => {
      socketRef.current.disconnect();
    };
  }, [cameraActive]); // Add cameraActive as a dependency

  const toggleCamera = () => {
    // Toggle the camera state when the button is clicked
    setCameraActive(!cameraActive);
  };

  return (
    <div>
      <h2>Webcam Video Capture</h2>
      <video ref={videoRef} autoPlay playsInline controls />

      <h2>Processed Video</h2>
      {/* <video ref={processedVideoRef} autoPlay playsInline controls /> */}
      <img ref={processedVideoRef} src="" alt="" />

      <button onClick={toggleCamera}>
        {cameraActive ? "Turn Off Camera" : "Turn On Camera"}
      </button>
    </div>
  );
};

export default WebcamCapture;
