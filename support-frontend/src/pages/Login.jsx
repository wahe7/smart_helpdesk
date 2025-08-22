import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);
    nav("/tickets");
  }

  return (
  <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
    <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-100">
      <div className="flex flex-col items-center mb-6">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563eb"/><text x="12" y="17" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">W</text></svg>
        <h1 className="text-2xl font-bold text-blue-700 mt-2 mb-1">WaveDesk Portal</h1>
        <span className="text-gray-400 text-sm">Sign in to your account</span>
      </div>
      <label className="block text-gray-700 font-medium mb-1">Email</label>
      <input value={email} onChange={e=>setEmail(e.target.value)}
        type="email" autoComplete="username" required
        className="border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/>
      <label className="block text-gray-700 font-medium mb-1">Password</label>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
        autoComplete="current-password" required
        className="border border-gray-300 rounded px-3 py-2 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold shadow transition">Login</button>
      <div className="text-center mt-4 text-gray-500 text-sm">
        Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
      </div>
    </form>
  </div>
);
}
