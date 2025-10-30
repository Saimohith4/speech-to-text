import { useState } from "react";

export default function UploadPanel({ setTranscript }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an audio file first!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("audio", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.transcript) {
        setTranscript(data.transcript);
      } else {
        alert("Transcription failed. Try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading audio file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-6 shadow-inner mb-8 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-green-300 flex items-center justify-center gap-2">
        🎧 Upload Audio File
      </h2>

      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-300 mb-4 
                   file:mr-4 file:py-2 file:px-4 
                   file:rounded-full file:border-0 
                   file:text-sm file:font-semibold 
                   file:bg-gradient-to-r file:from-purple-400 file:to-pink-500 
                   hover:file:opacity-80"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-6 py-2 rounded-lg font-semibold transition-transform ${
          uploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-green-400 to-teal-500 text-black hover:scale-105"
        }`}
      >
        {uploading ? "⏳ Uploading..." : "🚀 Upload & Transcribe"}
      </button>
    </div>
  );
}
