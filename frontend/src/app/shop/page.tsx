"use client";

import Sidebar from "@/components/Sidebar";
import StatsHeader from "@/components/StatsHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useStore } from "@/store/useStore";
import { Heart, Zap, Shield, Sparkles, Gem, RefreshCw, Snowflake, HelpCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function ShopPage() {
  const queryClient = useQueryClient();
  const { user, setUser, gems, setGems, streakFreezes, setStreakFreezes } = useStore();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: api.getUserProfile,
  });

  const { data: dailyGoal } = useQuery({
    queryKey: ["dailyGoal"],
    queryFn: api.getDailyGoal,
  });

  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: api.getAchievements,
  });

  const completedLessons = achievements?.find((a) => a.icon_name === "check-circle")?.progress ?? 0;
  const isLeaderboardLocked = completedLessons < 3;

  const refillHeartsMutation = useMutation({
    mutationFn: api.refillHearts,
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(["profile"], data);
      setGems(Math.max(0, gems - 350));
      alert("Hearts refilled successfully!");
    },
    onError: () => {
      alert("Refill failed. Please check your connection.");
    }
  });

  const handleRefillHearts = () => {
    const activeHearts = user?.hearts ?? profile?.hearts ?? 5;
    const activeMax = user?.max_hearts ?? profile?.max_hearts ?? 5;
    if (activeHearts >= activeMax) {
      alert("Your hearts are already full!");
      return;
    }
    if (gems < 350) {
      alert("You do not have enough gems!");
      return;
    }
    refillHeartsMutation.mutate();
  };

  const handleBuyStreakFreeze = () => {
    if (streakFreezes >= 2) {
      alert("You have equipped the maximum limit of Streak Freezes (2/2)!");
      return;
    }
    if (gems < 200) {
      alert("You do not have enough gems!");
      return;
    }
    setStreakFreezes(streakFreezes + 1);
    setGems(gems - 200);
    alert("Streak Freeze equipped!");
  };

  const activeHearts = user?.hearts ?? profile?.hearts ?? 5;
  const activeMax = user?.max_hearts ?? profile?.max_hearts ?? 5;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col min-h-screen bg-background">
        <StatsHeader />

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Main Column */}
            <div className="lg:col-span-3 flex flex-col gap-8">
              
              {/* Promotion Banner */}
              <div className="bg-gradient-to-r from-[#3b0066] via-[#6a0dad] to-[#8a2be2] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border border-purple-900/30 overflow-hidden relative">
                <div className="flex-1 flex flex-col gap-2 z-10 text-left">
                  <h2 className="text-2xl font-black text-white tracking-wide">Start a family plan!</h2>
                  <p className="font-bold text-purple-200 text-sm leading-relaxed max-w-sm">
                    Save on <span className="text-yellow-400 font-extrabold">Super Duolingo</span> when you learn with friends.
                  </p>
                  <button className="mt-4 w-fit px-6 py-3 bg-white hover:bg-purple-100 text-[#6a0dad] rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md">
                    LEARN MORE
                  </button>
                </div>
                
                {/* Custom Mascot Characters Vector Group */}
                <div className="shrink-0 flex items-center justify-center relative w-40 h-40">
                  <div className="absolute w-36 h-36 bg-purple-500/20 rounded-full blur-xl" />
                  <svg className="w-36 h-36 select-none relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Character 1 (Blue) */}
                    <circle cx="25" cy="45" r="16" fill="#1cb0f6" />
                    <rect x="18" y="25" width="14" height="12" rx="3" fill="#ff4b4b" />
                    <circle cx="21" cy="45" r="3" fill="#ffffff" />
                    <circle cx="29" cy="45" r="3" fill="#ffffff" />
                    <circle cx="21" cy="45" r="1" fill="#000" />
                    <circle cx="29" cy="45" r="1" fill="#000" />
                    <path d="M 22 51 Q 25 54 28 51" stroke="#ffffff" strokeWidth="2" fill="none" />
                    
                    {/* Character 2 (Orange/Yellow Center) */}
                    <circle cx="50" cy="55" r="22" fill="#ff9600" />
                    <ellipse cx="50" cy="50" rx="14" ry="12" fill="#ffe082" />
                    <circle cx="43" cy="48" r="4" fill="#ffffff" />
                    <circle cx="57" cy="48" r="4" fill="#ffffff" />
                    <circle cx="43" cy="48" r="1.5" fill="#000" />
                    <circle cx="57" cy="48" r="1.5" fill="#000" />
                    <path d="M 46 56 Q 50 60 54 56" stroke="#4c1e00" strokeWidth="2.5" fill="none" />
                    
                    {/* Character 3 (Purple/Cyan Right) */}
                    <circle cx="75" cy="48" r="16" fill="#7847ff" />
                    <circle cx="71" cy="46" r="3" fill="#ffffff" />
                    <circle cx="79" cy="46" r="3" fill="#ffffff" />
                    <circle cx="71" cy="46" r="1" fill="#000" />
                    <circle cx="79" cy="46" r="1" fill="#000" />
                    <path d="M 72 52 Q 75 55 78 52" stroke="#ffffff" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>

              {/* Hearts Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-black text-text-primary tracking-wide text-left">Hearts</h3>
                
                <div className="flex flex-col gap-3">
                  
                  {/* Refill Hearts */}
                  <div className="border-2 border-card-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card-bg shadow-sm hover:border-sidebar-border transition-all">
                    <div className="flex items-start gap-4 text-left">
                      <div className="bg-rose-950/20 text-rose-500 rounded-2xl p-4 border-2 border-rose-900/30 flex items-center justify-center shrink-0">
                        <Heart className="w-8 h-8 fill-current text-rose-500" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-text-primary text-lg">Refill Hearts</h4>
                        <p className="text-sm font-bold text-text-secondary mt-1 leading-normal max-w-md">
                          Get full hearts so you can worry less about making mistakes in a lesson
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRefillHearts}
                      disabled={activeHearts >= activeMax}
                      className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 border-2 transition-all cursor-pointer shrink-0 ${
                        activeHearts >= activeMax
                          ? "bg-transparent border-card-border text-text-secondary cursor-not-allowed"
                          : "bg-[#18272f] hover:bg-[#202f36]/40 border-[#37464f] text-[#1cb0f6]"
                      }`}
                    >
                      {activeHearts >= activeMax ? (
                        "FULL"
                      ) : (
                        <>
                          GET FOR:
                          <Gem className="w-4 h-4 fill-current text-[#1cb0f6]" />
                          350
                        </>
                      )}
                    </button>
                  </div>

                  {/* Unlimited Hearts */}
                  <div className="border-2 border-card-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card-bg shadow-sm hover:border-sidebar-border transition-all">
                    <div className="flex items-start gap-4 text-left">
                      <div className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 text-indigo-400 rounded-2xl p-4 border-2 border-indigo-900/30 flex items-center justify-center shrink-0 relative">
                        <Heart className="w-8 h-8 fill-current text-indigo-400" />
                        <span className="absolute text-[10px] font-black text-white bottom-3">∞</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-text-primary text-lg">Unlimited Hearts</h4>
                        <p className="text-sm font-bold text-text-secondary mt-1 leading-normal max-w-md">
                          Never run out of hearts with Super! Practice continuously without interruptions.
                        </p>
                      </div>
                    </div>
                    <button className="px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white border-b-4 border-purple-700 active:border-b-0 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0">
                      FREE TRIAL
                    </button>
                  </div>

                </div>
              </div>

              {/* Power-Ups Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-black text-text-primary tracking-wide text-left">Power-Ups</h3>
                
                {/* Streak Freeze */}
                <div className="border-2 border-card-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card-bg shadow-sm hover:border-sidebar-border transition-all">
                  <div className="flex items-start gap-4 text-left">
                    <div className="bg-blue-950/20 text-blue-400 rounded-2xl p-4 border-2 border-blue-900/30 flex items-center justify-center shrink-0">
                      <Snowflake className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-extrabold text-text-primary text-lg">Streak Freeze</h4>
                        <span className="bg-[#202f36] text-text-secondary px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                          {streakFreezes} / 2 EQUIPPED
                        </span>
                      </div>
                      <p className="text-sm font-bold text-text-secondary mt-1 leading-normal max-w-md">
                        Streak Freeze allows your streak to remain in place for one full day of inactivity.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleBuyStreakFreeze}
                    disabled={streakFreezes >= 2}
                    className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 border-2 transition-all cursor-pointer shrink-0 ${
                      streakFreezes >= 2
                        ? "bg-transparent border-card-border text-text-secondary cursor-not-allowed"
                        : "bg-[#18272f] hover:bg-[#202f36]/40 border-[#37464f] text-[#1cb0f6]"
                    }`}
                  >
                    {streakFreezes >= 2 ? (
                      "MAX EQUIPPED"
                    ) : (
                      <>
                        GET FOR:
                        <Gem className="w-4 h-4 fill-current text-[#1cb0f6]" />
                        200
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Right Widgets Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Unlock Leaderboards Widget */}
              <div className="bg-card-bg border-2 border-card-border rounded-2xl p-5 flex flex-col gap-4">
                <h4 className="font-black text-text-primary text-base text-left">
                  {isLeaderboardLocked ? "Unlock Leaderboards!" : "Weekly League Status"}
                </h4>
                
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-14 bg-gradient-to-br from-amber-700 to-amber-900 border-2 border-amber-600 rounded-b-xl rounded-t-sm flex items-center justify-center text-xl shrink-0">
                    🛡️
                  </div>
                  <div>
                    {isLeaderboardLocked ? (
                      <>
                        <p className="text-xs font-bold text-text-secondary leading-normal">
                          Complete {Math.max(0, 3 - completedLessons)} more lessons to start competing in weekly leagues!
                        </p>
                        <Link href="/">
                          <span className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider mt-1.5 flex items-center gap-1 hover:underline cursor-pointer">
                            Start Lesson <ArrowRight className="w-3 h-3" />
                          </span>
                        </Link>
                      </>
                    ) : (
                      <p className="text-xs font-bold text-text-secondary leading-normal">
                        Leaderboard is unlocked! You are currently competing in the Bronze League. Do lessons to earn XP.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Daily Quests Widget */}
              {dailyGoal && (
                <div className="bg-card-bg border-2 border-card-border rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-text-primary text-base">Daily Quests</h4>
                    <Link href="/achievements">
                      <span className="text-xs font-extrabold text-[#1cb0f6] uppercase tracking-wider hover:underline">
                        VIEW ALL
                      </span>
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-4 text-left">
                    <Zap className="w-8 h-8 text-yellow-500 fill-current shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <span className="text-xs font-black text-text-primary">Earn 10 XP</span>
                      <div className="w-full h-2.5 bg-sidebar-border rounded-full overflow-hidden border border-card-border">
                        <div
                          className="h-full bg-yellow-500 transition-all duration-300"
                          style={{ width: `${Math.min(100, (dailyGoal.current_xp / 10) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-text-secondary">
                        {dailyGoal.current_xp} / 10 XP
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Job Advertisement Widget (As requested in screenshots) */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col gap-4 text-left shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    ADVERTISEMENT
                  </span>
                  <HelpCircle className="w-3.5 h-3.5 text-gray-300" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-800 leading-snug">Looking for work?</h4>
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 hover:text-blue-500 transition-colors cursor-pointer group">
                      <span className="text-sm font-bold text-gray-700 group-hover:text-blue-500">Full-Time Jobs</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 hover:text-blue-500 transition-colors cursor-pointer group">
                      <span className="text-sm font-bold text-gray-700 group-hover:text-blue-500">Part-Time Jobs</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex justify-between items-center py-2 hover:text-blue-500 transition-colors cursor-pointer group">
                      <span className="text-sm font-bold text-gray-700 group-hover:text-blue-500">Freelance Jobs</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer">
                    KNOW MORE
                  </button>
                  <button className="w-full text-center text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors mt-3 uppercase tracking-wider">
                    REMOVE ADS
                  </button>
                </div>
              </div>

              {/* Footer Links */}
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-4">
                <span className="hover:text-text-primary cursor-pointer">About</span>
                <span>•</span>
                <span className="hover:text-text-primary cursor-pointer">Blog</span>
                <span>•</span>
                <span className="hover:text-text-primary cursor-pointer">Store</span>
                <span>•</span>
                <span className="hover:text-text-primary cursor-pointer">Efficacy</span>
                <span>•</span>
                <span className="hover:text-text-primary cursor-pointer">Careers</span>
                <span>•</span>
                <span className="hover:text-text-primary cursor-pointer">Investors</span>
                <span>•</span>
                <span className="hover:text-text-primary cursor-pointer">Terms</span>
                <span>•</span>
                <span className="hover:text-text-primary cursor-pointer">Privacy</span>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
