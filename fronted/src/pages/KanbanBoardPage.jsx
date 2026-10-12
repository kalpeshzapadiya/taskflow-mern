import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import LoadingState from '../components/LoadingState';

const COLUMNS = ['Backlog', 'ToDo', 'InProgress', 'InReview', 'Done'];

export default function KanbanBoardPage({ projectId = 'default_id' }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/projects/${projectId}/tasks`);
      setTasks(data.data || []);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      // Optimistic state update
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      
      // Send PATCH request to backend to validate and update MongoDB document
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
    } catch (err) {
      alert(err.response?.data?.message || 'Workflow transition blocked by dependency rules.');
      fetchTasks(); // Rollback on failure
    }
  };

  if (loading) return <LoadingState message="Fetching tasks from MongoDB..." />;

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Project Workflow • Kanban Board</h2>
          <p className="text-xs text-gray-500">Live MongoDB state with backend rule enforcement.</p>
        </div>
        <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-blue-700 transition">
          <Plus size={14} /> Add Task
        </button>
      </div>
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter(t => t.status === col);
          return (
            <div key={col} className="w-72 bg-gray-100 rounded-xl p-3 flex flex-col shrink-0 border border-gray-200">
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="text-sm font-semibold text-gray-700">{col}</h3>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600 font-bold">{colTasks.length}</span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map((task) => (
                  <div key={task._id} className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm space-y-2">
                    <p className="text-sm font-medium text-gray-800">{task.title}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-medium">{task.priority}</span>
                      <select 
                        value={task.status} 
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className="border rounded text-xs p-1 bg-white"
                      >
                        {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}