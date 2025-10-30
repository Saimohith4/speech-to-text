import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Account created! Redirecting...");
        localStorage.setItem("userId", data.userId);
        setTimeout(() => navigate("/signin"), 1500);
      } else {
        setMessage(data.error || "❌ Signup failed");
      }
    } catch (err) {
      setMessage("❌ Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md text-white">
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white">
          ✨ Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-yellow-400 to-pink-400 text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
          >
            Sign Up
          </button>
        </form>

        {message && <p className="text-center mt-4 text-yellow-300">{message}</p>}

        <p className="text-center mt-6 text-gray-200">
          Already have an account?{" "}
          <Link to="/signin" className="text-yellow-300 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
