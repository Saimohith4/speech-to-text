import { useState, useRef } from "react";

export default function RecorderPanel({ setTranscript }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        const res = await fetch("http://localhost:5000/api/transcribe", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setTranscript(data.transcript);
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      alert("🎙️ Microphone access denied or not available!");
      console.error(error);
    }
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative group">
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-lg font-semibold px-10 py-4 rounded-full shadow-lg transition-transform transform hover:scale-110 hover:shadow-2xl focus:outline-none"
          >
            🎙️ Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-lg font-semibold px-10 py-4 rounded-full shadow-lg animate-pulse hover:shadow-2xl focus:outline-none"
          >
            ⏹ Stop Recording
          </button>
        )}
      </div>
      <p className="mt-4 text-gray-200 italic text-sm">
        {recording ? "Recording in progress..." : "Click to start recording your voice"}
      </p>
    </div>
  );
}
