import React, { useEffect, useState } from "react";
import {
  LayoutDashboard, FolderKanban, CheckSquare, BarChart3, Building2,
  Settings, LogOut, Clock,
} from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectListPage from "./pages/ProjectListPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import KanbanBoardPage from "./pages/KanbanBoardPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import OrganizationPage from "./pages/OrganizationPage";
import SettingsPage from "./pages/SettingsPage";
import api from "./services/api";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("accessToken")));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("taskflowUser") || "null"); } catch { return null; }
  });
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get("/auth/me").then(({ data }) => {
      setUser(data.user);
      localStorage.setItem("taskflowUser", JSON.stringify(data.user));
    }).catch(() => {
      if (!localStorage.getItem("accessToken")) setIsAuthenticated(false);
    });
  }, [isAuthenticated]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("taskflowUser", JSON.stringify(loggedInUser));
    setIsAuthenticated(true);
    setCurrentScreen("dashboard");
  };

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch { /* clear local session regardless */ }
    ["accessToken", "currentOrgId", "taskflowUser"].forEach((key) => localStorage.removeItem(key));
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) return <AuthPage onLogin={handleLogin} />;

  const displayName = user?.fullName || user?.name || user?.email?.split("@")[0] || "My Profile";
  const initials = displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
              <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">TF</div>
              <div><h1 className="font-bold text-white tracking-wide">TaskFlow</h1><p className="text-xs text-slate-400">Plan • Collaborate • Achieve</p></div>
            </div>
            <nav className="p-4 space-y-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { id: "projects", label: "Projects", icon: FolderKanban },
                { id: "kanban", label: "Tasks Board", icon: CheckSquare },
                { id: "taskDetail", label: "Task Detail View", icon: Clock },
                { id: "analytics", label: "Analytics", icon: BarChart3 },
                { id: "organizations", label: "Organizations", icon: Building2 },
              ].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setCurrentScreen(id)}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentScreen === id ? "bg-blue-600 text-white shadow-sm" : "hover:bg-slate-800 text-slate-300"}`}>
                  <Icon size={18} />{label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-slate-800 space-y-2">
            <button onClick={() => setCurrentScreen("settings")} className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-800 transition-colors text-left ${currentScreen === "settings" ? "bg-slate-800 text-white" : ""}`}>
              <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-sm">{initials}</div>
              <div className="flex-1 overflow-hidden"><p className="text-sm font-medium text-white truncate">{displayName}</p><p className="text-xs text-slate-400 truncate">{user?.email || "Update your profile"}</p></div>
              <Settings size={16} className="text-slate-400" />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-slate-800 rounded-lg transition-colors"><LogOut size={14} /> Sign Out</button>
          </div>
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar currentOrg="My Workspace" />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {currentScreen === "dashboard" && <DashboardPage user={user} />}
            {currentScreen === "projects" && <ProjectListPage onViewProject={(id) => { setSelectedProjectId(id); setCurrentScreen("projectDetail"); }} />}
            {currentScreen === "projectDetail" && <ProjectDetailPage projectId={selectedProjectId} onBack={() => setCurrentScreen("projects")} />}
            {currentScreen === "kanban" && <KanbanBoardPage />}
            {currentScreen === "taskDetail" && <TaskDetailPage />}
            {currentScreen === "analytics" && <AnalyticsPage />}
            {currentScreen === "organizations" && <OrganizationPage />}
            {currentScreen === "settings" && <SettingsPage user={user} onProfileUpdated={(updated) => { setUser(updated); localStorage.setItem("taskflowUser", JSON.stringify(updated)); }} />}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
