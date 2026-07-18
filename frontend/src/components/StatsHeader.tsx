"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Flame, Zap, Heart, Award, Gem, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../services/api";
import { useStore } from "../store/useStore";
import { useEffect, useState } from "react";

export default function StatsHeader() {
  const queryClient = useQueryClient();
  const { user, setUser, gems } = useStore();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: api.getUserProfile,
  });

  const refillMutation = useMutation({
    mutationFn: api.refillHearts,
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(["profile"], data);
    },
  });

  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile, setUser]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const activeUser = user || profile;

  if (isLoading || !activeUser) {
    return (
      <header className="h-16 border-b border-sidebar-border px-8 flex items-center justify-between bg-sidebar-bg sticky top-0 z-40">
        <div className="w-24 h-6 bg-sidebar-border rounded animate-pulse" />
        <div className="flex gap-6">
          <div className="w-12 h-6 bg-sidebar-border rounded animate-pulse" />
          <div className="w-12 h-6 bg-sidebar-border rounded animate-pulse" />
          <div className="w-12 h-6 bg-sidebar-border rounded animate-pulse" />
          <div className="w-12 h-6 bg-sidebar-border rounded animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 border-b border-sidebar-border px-8 flex items-center justify-between bg-sidebar-bg sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <span className="text-2xl select-none">🇪🇸</span>
        <span className="font-black text-sm text-text-secondary uppercase tracking-wide">Spanish</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-2xl border border-sidebar-border hover:bg-card-bg text-text-secondary transition-all cursor-pointer flex items-center justify-center shadow-sm"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500 fill-current" />
          ) : (
            <Moon className="w-5 h-5 text-blue-500 fill-current" />
          )}
        </button>

        {/* Streak */}
        <div className="flex items-center gap-2 font-black text-text-secondary hover:text-[#ff9600] transition-colors">
          <Flame className="w-6 h-6 fill-current text-[#ff9600]" />
          <span>{activeUser.streak}</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-2 font-black text-[#ffc800]">
          <Zap className="w-6 h-6 fill-current" />
          <span>{activeUser.xp}</span>
        </div>

        {/* Gems */}
        <div className="flex items-center gap-2 font-black text-[#1cb0f6]">
          <Gem className="w-6 h-6 fill-current" />
          <span>{gems}</span>
        </div>

        {/* Hearts */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (activeUser.hearts < activeUser.max_hearts) {
              refillMutation.mutate();
            }
          }}
          disabled={refillMutation.isPending || activeUser.hearts >= activeUser.max_hearts}
          className={`flex items-center gap-2 font-black px-3 py-1.5 rounded-2xl border transition-all ${
            activeUser.hearts < activeUser.max_hearts
              ? "text-[#ff4b4b] border-[#ff4b4b]/30 bg-[#ff4b4b]/10 hover:bg-[#ff4b4b]/20 cursor-pointer"
              : "text-[#ff4b4b] border-transparent bg-transparent"
          }`}
        >
          <Heart className={`w-6 h-6 fill-current ${refillMutation.isPending ? "animate-pulse" : ""}`} />
          <span>{activeUser.hearts}</span>
          {activeUser.hearts < activeUser.max_hearts && (
            <span className="text-xs text-[#ff4b4b]/70 font-black ml-1">REFILL</span>
          )}
        </motion.button>
      </div>
    </header>
  );
}
