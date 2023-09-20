"use client";

import { useRef, useState } from "react";

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    videoRef.current.srcObject = stream;

    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const recordedBlob = new Blob(chunks, { type: "video/webm" });
      const formData = new FormData();
      formData.append("video", recordedBlob);

      // Send the recorded video to your Flask backend via a POST request
      fetch("/upload", {
        method: "POST",
        body: formData,
      });
    };

    setMediaRecorder(recorder);
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <h2>Webcam Video Capture</h2>
      <video ref={videoRef} autoPlay playsInline />
      {isRecording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}
    </div>
  );
};

export default WebcamCapture;
