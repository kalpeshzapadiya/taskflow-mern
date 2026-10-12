import React, { useState } from "react";
import api from "../services/api";

export default function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? { fullName: fullName.trim(), email: email.trim(), password } : { email: email.trim(), password };
      const { data } = await api.post(endpoint, payload);
      if (!data.success || !data.accessToken) {
        setError(data.message || "Authentication failed.");
        return;
      }
      localStorage.setItem("accessToken", data.accessToken);
      if (data.currentOrgId) localStorage.setItem("currentOrgId", data.currentOrgId);
      localStorage.setItem("taskflowUser", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-slate-900 justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">{isRegister ? "Create an Account" : "Welcome Back"}</h2>
          <p className="text-sm text-gray-500">Plan, collaborate, and execute workflows seamlessly.</p>
        </div>
        {error && <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required minLength="2" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your full name" />
          </div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your email address" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required minLength={isRegister ? 8 : 1} autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your password" />
          </div>
          <button disabled={submitting} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">{submitting ? "Please wait..." : isRegister ? "Register Account" : "Sign In"}</button>
        </form>
        <div className="text-center"><button type="button" onClick={() => { setIsRegister(!isRegister); setError(""); }} className="text-sm text-blue-600 hover:underline">{isRegister ? "Already have an account? Sign in" : "Don't have an account? Register"}</button></div>
      </div>
    </div>
  );
}
