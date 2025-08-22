import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [logs, setLogs] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const t = await api.get(`/tickets/${id}`);
    setTicket(t.data);
    setLogs((await api.get(`/audit/${id}`)).data);
    setSuggestion((await api.get(`/agent-suggestions/${id}`)).data);
  }

  async function submitReview() {
    await api.post(`/agent-review/${id}/review`, { finalReply: reply });
    load();
  }

  if (!ticket) return <p>Loading...</p>;

  return (
  <div className="max-w-3xl mx-auto p-8">
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-8">
      <h1 className="text-2xl font-bold text-blue-800 mb-2">{ticket.title}</h1>
      <p className="mb-4 text-gray-700">{ticket.description}</p>

      {suggestion && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-blue-700 mb-1">AI Draft Reply</h2>
          <p className="text-gray-700 whitespace-pre-line">{suggestion.draftReply}</p>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">Final Reply</label>
        <textarea value={reply} onChange={e=>setReply(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-2" rows="4"
          placeholder="Edit or approve AI draft"/>
        <button onClick={submitReview} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold shadow transition">
          Submit Final Reply
        </button>
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mt-8 mb-3">Audit Log</h2>
      <ul>
        {logs.map(l => (
          <li key={l._id}>{l.actor} - {l.action} ({new Date(l.timestamp).toLocaleString()})</li>
        ))}
      </ul>
    </div>
  </div>
);
}
