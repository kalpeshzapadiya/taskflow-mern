import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar, UserRound, CircleCheck } from "lucide-react";
import api from "../services/api";
import LoadingState from "../components/LoadingState";

export default function ProjectDetailPage({ projectId, onBack }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!projectId) { setError("Select a project to view its details."); setLoading(false); return; }
    setLoading(true); setError("");
    api.get(`/projects/${projectId}`).then(({ data }) => {
      if (active) setProject(data.project || data.data);
    }).catch((err) => {
      if (active) setError(err.response?.data?.message || "Unable to load project details.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [projectId]);

  if (loading) return <LoadingState message="Loading project details..." />;
  return <div className="space-y-6 max-w-4xl mx-auto">
    <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"><ArrowLeft size={16}/> Back to Projects</button>
    {error ? <div role="alert" className="p-4 rounded-lg bg-red-50 text-red-700">{error}</div> : project && <div className="bg-white p-6 rounded-xl border shadow-sm space-y-5">
      <div className="flex flex-wrap justify-between gap-3"><div><span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded">Project details</span><h2 className="text-2xl font-bold mt-2">{project.name}</h2></div><span className="px-3 py-1 h-fit rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">{project.status || "planning"}</span></div>
      <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.description || "No description provided."}</p>
      <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t">
        <div className="flex items-center gap-3"><Calendar size={20} className="text-gray-400"/><div><p className="text-xs text-gray-400">Deadline</p><p className="text-sm font-semibold">{project.deadline ? new Date(project.deadline).toLocaleDateString() : "Not set"}</p></div></div>
        <div className="flex items-center gap-3"><UserRound size={20} className="text-gray-400"/><div><p className="text-xs text-gray-400">Created by</p><p className="text-sm font-semibold">{project.createdBy?.fullName || "Current workspace member"}</p></div></div>
        <div className="flex items-center gap-3"><CircleCheck size={20} className="text-gray-400"/><div><p className="text-xs text-gray-400">Created</p><p className="text-sm font-semibold">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "—"}</p></div></div>
      </div>
    </div>}
  </div>;
}
