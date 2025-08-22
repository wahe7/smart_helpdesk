import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", { email, password, name });
      nav("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563eb"/><text x="12" y="17" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">W</text></svg>
          <h1 className="text-2xl font-bold text-blue-700 mt-2 mb-1">Create Account</h1>
          <span className="text-gray-400 text-sm">Register for WaveDesk</span>
        </div>
        <label className="block text-gray-700 font-medium mb-1">Name</label>
        <input value={name} onChange={e=>setName(e.target.value)}
          type="text" autoComplete="name" required
          className="border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/>
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)}
          type="email" autoComplete="username" required
          className="border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/>
        <label className="block text-gray-700 font-medium mb-1">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
          autoComplete="new-password" required
          className="border border-gray-300 rounded px-3 py-2 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/>
        {error && <div className="text-red-500 text-sm mb-3 text-center">{error}</div>}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold shadow transition">Register</button>
        <div className="text-center mt-4 text-gray-500 text-sm">
          Already have an account? <a href="/" className="text-blue-600 hover:underline">Login</a>
        </div>
      </form>
    </div>
  );
}
