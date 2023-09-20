import WebcamCapture from "@/components/WebcamCapture";
import VideoSocket from "@/components/VideoSocket";
import WebcamVideoProcessor from "@/components/WebcamVideoProcessor";
import Test from "@/components/Test";

export default function Home() {
  return (
    <div>
      <h1 className="head-text">Home</h1>
      {/* <WebcamCapture /> */}
      {/* <VideoSocket /> */}
      <WebcamVideoProcessor />
      {/* <Test /> */}
    </div>
  );
}
