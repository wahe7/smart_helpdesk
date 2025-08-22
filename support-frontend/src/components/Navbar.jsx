import { Link } from "react-router-dom";

export default function Navbar() {
  const role = localStorage.getItem("role"); // user | agent | admin

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location = "/";
  }

  return (
    <nav className="bg-white shadow flex items-center px-6 py-3 mb-6">
  <div className="flex items-center gap-2 text-blue-700 font-bold text-lg mr-8">
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563eb"/><text x="12" y="17" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">W</text></svg>
    WaveDesk
  </div>
  <Link to="/tickets" className="mx-2 text-gray-700 hover:text-blue-700 font-medium transition">Tickets</Link>
  {(role === "agent" || role === "admin") && (
    <Link to="/tickets/review" className="mx-2 text-gray-700 hover:text-blue-700 font-medium transition">Agent Review</Link>
  )}
  {role === "admin" && (
    <Link to="/kb" className="mx-2 text-gray-700 hover:text-blue-700 font-medium transition">Knowledge Base</Link>
  )}
  <div className="ml-auto flex items-center gap-2">
    <span className="text-sm text-gray-500 mr-2 capitalize">{role}</span>
    <button onClick={logout} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded transition font-semibold shadow-sm">Logout</button>
  </div>
</nav>
  );
}
