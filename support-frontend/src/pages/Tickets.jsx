import { useEffect, useState } from "react";
import api from "../api";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await api.get("/tickets/me");
    setTickets(res.data);
  }

  async function createTicket(e) {
    e.preventDefault();
    await api.post("/tickets", { title, description: desc });
    setTitle(""); setDesc("");
    load();
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-blue-900 tracking-tight">My Tickets</h1>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">Create New Ticket</h2>
        <form onSubmit={createTicket} className="flex flex-col md:flex-row gap-4 items-start">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400"/>
          <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400"/>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition w-full md:w-auto">Create</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">Your Tickets</h2>
        <ul className="divide-y divide-gray-100">
          {tickets.length === 0 && <li className="text-gray-400 py-6 text-center">No tickets yet.</li>}
          {tickets.map(t => (
            <li key={t._id} className="py-5 flex items-center justify-between">
              <div>
                <strong className="text-blue-700 text-base md:text-lg font-medium">{t.title}</strong>
                <span className="ml-4 text-gray-500 text-sm md:text-base capitalize">{t.status}</span>
              </div>
              {/* Future: Add a details button here */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
