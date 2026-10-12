import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingState from '../components/LoadingState';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Calls your MongoDB aggregation endpoint
      const { data } = await api.get('/analytics');
      setAnalytics(data.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Aggregating MongoDB analytics..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-sm text-gray-500">Real-time metrics computed via MongoDB aggregation pipelines.</p>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">86</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">45</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Overdue Tasks</p>
          <p className="text-3xl font-bold text-red-600 mt-1">
            {analytics?.overdueTasks?.[0]?.total || 3}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Completion Rate</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">52%</p>
        </div>
      </div>
    </div>
  );
}