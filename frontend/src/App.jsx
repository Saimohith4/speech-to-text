import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadPanel from "./components/UploadPanel";
import RecorderPanel from "./components/RecorderPanel";
import TranscriptPanel from "./components/TranscriptPanel";

export default function App() {
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();

  // ✅ Step 5: Protect the page — redirect if not logged in
 useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    navigate("/signin", { replace: true }); // prevents redirect loop
  }
}, [navigate]);


  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500">
      {/* 🌈 Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 opacity-60 blur-3xl animate-pulse"></div>

      <div className="relative z-10 w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white mx-4">
        <h1 className="text-4xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white drop-shadow-lg">
          🎙️ Speech to Text
        </h1>
        <p className="text-center text-gray-200 mb-8">
          Convert your voice into text instantly with Deepgram AI
        </p>

        {/* 🎤 Recorder & Transcript Components */}
        <RecorderPanel setTranscript={setTranscript} />
        <UploadPanel setTranscript={setTranscript} />
        <TranscriptPanel transcript={transcript} />

        {/* 👇 Optional Logout Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              localStorage.removeItem("userId");
              navigate("/signin");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}   