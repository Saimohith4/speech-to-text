import { useEffect, useState } from "react";

export default function TranscriptPanel({ transcript }) {
  const [history, setHistory] = useState([]);

  const fetchHistory = () => {
    fetch("http://localhost:5000/api/history")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("Error fetching history:", err));
  };

  useEffect(() => {
    fetchHistory();
  }, [transcript]);

  const deleteAllHistory = async () => {
    if (!window.confirm("🗑️ Delete all saved transcripts?")) return;
    const res = await fetch("http://localhost:5000/api/history", {
      method: "DELETE",
    });
    if (res.ok) {
      alert("All transcripts deleted!");
      fetchHistory();
    }
  };

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-300 drop-shadow-lg">
        📝 Current Transcript
      </h2>

      <div className="bg-white/20 border border-white/30 rounded-xl p-4 min-h-[120px] text-white shadow-inner">
        {transcript ? (
          <p className="text-lg leading-relaxed animate-fade-in">{transcript}</p>
        ) : (
          <p className="text-gray-300 italic">
            Your transcription will appear here after recording...
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-6 mb-3">
        <h3 className="text-xl font-semibold text-yellow-300">📜 History</h3>
        <button
          onClick={deleteAllHistory}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow-md text-sm transition"
        >
          🗑️ Clear History
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl p-3 max-h-56 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-gray-300 italic text-center">No transcripts saved yet.</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="border-b border-white/20 py-2">
              <p className="text-gray-100">{item.text}</p>
              <small className="text-gray-400 text-xs">
                {new Date(item.created_at).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
