"use client";

import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import StatsHeader from "@/components/StatsHeader";
import { useState } from "react";
import { Volume2, Moon, Sparkles, Globe, Shield, RefreshCw, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function SettingsPage() {
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [motivationalMsgs, setMotivationalMsgs] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  useState(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setDarkMode(isDark);
    }
  });

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar className="hidden md:flex" />
        <BottomNav />

      <div className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0 max-w-4xl border-r border-sidebar-border bg-background">
        <StatsHeader />

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-xl mx-auto flex flex-col gap-8">
            
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-6xl select-none">⚙️</span>
              <h1 className="text-3xl font-black text-text-primary tracking-wide">Settings</h1>
              <p className="font-bold text-text-secondary">Configure your learning experience and profile options.</p>
            </div>

            {/* Settings Options List */}
            <div className="flex flex-col gap-5">
              
              {/* Sound Effects */}
              <div className="border-2 border-card-border rounded-2xl p-5 flex items-center justify-between bg-card-bg shadow-sm hover:border-sidebar-border transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-950/20 text-emerald-500 rounded-xl p-3 border-2 border-emerald-900/30">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-text-primary">Sound Effects</h3>
                    <p className="text-xs font-bold text-text-secondary mt-0.5">Play sounds on correct or incorrect answers.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSoundEffects(!soundEffects)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                    soundEffects ? "bg-[#58cc02]" : "bg-sidebar-border"
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                    style={{ marginLeft: soundEffects ? "1.5rem" : "0" }}
                  />
                </button>
              </div>

              {/* Dark Mode */}
              <div className="border-2 border-card-border rounded-2xl p-5 flex items-center justify-between bg-card-bg shadow-sm hover:border-sidebar-border transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-950/20 text-blue-500 rounded-xl p-3 border-2 border-blue-900/30">
                    <Moon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-text-primary">Dark Mode</h3>
                    <p className="text-xs font-bold text-text-secondary mt-0.5">Enable dark interface aesthetics.</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`w-14 h-8 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                    darkMode ? "bg-[#58cc02]" : "bg-sidebar-border"
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                    style={{ marginLeft: darkMode ? "1.5rem" : "0" }}
                  />
                </button>
              </div>

              {/* Motivational Messages */}
              <div className="border-2 border-card-border rounded-2xl p-5 flex items-center justify-between bg-card-bg shadow-sm hover:border-sidebar-border transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-950/20 text-yellow-500 rounded-xl p-3 border-2 border-yellow-900/30">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-text-primary">Motivational Messages</h3>
                    <p className="text-xs font-bold text-text-secondary mt-0.5">Show encouraging owl prompts during lessons.</p>
                  </div>
                </div>
                <button
                  onClick={() => setMotivationalMsgs(!motivationalMsgs)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                    motivationalMsgs ? "bg-[#58cc02]" : "bg-sidebar-border"
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                    style={{ marginLeft: motivationalMsgs ? "1.5rem" : "0" }}
                  />
                </button>
              </div>

              {/* Public Profile */}
              <div className="border-2 border-card-border rounded-2xl p-5 flex items-center justify-between bg-card-bg shadow-sm hover:border-sidebar-border transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-950/20 text-purple-500 rounded-xl p-3 border-2 border-purple-900/30">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-text-primary">Public Profile</h3>
                    <p className="text-xs font-bold text-text-secondary mt-0.5">Allow other learners to search your profile and compete.</p>
                  </div>
                </div>
                <button
                  onClick={() => setPublicProfile(!publicProfile)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                    publicProfile ? "bg-[#58cc02]" : "bg-sidebar-border"
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                    style={{ marginLeft: publicProfile ? "1.5rem" : "0" }}
                  />
                </button>
              </div>

            </div>

            {/* Mascot Banner */}
            <div className="bg-gradient-to-r from-blue-950/20 to-indigo-950/20 border-2 border-blue-900/30 rounded-2xl p-5 flex flex-col gap-2">
              <h4 className="font-extrabold text-indigo-400 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" />
                Data & Privacy
              </h4>
              <p className="text-xs font-medium text-indigo-600/90 leading-relaxed">
                Your settings are saved to your local session automatically. Changing settings does not impact your current lesson progress or weekly streak.
              </p>
            </div>

            {/* Log Out Button */}
            <button
              onClick={() => {
                if (confirm("Are you sure you want to log out?")) {
                  localStorage.clear();
                  useStore.getState().setLoggedIn(false);
                  alert("Logged out successfully!");
                  window.location.href = "/";
                }
              }}
              className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-2xl cursor-pointer text-center transition-all shadow-md mt-4 border-b-4 border-rose-700 active:border-b-0 flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
            >
              <LogOut className="w-4.5 h-4.5" />
              Log Out
            </button>

          </div>
        </main>
      </div>
    </div>
  );
}
