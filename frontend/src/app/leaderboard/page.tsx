"use client";

import Sidebar from "@/components/Sidebar";
import StatsHeader from "@/components/StatsHeader";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Trophy, Medal, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: api.getLeaderboard,
  });

  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: api.getAchievements,
  });

  const completedLessons = achievements?.find((a) => a.icon_name === "check-circle")?.progress ?? 0;
  const isLocked = completedLessons < 3;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col min-h-screen bg-background">
        <StatsHeader />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Main Column */}
            <div className="lg:col-span-3 flex flex-col items-center gap-8">
              {isLocked ? (
                <div className="w-full flex flex-col items-center text-center gap-6 py-6">
                  {/* Three Shields Graphic with Sparkles */}
                  <div className="flex items-center justify-center relative py-6 select-none">
                    {/* Floating Diamond Sparkle Left */}
                    <div className="absolute left-10 top-0 transform -translate-x-6 -translate-y-4">
                      <svg className="w-5 h-5 animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 50 0 L 65 35 L 100 50 L 65 65 L 50 100 L 35 65 L 0 50 L 35 35 Z" fill="#ffe082" />
                      </svg>
                    </div>

                    {/* Floating Diamond Sparkle Right */}
                    <div className="absolute right-12 bottom-2 transform translate-x-6 translate-y-4">
                      <svg className="w-4 h-4 animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 50 0 L 65 35 L 100 50 L 65 65 L 50 100 L 35 65 L 0 50 L 35 35 Z" fill="#ffe082" />
                      </svg>
                    </div>

                    {/* Bronze Shield (Left) */}
                    <div className="transform translate-x-4 translate-y-3 z-0 filter drop-shadow-md">
                      <svg className="w-24 h-32 rotate-[-12deg] opacity-90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="bronze-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#cd7f32" />
                            <stop offset="100%" stopColor="#8b5a2b" />
                          </linearGradient>
                        </defs>
                        <path d="M 50 10 C 75 10 90 20 90 50 C 90 80 50 95 50 95 C 50 95 10 80 10 50 C 10 20 25 10 50 10 Z" fill="url(#bronze-grad)" stroke="#a0522d" strokeWidth="4" />
                        <path d="M 50 18 C 70 18 82 26 82 50 C 82 74 50 86 50 86 C 50 86 18 74 18 50 C 18 26 30 18 50 18 Z" fill="none" stroke="#d2691e" strokeWidth="2" opacity="0.4" />
                        <path d="M 50 35 C 58 35 65 42 65 50 C 65 58 58 65 50 65 C 42 65 35 58 35 50 C 35 42 42 35 50 35 Z" fill="#8b5a2b" opacity="0.3" />
                        <circle cx="50" cy="50" r="8" fill="#ffe082" opacity="0.7" />
                      </svg>
                    </div>

                    {/* Gold Shield (Center) */}
                    <div className="z-10 filter drop-shadow-xl">
                      <svg className="w-30 h-38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffe082" />
                            <stop offset="50%" stopColor="#ffb300" />
                            <stop offset="100%" stopColor="#ff8f00" />
                          </linearGradient>
                        </defs>
                        <path d="M 50 10 C 75 10 90 20 90 50 C 90 80 50 95 50 95 C 50 95 10 80 10 50 C 10 20 25 10 50 10 Z" fill="url(#gold-grad)" stroke="#fff59d" strokeWidth="5" />
                        <path d="M 50 18 C 70 18 82 26 82 50 C 82 74 50 86 50 86 C 50 86 18 74 18 50 C 18 26 30 18 50 18 Z" fill="none" stroke="#ffeb3b" strokeWidth="3" />
                        {/* Feather shape in center of Gold Shield */}
                        <path d="M 62 35 C 50 35 42 48 38 65 C 42 62 48 58 52 58 C 55 58 56 60 54 64 C 52 68 46 72 38 72 C 34 72 32 70 34 66 C 36 45 46 30 65 30 C 67 30 68 32 66 34 L 62 35 Z" fill="#e65100" />
                      </svg>
                    </div>

                    {/* Silver Shield (Right) */}
                    <div className="transform -translate-x-4 translate-y-3 z-0 filter drop-shadow-md">
                      <svg className="w-24 h-32 rotate-[12deg] opacity-90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#e0e0e0" />
                            <stop offset="100%" stopColor="#9e9e9e" />
                          </linearGradient>
                        </defs>
                        <path d="M 50 10 C 75 10 90 20 90 50 C 90 80 50 95 50 95 C 50 95 10 80 10 50 C 10 20 25 10 50 10 Z" fill="url(#silver-grad)" stroke="#cfd8dc" strokeWidth="4" />
                        <path d="M 50 18 C 70 18 82 26 82 50 C 82 74 50 86 50 86 C 50 86 18 74 18 50 C 18 26 30 18 50 18 Z" fill="none" stroke="#b0bec5" strokeWidth="2" opacity="0.4" />
                        <path d="M 50 35 C 58 35 65 42 65 50 C 65 58 58 65 50 65 C 42 65 35 58 35 50 C 35 42 42 35 50 35 Z" fill="#9e9e9e" opacity="0.3" />
                        <circle cx="50" cy="50" r="8" fill="#ffffff" opacity="0.7" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-black text-text-primary tracking-wide">Unlock Leaderboards!</h1>
                    <p className="font-bold text-text-secondary text-sm">
                      Complete {Math.max(0, 3 - completedLessons)} more lessons to start competing
                    </p>
                  </div>

                  <Link href="/">
                    <button className="px-10 py-3 bg-[#18272f] hover:bg-[#202f36]/40 border-2 border-[#37464f] text-[#1cb0f6] rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer">
                      START A LESSON
                    </button>
                  </Link>

                  {/* Blurred Placeholder Rows */}
                  <div className="w-full flex flex-col gap-5 mt-6 opacity-20 select-none pointer-events-none">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-card-border last:border-b-0">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-sidebar-border rounded-full" />
                          <div className="flex flex-col gap-2 align-start items-start">
                            <div className="w-28 h-4.5 bg-sidebar-border rounded-full" />
                            <div className="w-16 h-3 bg-sidebar-border rounded-full" />
                          </div>
                        </div>
                        <div className="w-14 h-4 bg-sidebar-border rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex flex-col items-center text-center gap-2">
                    <span className="text-6xl select-none">🏆</span>
                    <h1 className="text-3xl font-black text-text-primary tracking-wide">Weekly League</h1>
                    <p className="font-bold text-text-secondary">Compete with other learners around the world.</p>
                  </div>

                  {/* Leaderboard List */}
                  <div className="border-2 border-card-border rounded-3xl overflow-hidden bg-card-bg shadow-sm flex flex-col">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                      </div>
                    ) : (
                      leaderboard?.map((entry, idx) => {
                        const isGold = idx === 0;
                        const isSilver = idx === 1;
                        const isBronze = idx === 2;
                        const isUser = entry.username === "learner";

                        return (
                          <motion.div
                            key={entry.username}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`flex items-center justify-between px-6 py-4 border-b last:border-b-0 border-card-border transition-colors ${
                              isUser ? "bg-emerald-950/20 text-[#1cb0f6]" : "hover:bg-sidebar-border/30"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <span className="font-black text-base text-text-secondary w-6 text-center">
                                {idx + 1}
                              </span>

                              {isGold && <Medal className="w-6 h-6 text-yellow-500 fill-current" />}
                              {isSilver && <Medal className="w-6 h-6 text-gray-400 fill-current" />}
                              {isBronze && <Medal className="w-6 h-6 text-amber-600 fill-current" />}
                              {!isGold && !isSilver && !isBronze && (
                                <div className="w-6 h-6 flex items-center justify-center font-bold text-text-secondary text-sm">
                                  •
                                </div>
                              )}

                              <span className={`font-extrabold text-sm md:text-base ${isUser ? "text-[#1cb0f6]" : "text-text-primary"}`}>
                                {entry.username}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-text-secondary text-sm">
                                {entry.weekly_xp} XP
                              </span>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Explanation Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Leaderboards Explain Card */}
              <div className="bg-card-bg border border-card-border rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex flex-col gap-1.5 text-center md:text-left">
                    <span className="text-xs font-black text-text-secondary uppercase tracking-widest">
                      WHAT ARE LEADERBOARDS?
                    </span>
                    <h3 className="font-black text-white text-base leading-snug mt-1.5">
                      Do lessons. Earn XP. Compete.
                    </h3>
                    <p className="text-xs text-text-secondary font-bold leading-relaxed mt-2">
                      Earn XP through lessons, then compete with players in a weekly leaderboard
                    </p>
                  </div>
                  
                  {/* Gym Owl with weightlifting sweatband SVG */}
                  <svg className="w-24 h-24 select-none shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="50" cy="55" rx="35" ry="38" fill="#58cc02" />
                    <rect x="25" y="16" width="50" height="10" rx="3" fill="#ff4b4b" />
                    <rect x="35" y="18" width="30" height="6" fill="#ffffff" />
                    <ellipse cx="50" cy="62" rx="22" ry="24" fill="#84d800" />
                    <circle cx="36" cy="38" r="14" fill="#ffffff" />
                    <circle cx="64" cy="38" r="14" fill="#ffffff" />
                    <circle cx="38" cy="38" r="6" fill="#1f2d3d" />
                    <circle cx="62" cy="38" r="6" fill="#1f2d3d" />
                    <polygon points="50,44 44,54 56,54" fill="#f7b500" />
                    <path d="M15,45 C10,35 5,30 10,25 C15,22 18,35 18,45" fill="#58cc02" />
                    <rect x="2" y="20" width="12" height="6" rx="1" fill="#4a5f6b" />
                    <rect x="7" y="15" width="2" height="16" fill="#afbbbf" />
                    <path d="M85,45 C90,35 95,30 90,25 C85,22 82,35 82,45" fill="#58cc02" />
                    <rect x="86" y="20" width="12" height="6" rx="1" fill="#4a5f6b" />
                    <rect x="91" y="15" width="2" height="16" fill="#afbbbf" />
                    <circle cx="40" cy="92" r="5" fill="#f7b500" />
                    <circle cx="60" cy="92" r="5" fill="#f7b500" />
                  </svg>
                </div>
              </div>

              {!isLocked && (
                <div className="bg-blue-950/20 border border-blue-900/30 rounded-2xl p-4 flex gap-3 text-blue-400">
                  <Medal className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-bold leading-relaxed">
                    Top 3 finishers in each league advance to the next tier, unlocking exclusive profile tags and badges! Compete daily to stay on top.
                  </p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
