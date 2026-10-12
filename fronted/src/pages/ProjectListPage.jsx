import React, { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import api from "../services/api";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

export default function ProjectListPage({ onViewProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planning");
  const [saving, setSaving] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/projects");
      setProjects(data.projects || data.data || []);
    } catch (err) {
      console.error("Projects request failed:", err.response?.status, err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load projects. Check that the backend and MongoDB are running, then sign in again.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    try {
      setSaving(true);
      const { data } = await api.post("/projects", { name: name.trim(), description: description.trim(), status });
      const created = data.project || data.data;
      if (created) setProjects((current) => [created, ...current]);
      setName(""); setDescription(""); setStatus("planning"); setShowForm(false); setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create project.");
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingState message="Loading projects..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div><h2 className="text-2xl font-bold text-gray-900">Projects</h2><p className="text-sm text-gray-500">Projects in your current workspace.</p></div>
        <div className="flex gap-2">
          <button onClick={fetchProjects} className="border bg-white text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2"><RefreshCw size={15}/> Refresh</button>
          <button onClick={() => setShowForm((v) => !v)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700"><Plus size={16}/> New Project</button>
        </div>
      </div>
      {error && <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      {showForm && <form onSubmit={createProject} className="bg-white border rounded-xl p-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">Project name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter project name" className="mt-1 w-full border rounded-lg p-2.5 font-normal" /></label>
        <label className="text-sm font-medium">Status<select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full border rounded-lg p-2.5 font-normal"><option value="planning">Planning</option><option value="active">Active</option><option value="completed">Completed</option><option value="on-hold">On hold</option></select></label>
        <label className="text-sm font-medium md:col-span-2">Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter project description" rows="3" className="mt-1 w-full border rounded-lg p-2.5 font-normal" /></label>
        <div className="md:col-span-2 flex gap-2"><button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50">{saving ? "Saving..." : "Create Project"}</button><button type="button" onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-lg text-sm">Cancel</button></div>
      </form>}
      {projects.length === 0 ? <EmptyState title="No Projects Found" description="Create your first project workspace to start tracking tasks." actionText="New Project" onAction={() => setShowForm(true)} /> :
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase"><th className="p-4">Project Name</th><th className="p-4">Description</th><th className="p-4">Status</th><th className="p-4">Created</th><th className="p-4">Actions</th></tr></thead>
            <tbody className="divide-y text-sm">{projects.map((p) => <tr key={p._id} className="hover:bg-gray-50">
              <td className="p-4 font-medium text-gray-900">{p.name}</td><td className="p-4 text-gray-600 max-w-sm">{p.description || "—"}</td>
              <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{p.status || "planning"}</span></td>
              <td className="p-4 text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</td>
              <td className="p-4"><button onClick={() => onViewProject?.(p._id)} className="text-blue-600 font-medium hover:underline text-xs">View Details</button></td>
            </tr>)}</tbody>
          </table>
        </div>}
    </div>
  );
}
