import { useEffect, useState } from "react";
import api from "../api";

export default function KB() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await api.get("/kb");
    setArticles(res.data);
  }

  async function createArticle(e) {
    e.preventDefault();
    await api.post("/kb", { title, body });
    setTitle(""); setBody("");
    load();
  }

  async function deleteArticle(id) {
    await api.delete(`/kb/${id}`);
    load();
  }

  return (
  <div className="max-w-3xl mx-auto p-8">
    <h1 className="text-3xl font-bold mb-6 text-blue-800">Knowledge Base</h1>

    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Add New Article</h2>
      <form onSubmit={createArticle} className="flex flex-col md:flex-row gap-3 items-start">
        <input value={title} onChange={e=>setTitle(e.target.value)}
          placeholder="Title" className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/>
        <input value={body} onChange={e=>setBody(e.target.value)}
          placeholder="Body" className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold shadow transition w-full md:w-auto">Add</button>
      </form>
    </div>

    <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Articles</h2>
      <ul className="divide-y divide-gray-100">
        {articles.length === 0 && <li className="text-gray-400 py-4">No articles yet.</li>}
        {articles.map(a => (
          <li key={a._id} className="py-4 flex items-center justify-between">
            <div>
              <strong className="text-blue-700 text-base">{a.title}</strong>
              <span className="ml-3 text-gray-500 text-sm">{a.body.slice(0,60)}...</span>
            </div>
            <button onClick={() => deleteArticle(a._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded font-semibold shadow-sm transition">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}
