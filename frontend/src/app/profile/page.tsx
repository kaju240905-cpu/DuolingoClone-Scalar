"use client";

import Sidebar from "@/components/Sidebar";
import StatsHeader from "@/components/StatsHeader";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { User, Calendar, Flame, Zap, Award, BookOpen, RefreshCw, Edit2, Shield, Medal, Search, Plus, Mail, ArrowRight, X, UserPlus, UserMinus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/store/useStore";

export default function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: api.getUserProfile,
  });

  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: api.getAchievements,
  });

  const { following, toggleFollow } = useStore();
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following");
  const [isFindFriendsOpen, setIsFindFriendsOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInviteCopy = () => {
    if (typeof window !== "undefined") {
      const inviteUrl = `${window.location.origin}/profile/${user?.username || "learner"}`;
      navigator.clipboard.writeText(inviteUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Map achievements for rendering
  const wildfire = achievements?.find(a => a.name === "Wildfire") || { progress: 0, requirement_value: 3 };
  const sage = achievements?.find(a => a.name === "Sage") || { progress: 0, requirement_value: 100 };
  const fastLearner = achievements?.find(a => a.icon_name === "check-circle") || { progress: 0, requirement_value: 3 };

  // Mock list of all database users for find friends
  const allUsers = [
    { username: "DuoOwl", xp: 350, joined: "Joined March 2025" },
    { username: "Zari", xp: 280, joined: "Joined Sept 2025" },
    { username: "Lily", xp: 210, joined: "Joined Jan 2026" },
    { username: "Oscar", xp: 180, joined: "Joined Feb 2026" },
    { username: "Junior", xp: 120, joined: "Joined April 2026" },
    { username: "Eddy", xp: 90, joined: "Joined May 2026" },
    { username: "Lucy", xp: 75, joined: "Joined June 2026" }
  ];

  // Mock followers (fixed list of friends that follow us)
  const mockFollowers = [
    { username: "Zari", xp: 280, joined: "Joined Sept 2025" },
    { username: "Lily", xp: 210, joined: "Joined Jan 2026" }
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col min-h-screen bg-background">
        <StatsHeader />

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {isLoading || !user ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Left Column (Profile & Stats) */}
              <div className="lg:col-span-3 flex flex-col gap-8">
                
                {/* Header Avatar Container */}
                <div className="border-2 border-card-border rounded-3xl p-6 bg-card-bg relative flex flex-col gap-6 text-left shadow-sm">
                  {/* Edit Pencil Icon Button */}
                  <button className="absolute top-5 right-5 p-2 bg-[#202f36] hover:bg-[#202f36]/80 text-[#1cb0f6] border border-card-border rounded-xl transition-all cursor-pointer shadow-sm">
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Dashed Person Silhouette Avatar */}
                    <div className="w-28 h-28 border-4 border-dashed border-sidebar-border bg-sidebar-border/30 rounded-full flex items-center justify-center relative shrink-0">
                      <svg className="w-16 h-16 text-text-secondary opacity-60" viewBox="0 0 100 100" fill="currentColor">
                        <circle cx="50" cy="35" r="20" />
                        <path d="M50,60 C25,60 10,75 10,90 L90,90 C90,75 75,60 50,60 Z" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Plus className="w-6 h-6 text-[#1cb0f6] font-bold" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h1 className="text-2xl font-black text-text-primary tracking-wide">
                        {user.username}
                      </h1>
                      <p className="text-sm font-bold text-text-secondary mt-0.5">
                        @{user.username.toLowerCase()}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs font-bold text-text-secondary mt-3">
                        <Calendar className="w-4 h-4" />
                        <span>Joined July 2026</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-black text-text-secondary mt-2.5">
                        <span onClick={() => setActiveTab("following")} className="hover:underline cursor-pointer">{following.length} Following</span>
                        <span onClick={() => setActiveTab("followers")} className="hover:underline cursor-pointer">2 Followers</span>
                      </div>
                    </div>
                    
                    {/* Language Flag (Spanish) */}
                    <div className="absolute bottom-5 right-5 flex items-center gap-1 bg-[#202f36] border border-card-border rounded-xl px-2.5 py-1">
                      <span className="text-lg">🇪🇸</span>
                    </div>
                  </div>
                </div>

                {/* Statistics Grid Section */}
                <div className="flex flex-col gap-4 text-left">
                  <h3 className="text-xl font-black text-text-primary tracking-wide">Statistics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Day Streak */}
                    <div className="border-2 border-card-border rounded-2xl p-4 flex items-center gap-3.5 bg-card-bg shadow-sm">
                      <Flame className="w-8 h-8 text-orange-500 fill-current" />
                      <div>
                        <h4 className="text-lg font-black text-text-primary">{user.streak}</h4>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Day Streak</p>
                      </div>
                    </div>

                    {/* Total XP */}
                    <div className="border-2 border-card-border rounded-2xl p-4 flex items-center gap-3.5 bg-card-bg shadow-sm">
                      <Zap className="w-8 h-8 text-yellow-500 fill-current" />
                      <div>
                        <h4 className="text-lg font-black text-text-primary">{user.xp}</h4>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Total XP</p>
                      </div>
                    </div>

                    {/* Current League */}
                    <div className="border-2 border-card-border rounded-2xl p-4 flex items-center gap-3.5 bg-card-bg shadow-sm">
                      <Shield className="w-8 h-8 text-[#1cb0f6]" />
                      <div>
                        <h4 className="text-lg font-black text-text-primary">
                          {fastLearner.progress >= 3 ? "Bronze League" : "None"}
                        </h4>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Current League</p>
                      </div>
                    </div>

                    {/* Top 3 Finishes */}
                    <div className="border-2 border-card-border rounded-2xl p-4 flex items-center gap-3.5 bg-card-bg shadow-sm">
                      <Medal className="w-8 h-8 text-amber-600 fill-current" />
                      <div>
                        <h4 className="text-lg font-black text-text-primary">0</h4>
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Top 3 finishes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievements Section */}
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-text-primary tracking-wide">Achievements</h3>
                    <Link href="/achievements">
                      <span className="text-xs font-extrabold text-[#1cb0f6] uppercase tracking-wider hover:underline">
                        VIEW ALL
                      </span>
                    </Link>
                  </div>

                  <div className="border-2 border-card-border rounded-3xl bg-card-bg shadow-sm divide-y divide-card-border overflow-hidden">
                    
                    {/* Wildfire */}
                    <div className="p-5 flex gap-4">
                      {/* Left Badge */}
                      <div className="w-14 h-16 bg-gradient-to-b from-rose-500 to-rose-600 rounded-b-xl rounded-t-sm flex flex-col items-center justify-between py-1.5 shrink-0 shadow">
                        <Flame className="w-7 h-7 text-white fill-current" />
                        <span className="text-[8px] font-black text-white/90 uppercase tracking-widest">LEVEL 1</span>
                      </div>
                      
                      {/* Details & Progress bar */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <h4 className="font-extrabold text-text-primary text-base">Wildfire</h4>
                          <span className="text-xs font-bold text-text-secondary">
                            {wildfire.progress} / {wildfire.requirement_value}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-sidebar-border rounded-full overflow-hidden border border-card-border mt-2 relative">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${Math.min(100, (wildfire.progress / wildfire.requirement_value) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs font-bold text-text-secondary mt-2">Reach a 3 day streak</p>
                      </div>
                    </div>

                    {/* Sage */}
                    <div className="p-5 flex gap-4">
                      {/* Left Badge */}
                      <div className="w-14 h-16 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-b-xl rounded-t-sm flex flex-col items-center justify-between py-1.5 shrink-0 shadow">
                        <Zap className="w-7 h-7 text-white fill-current" />
                        <span className="text-[8px] font-black text-white/90 uppercase tracking-widest">LEVEL 1</span>
                      </div>
                      
                      {/* Details & Progress bar */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <h4 className="font-extrabold text-text-primary text-base">Sage</h4>
                          <span className="text-xs font-bold text-text-secondary">
                            {sage.progress} / {sage.requirement_value}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-sidebar-border rounded-full overflow-hidden border border-card-border mt-2 relative">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(100, (sage.progress / sage.requirement_value) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs font-bold text-text-secondary mt-2">Earn 100 XP</p>
                      </div>
                    </div>

                    {/* Champion */}
                    <div className="p-5 flex gap-4">
                      {/* Left Badge */}
                      <div className="w-14 h-16 bg-gradient-to-b from-purple-500 to-purple-600 rounded-b-xl rounded-t-sm flex flex-col items-center justify-between py-1.5 shrink-0 shadow">
                        <Award className="w-7 h-7 text-white fill-current" />
                        <span className="text-[8px] font-black text-white/90 uppercase tracking-widest">LEVEL 1</span>
                      </div>
                      
                      {/* Details & Progress bar */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <h4 className="font-extrabold text-text-primary text-base">Champion</h4>
                          <span className="text-xs font-bold text-text-secondary">
                            {fastLearner.progress >= 3 ? "1 / 1" : "0 / 1"}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-sidebar-border rounded-full overflow-hidden border border-card-border mt-2 relative">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${fastLearner.progress >= 3 ? 100 : 0}%` }}
                          />
                        </div>
                        <p className="text-xs font-bold text-text-secondary mt-2">Unlock Leaderboards by completing 3 lessons</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Right Column (Social & Friends widgets) */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Followers / Following Tab Widget */}
                <div className="bg-card-bg border-2 border-card-border rounded-3xl overflow-hidden shadow-sm flex flex-col text-left">
                  <div className="flex border-b border-card-border">
                    <button
                      onClick={() => setActiveTab("following")}
                      className={`flex-1 text-center py-3.5 font-black text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                        activeTab === "following"
                          ? "border-[#1cb0f6] text-[#1cb0f6]"
                          : "border-transparent text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Following
                    </button>
                    <button
                      onClick={() => setActiveTab("followers")}
                      className={`flex-1 text-center py-3.5 font-black text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                        activeTab === "followers"
                          ? "border-[#1cb0f6] text-[#1cb0f6]"
                          : "border-transparent text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Followers
                    </button>
                  </div>

                  <div className="p-4 flex flex-col gap-3 min-h-[180px]">
                    {activeTab === "following" ? (
                      following.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 text-center py-6">
                          <svg className="w-48 h-24 select-none" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="60" cy="70" r="16" fill="#7847ff" />
                            <circle cx="100" cy="65" r="18" fill="#ff4b4b" />
                            <circle cx="140" cy="70" r="16" fill="#1cb0f6" />
                            <circle cx="94" cy="60" r="2" fill="#fff" /><circle cx="106" cy="60" r="2" fill="#fff" />
                            <circle cx="56" cy="67" r="2" fill="#fff" /><circle cx="64" cy="67" r="2" fill="#fff" />
                            <circle cx="136" cy="67" r="2" fill="#fff" /><circle cx="144" cy="67" r="2" fill="#fff" />
                            <path d="M 96 66 Q 100 69 104 66" stroke="#4c1e00" strokeWidth="2" fill="none" />
                            <path d="M 58 72 Q 60 74 62 72" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                            <path d="M 138 72 Q 140 74 142 72" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                          </svg>
                          <p className="text-xs font-bold text-text-secondary leading-relaxed max-w-xs px-4">
                            Learning is more fun and effective when you connect with others. Find some friends!
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col divide-y divide-card-border">
                          {following.map((username) => {
                            const u = allUsers.find(item => item.username === username) || { username, xp: 100, joined: "Joined recently" };
                            return (
                              <div key={username} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-black text-white text-sm">
                                    {username[0]}
                                  </div>
                                  <div>
                                    <p className="text-sm font-extrabold text-text-primary">{username}</p>
                                    <p className="text-[10px] font-bold text-text-secondary">{u.xp} XP • {u.joined}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleFollow(username)}
                                  className="px-3 py-1.5 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl font-bold text-xs uppercase tracking-wide cursor-pointer transition-all"
                                >
                                  Unfollow
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col divide-y divide-card-border">
                        {mockFollowers.map((follower) => {
                          const isFollowingBack = following.includes(follower.username);
                          return (
                            <div key={follower.username} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center font-black text-white text-sm">
                                  {follower.username[0]}
                                  </div>
                                <div>
                                  <p className="text-sm font-extrabold text-text-primary">{follower.username}</p>
                                  <p className="text-[10px] font-bold text-text-secondary">{follower.xp} XP • {follower.joined}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleFollow(follower.username)}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wide cursor-pointer transition-all border ${
                                  isFollowingBack
                                    ? "bg-transparent border-card-border text-text-secondary hover:bg-sidebar-border/30"
                                    : "bg-[#18272f] hover:bg-[#202f36]/40 border-[#37464f] text-[#1cb0f6]"
                                }`}
                              >
                                {isFollowingBack ? "Following" : "Follow Back"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Friends Widget */}
                <div className="bg-card-bg border-2 border-card-border rounded-2xl p-5 flex flex-col gap-4 text-left shadow-sm">
                  <h4 className="font-black text-text-primary text-base">Add friends</h4>
                  
                  <div className="flex flex-col gap-2">
                    <div
                      onClick={() => setIsFindFriendsOpen(true)}
                      className="flex justify-between items-center py-3 border-b border-card-border hover:text-[#1cb0f6] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-[#ffc800]" />
                        <span className="text-sm font-extrabold text-text-primary">Find friends</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div
                      onClick={() => setIsInviteModalOpen(true)}
                      className="flex justify-between items-center py-3 hover:text-[#1cb0f6] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-extrabold text-text-primary">Invite friends</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </div>
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
          )}
        </main>
      </div>

      {/* Find Friends Modal Popup overlay */}
      <AnimatePresence>
        {isFindFriendsOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card-bg text-foreground border-2 border-card-border rounded-3xl p-6 max-w-md w-full flex flex-col gap-6 relative shadow-2xl"
            >
              <button
                onClick={() => setIsFindFriendsOpen(false)}
                className="absolute top-5 right-5 text-text-secondary hover:text-text-primary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-left">
                <h3 className="text-xl font-black text-text-primary tracking-wide">Find Friends</h3>
                <p className="text-xs font-bold text-text-secondary mt-1">Follow other learners to track their progress and compete!</p>
              </div>

              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto divide-y divide-card-border">
                {allUsers.map((item) => {
                  const isFollowing = following.includes(item.username);
                  return (
                    <div key={item.username} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-black text-white text-sm">
                          {item.username[0]}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-text-primary">{item.username}</p>
                          <p className="text-[10px] font-bold text-text-secondary">{item.xp} XP • {item.joined}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(item.username)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wide cursor-pointer transition-all border ${
                          isFollowing
                            ? "bg-transparent border-card-border text-text-secondary hover:bg-sidebar-border/30"
                            : "bg-[#18272f] hover:bg-[#202f36]/40 border-[#37464f] text-[#1cb0f6]"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setIsFindFriendsOpen(false)}
                className="w-full bg-[#58cc02] hover:bg-emerald-400 text-white font-extrabold py-3 rounded-xl border-b-4 border-emerald-700 active:border-b-0 cursor-pointer uppercase tracking-wider text-xs"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Copy Invite Link Toast Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-[#58cc02] text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl z-50 flex items-center gap-2 border-b-4 border-emerald-700 select-none"
          >
            <span>🔗</span>
            <span>Invite link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Friends Modal Popup overlay (Duolingo style) */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#18272f] text-foreground border-2 border-card-border rounded-3xl p-8 max-w-md w-full flex flex-col gap-6 relative shadow-2xl text-center"
            >
              {/* Close Button Outside or Top Right */}
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="absolute top-5 right-5 text-text-secondary hover:text-text-primary cursor-pointer p-1 bg-[#202f36] border border-card-border rounded-full hover:scale-105 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Duo holding envelope SVG */}
              <div className="py-2">
                <svg className="w-24 h-24 select-none shrink-0 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="50" cy="55" rx="35" ry="38" fill="#58cc02" />
                  <ellipse cx="50" cy="62" rx="22" ry="24" fill="#84d800" />
                  <circle cx="36" cy="38" r="14" fill="#ffffff" />
                  <circle cx="64" cy="38" r="14" fill="#ffffff" />
                  <circle cx="38" cy="38" r="6" fill="#1f2d3d" />
                  <circle cx="62" cy="38" r="6" fill="#1f2d3d" />
                  <polygon points="50,44 44,54 56,54" fill="#f7b500" />
                  {/* Left wing holding envelope */}
                  <path d="M 15 50 C 5 50 2 38 12 34 C 18 32 20 45 20 50" fill="#58cc02" />
                  {/* Right wing waving */}
                  <path d="M 85 50 C 95 45 98 32 88 34 C 82 35 80 45 80 50" fill="#58cc02" />
                  {/* Envelope */}
                  <rect x="5" y="38" width="30" height="20" rx="2" fill="#fff59d" stroke="#f7b500" strokeWidth="2" />
                  <path d="M 5 38 L 20 48 L 35 38" stroke="#f7b500" strokeWidth="2" fill="none" />
                  <circle cx="40" cy="92" r="5" fill="#f7b500" />
                  <circle cx="60" cy="92" r="5" fill="#f7b500" />
                </svg>
              </div>

              {/* Title & Info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black text-white tracking-wide">Invite friends</h3>
                <p className="text-sm font-bold text-text-secondary leading-relaxed px-2">
                  Tell your friends it's free and fun to learn a language on Duolingo!
                </p>
              </div>

              {/* Share link textbox */}
              <div className="bg-[#131f24] border-2 border-card-border rounded-2xl p-4 flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-text-secondary truncate select-all flex-1 text-left">
                  {typeof window !== "undefined" ? `${window.location.origin}/profile/${user?.username || "learner"}` : "Loading..."}
                </span>
                <button
                  onClick={handleInviteCopy}
                  className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider hover:underline cursor-pointer shrink-0"
                >
                  COPY LINK
                </button>
              </div>

              <div className="flex flex-col gap-3 mt-2 text-left">
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                  Or share on...
                </span>
                <div className="flex gap-4">
                  <button
                    onClick={() => alert("Sharing on Facebook...")}
                    className="flex-1 py-3.5 bg-[#18272f] hover:bg-[#202f36]/40 border-2 border-card-border text-[#1cb0f6] rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm text-center"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => alert("Sharing on Twitter...")}
                    className="flex-1 py-3.5 bg-[#18272f] hover:bg-[#202f36]/40 border-2 border-card-border text-[#1cb0f6] rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm text-center"
                  >
                    Twitter
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
