"use client";

import Sidebar from "@/components/Sidebar";
import StatsHeader from "@/components/StatsHeader";
import LearningPath from "@/components/LearningPath";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Shield, Sparkles, Zap, Lock, HelpCircle, X, ChevronDown, Mail, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function HomePage() {
  const { isLoggedIn, setLoggedIn, setUser } = useStore();
  const [screen, setScreen] = useState<"welcome" | "languages" | "login">("welcome");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Login form state
  const [username, setUsername] = useState("learner");
  const [password, setPassword] = useState("password");
  const [loginError, setLoginError] = useState("");

  const { data: dailyGoal } = useQuery({
    queryKey: ["dailyGoal"],
    queryFn: api.getDailyGoal,
    enabled: isLoggedIn,
  });

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      // Fetch user profile to verify connection and set user profile state
      const profile = await api.getUserProfile();
      setUser(profile);
      setLoggedIn(true);
      setScreen("welcome");
    } catch (err) {
      setLoginError("Failed to sign in. Please verify your credentials.");
    }
  };

  const handleSelectLanguage = async (langName: string) => {
    // Navigate to log in screen instead of doing default login
    setScreen("login");
  };

  const languages = [
    {
      name: "Spanish",
      learners: "32.4M learners",
      color: "from-amber-400 to-red-500",
      renderFlag: () => (
        <svg className="w-16 h-12 rounded-xl shadow-md border border-gray-200" viewBox="0 0 3 2">
          <rect width="3" height="2" fill="#c60b1e" />
          <rect y="0.5" width="3" height="1" fill="#ffc400" />
          <circle cx="0.8" cy="1" r="0.18" fill="#c60b1e" />
        </svg>
      )
    },
    {
      name: "French",
      learners: "22.8M learners",
      color: "from-blue-500 to-red-500",
      renderFlag: () => (
        <svg className="w-16 h-12 rounded-xl shadow-md border border-gray-200" viewBox="0 0 3 2">
          <rect width="1" height="2" fill="#002395" />
          <rect x="1" width="1" height="2" fill="#ffffff" />
          <rect x="2" width="1" height="2" fill="#ed2939" />
        </svg>
      )
    },
    {
      name: "German",
      learners: "14.2M learners",
      color: "from-yellow-400 to-amber-700",
      renderFlag: () => (
        <svg className="w-16 h-12 rounded-xl shadow-md border border-gray-200" viewBox="0 0 3 2">
          <rect width="3" height="0.67" fill="#000000" />
          <rect y="0.67" width="3" height="0.67" fill="#dd0000" />
          <rect y="1.33" width="3" height="0.67" fill="#ffce00" />
        </svg>
      )
    },
    {
      name: "Japanese",
      learners: "18.5M learners",
      color: "from-red-400 to-rose-600",
      renderFlag: () => (
        <svg className="w-16 h-12 rounded-xl shadow-md border border-gray-200" viewBox="0 0 3 2" style={{ backgroundColor: "#ffffff" }}>
          <rect width="3" height="2" fill="#ffffff" />
          <circle cx="1.5" cy="1" r="0.55" fill="#bc002d" />
        </svg>
      )
    }
  ];

  // If already logged in, render the main learning dashboard path
  if (mounted && isLoggedIn) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Left Sidebar */}
        <Sidebar className="hidden md:flex" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen max-w-4xl border-r border-sidebar-border bg-background">
          <StatsHeader />
          <main className="flex-1 overflow-y-auto">
            <LearningPath />
          </main>
        </div>

        {/* Right Sidebar Widgets */}
        <aside className="hidden lg:flex flex-col gap-5 w-[360px] p-6 sticky top-0 h-screen overflow-y-auto bg-background">

          {/* Super Duolingo Widget */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex flex-col gap-1 z-10 pr-12">
              <span className="bg-gradient-to-r from-[#a537fd] to-[#3c4dcf] text-white text-[10px] font-black tracking-widest px-2 py-0.5 rounded w-max uppercase shadow-sm">
                SUPER
              </span>
              <h3 className="font-extrabold text-foreground text-base mt-2">Try Super for free</h3>
              <p className="text-xs text-text-secondary leading-relaxed mt-1 font-bold">
                No ads, personalized practice, and unlimited Legendary!
              </p>
            </div>

            {/* Cute Neon Owl Graphic Placeholder */}
            <div className="absolute right-3 top-4 text-5xl select-none opacity-90 animate-float">
              🦉
            </div>

            <button className="w-full bg-[#3c4dcf] hover:bg-[#4a5ceb] text-white py-3 rounded-2xl font-black text-sm tracking-wide shadow-md border-b-4 border-[#2431a1] active:border-b-0 transition-all cursor-pointer">
              TRY 1 WEEK FREE
            </button>
          </div>

          {/* Unlock Leaderboards Widget */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="font-extrabold text-foreground text-base tracking-wide">Unlock Leaderboards!</h3>
            <div className="flex items-center gap-4 bg-background border border-card-border rounded-xl p-3.5 mt-1">
              <div className="w-10 h-10 rounded-lg bg-sidebar-border flex items-center justify-center text-xl shrink-0">
                🛡️
              </div>
              <p className="text-xs text-text-secondary font-bold leading-normal">
                Complete 3 more lessons to start competing
              </p>
            </div>
          </div>

          {/* Daily Quests Widget */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-foreground text-base tracking-wide">Daily Quests</h3>
              <span className="text-xs text-[#1cb0f6] font-black tracking-wide uppercase hover:underline cursor-pointer">View All</span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="text-3xl select-none">⚡</div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-black text-foreground">
                  <span>Earn 10 XP</span>
                  <span className="text-text-secondary">{dailyGoal ? Math.min(10, dailyGoal.current_xp) : 0} / 10</span>
                </div>
                <div className="w-full h-3 bg-sidebar-border rounded-full overflow-hidden border border-card-border">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dailyGoal ? Math.min(100, (dailyGoal.current_xp / 10) * 100) : 0}%` }}
                    className="h-full bg-yellow-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <footer className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-[#52656d] font-bold uppercase tracking-wider px-2">
            <Link href="#" className="hover:text-gray-300">About</Link>
            <Link href="#" className="hover:text-gray-300">Blog</Link>
            <Link href="#" className="hover:text-gray-300">Store</Link>
            <Link href="#" className="hover:text-gray-300">Efficacy</Link>
            <Link href="#" className="hover:text-gray-300">Careers</Link>
            <Link href="#" className="hover:text-gray-300">Investors</Link>
            <Link href="#" className="hover:text-gray-300">Terms</Link>
            <Link href="#" className="hover:text-gray-300">Privacy</Link>
          </footer>

        </aside>
      </div>
    );
  }

  // Auth/Welcome screens if user is not logged in
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col relative overflow-x-hidden">

      {/* Welcome Landing Screen */}
      {screen === "welcome" && (
        <div className="flex flex-col w-full bg-white text-gray-800">
          {/* Header bar - Sticky */}
          <header className="sticky top-0 bg-white z-50 border-b border-gray-200 w-full shadow-sm">
            <div className="max-w-5xl w-full mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-[#58cc02]" viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="50" r="46" fill="#58cc02" />
                  <circle cx="50" cy="50" r="28" fill="#ffffff" />
                </svg>
                <span className="text-2xl font-black text-[#58cc02] tracking-normal select-none">duolingo</span>
              </div>

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider cursor-pointer">
                  Site Language: English <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>



          {/* Section 1: Hero Welcome Area */}
          <section className="w-full bg-white border-b border-gray-100 py-16 md:py-24 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left illustrations / Floating Items */}
              <div className="flex-1 flex justify-center relative min-h-[380px] w-full">
                {/* Floating Elements Background */}
                <div className="absolute inset-0 pointer-events-none select-none z-0">
                  {/* Floating Gold Coin 1 */}
                  <motion.div
                    animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 text-4xl"
                  >
                    🪙
                  </motion.div>
                  {/* Floating Gold Coin 2 */}
                  <motion.div
                    animate={{ y: [0, -18, 0], rotate: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-1/4 right-1/4 text-3xl"
                  >
                    🪙
                  </motion.div>
                  {/* Floating Heart */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/3 right-1/3 text-4xl"
                  >
                    ❤️
                  </motion.div>
                  {/* Floating Flame / Fire */}
                  <motion.div
                    animate={{ y: [0, -10, 0], scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/3 text-4xl"
                  >
                    🔥
                  </motion.div>
                  {/* Floating Dumbbell */}
                  <motion.div
                    animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.2 }}
                    className="absolute bottom-1/3 left-1/4 text-4xl"
                  >
                    💪
                  </motion.div>
                  {/* Floating Chest */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute bottom-1/4 left-1/2 text-4xl"
                  >
                    🧳
                  </motion.div>
                </div>

                <div className="relative z-10 w-full max-w-md flex justify-center items-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-full flex justify-center"
                  >
                    <svg className="w-full h-auto max-w-[320px] filter drop-shadow-xl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Base Phone Outline */}
                      <rect x="40" y="30" width="120" height="150" rx="16" fill="#131f24" stroke="#202f36" strokeWidth="6" />
                      <rect x="45" y="35" width="110" height="130" rx="10" fill="#202f36" />
                      {/* Phone Screen Mock Path */}
                      <rect x="50" y="42" width="100" height="110" rx="6" fill="#18272f" />
                      <rect x="60" y="52" width="80" height="6" rx="3" fill="#58cc02" />
                      
                      {/* Cute Owl popping out */}
                      <circle cx="100" cy="115" r="36" fill="#58cc02" />
                      <ellipse cx="100" cy="120" rx="24" fill="#84d800" ry="26" />
                      <circle cx="86" cy="100" r="11" fill="white" />
                      <circle cx="114" cy="100" r="11" fill="white" />
                      <circle cx="86" cy="100" r="4.5" fill="#1f2d3d" />
                      <circle cx="114" cy="100" r="4.5" fill="#1f2d3d" />
                      <polygon points="100,105 94,113 106,113" fill="#ff9600" />
                      <path d="M 68 120 C 62 118 60 108 68 109" stroke="#58cc02" strokeWidth="5" fill="none" />
                      <path d="M 132 120 C 138 118 140 108 132 109" stroke="#58cc02" strokeWidth="5" fill="none" />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Right CTAs / Hero text */}
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 flex flex-col gap-8 text-center lg:text-left max-w-lg z-10"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#58cc02] leading-tight font-sans tracking-wide">
                  learn a language with duolingo
                </h1>

                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <button
                    onClick={() => setScreen("languages")}
                    className="flex-1 bg-[#58cc02] hover:bg-[#62dc04] text-white py-4 px-8 rounded-2xl font-black text-sm tracking-widest border-b-4 border-[#4ea202] active:border-b-0 transition-all cursor-pointer shadow-md uppercase"
                  >
                    GET STARTED
                  </button>
                  <button
                    onClick={() => setScreen("login")}
                    className="flex-1 bg-white hover:bg-gray-50 text-[#1cb0f6] py-4 px-8 rounded-2xl font-black text-sm tracking-widest border-2 border-gray-200 border-b-4 active:border-b-2 transition-all cursor-pointer shadow-sm uppercase"
                  >
                    I ALREADY HAVE AN ACCOUNT
                  </button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Section 1b: Duolingo English Test */}
          <section className="w-full bg-white border-b border-gray-100 py-16 md:py-24 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left Content */}
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col gap-6 text-center lg:text-left max-w-lg"
              >
                <h2 className="text-4xl md:text-5xl font-black text-[#58cc02] leading-tight font-sans tracking-wide">
                  duolingo english test
                </h2>
                <p className="text-gray-500 font-bold text-base md:text-lg leading-relaxed font-sans">
                  Our convenient, fast, and affordable English test integrates the latest assessment science and AI — empowering anyone to accurately test their English where and when they're at their best.
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => setScreen("languages")}
                    className="bg-white hover:bg-gray-50 text-[#1cb0f6] py-4 px-8 rounded-2xl font-black text-xs md:text-sm tracking-widest border-2 border-gray-200 border-b-4 active:border-b-2 transition-all cursor-pointer shadow-sm uppercase"
                  >
                    CERTIFY YOUR ENGLISH
                  </button>
                </div>
              </motion.div>

              {/* Right Illustration */}
              <div className="flex-1 flex justify-center relative min-h-[300px] w-full">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 w-full max-w-md flex justify-center"
                >
                  <svg className="w-full h-auto max-w-[340px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Waving/holding green leaf design */}
                    <g transform="translate(10, 10)">
                      {/* Big Green Leaf Shield Shape */}
                      <path
                        d="M 100 20 C 130 10, 160 30, 170 60 C 180 90, 160 140, 100 170 C 40 140, 20 90, 30 60 C 40 30, 70 10, 100 20 Z"
                        fill="#58cc02"
                        stroke="#4ea202"
                        strokeWidth="4"
                      />
                      {/* Inner character silhouette */}
                      <ellipse cx="100" cy="100" rx="35" ry="35" fill="#ffb74d" />
                      <rect x="90" y="60" width="20" height="20" rx="4" fill="#3e2723" />
                      <circle cx="92" cy="95" r="3.5" fill="#000" />
                      <circle cx="108" cy="95" r="3.5" fill="#000" />
                      {/* Holding phone */}
                      <rect x="120" y="110" width="25" height="45" rx="5" fill="#1cb0f6" stroke="#fff" strokeWidth="2.5" />
                    </g>
                  </svg>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Section 1c: Duolingo for Schools */}
          <section className="w-full bg-white border-b border-gray-100 py-16 md:py-24 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row-reverse items-center justify-between gap-12">
              {/* Right Content */}
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col gap-6 text-center lg:text-left max-w-lg"
              >
                <h2 className="text-4xl md:text-5xl font-black text-[#58cc02] leading-tight font-sans tracking-wide">
                  duolingo for schools
                </h2>
                <p className="text-gray-500 font-bold text-base md:text-lg leading-relaxed font-sans">
                  Teachers, we're here to help you! Our free tools support your students as they learn languages through the Duolingo app, both in and out of the classroom.
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => setScreen("languages")}
                    className="bg-white hover:bg-gray-50 text-[#1cb0f6] py-4 px-8 rounded-2xl font-black text-xs md:text-sm tracking-widest border-2 border-gray-200 border-b-4 active:border-b-2 transition-all cursor-pointer shadow-sm uppercase"
                  >
                    GET YOUR CLASS STARTED
                  </button>
                </div>
              </motion.div>

              {/* Left Illustration */}
              <div className="flex-1 flex justify-center relative min-h-[300px] w-full">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 w-full max-w-md flex justify-center"
                >
                  <svg className="w-full h-auto max-w-[340px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Cute student sliding down a pencil over a phone */}
                    <g transform="translate(10, 10)">
                      {/* Green phone base */}
                      <rect x="30" y="110" width="140" height="60" rx="14" fill="#58cc02" transform="rotate(-15 100 140)" />
                      
                      {/* Giant Yellow Pencil */}
                      <path d="M 40 100 L 160 50 L 170 70 L 50 120 Z" fill="#ffd54f" />
                      {/* Pencil Tip */}
                      <polygon points="160,50 180,55 177,59" fill="#ffe082" />

                      {/* Character riding pencil */}
                      <circle cx="100" cy="55" r="16" fill="#ff8a80" />
                      <path d="M 85 55 C 85 45 115 45 115 55" fill="#3e2723" />
                      <rect x="90" y="71" width="20" height="20" rx="3" fill="#29b6f6" /> {/* backpack */}
                    </g>
                  </svg>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Section 1d: Duolingo ABC */}
          <section className="w-full bg-white border-b border-gray-100 py-16 md:py-24 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left Content */}
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col gap-6 text-center lg:text-left max-w-lg"
              >
                <h2 className="text-4xl md:text-5xl font-black text-[#58cc02] leading-tight font-sans tracking-wide">
                  duolingo abc
                </h2>
                <p className="text-gray-500 font-bold text-base md:text-lg leading-relaxed font-sans">
                  From language to literacy! With fun phonics lessons and delightful stories, Duolingo ABC helps kids ages 3-8 learn to read and write — 100% free.
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => setScreen("languages")}
                    className="bg-white hover:bg-gray-50 text-[#1cb0f6] py-4 px-8 rounded-2xl font-black text-xs md:text-sm tracking-widest border-2 border-gray-200 border-b-4 active:border-b-2 transition-all cursor-pointer shadow-sm uppercase"
                  >
                    LEARN MORE ABOUT ABC
                  </button>
                </div>
              </motion.div>

              {/* Right Illustration */}
              <div className="flex-1 flex justify-center relative min-h-[300px] w-full">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 w-full max-w-md flex justify-center"
                >
                  <svg className="w-full h-auto max-w-[340px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Alphabet blocks and children */}
                    <g transform="translate(10, 10)">
                      {/* Block A (Blue) */}
                      <rect x="30" y="100" width="40" height="40" rx="6" fill="#29b6f6" />
                      <text x="44" y="128" fill="#fff" fontSize="24" fontWeight="black" fontFamily="sans-serif">A</text>

                      {/* Block B (Yellow) */}
                      <rect x="75" y="120" width="40" height="40" rx="6" fill="#ffca28" />
                      <text x="89" y="148" fill="#fff" fontSize="24" fontWeight="black" fontFamily="sans-serif">B</text>

                      {/* Block C (Green) */}
                      <rect x="120" y="90" width="40" height="40" rx="6" fill="#66bb6a" />
                      <text x="134" y="118" fill="#fff" fontSize="24" fontWeight="black" fontFamily="sans-serif">C</text>

                      {/* Little character peeking */}
                      <circle cx="140" cy="70" r="12" fill="#ffe082" />
                      <path d="M 132 64 C 136 64, 144 64, 148 64" fill="#ab47bc" />
                    </g>
                  </svg>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Sub-header Bar (Languages) */}
          <div className="border-b border-gray-200 py-3.5 bg-white w-full hidden md:block overflow-hidden shadow-sm">
            <div className="max-w-5xl mx-auto px-6 flex items-center justify-between gap-4">
              <button className="text-gray-400 hover:text-gray-600 font-extrabold text-sm shrink-0">&lt;</button>
              <div className="flex-1 flex items-center justify-around overflow-x-auto no-scrollbar font-black text-[11px] text-gray-400 tracking-wider">
                <span className="flex items-center gap-2 cursor-pointer hover:text-[#58cc02] transition-colors"><span className="text-lg">🇺🇸</span> ENGLISH</span>
                <span className="flex items-center gap-2 cursor-pointer hover:text-[#58cc02] transition-colors text-gray-700 font-extrabold"><span className="text-lg">🇪🇸</span> SPANISH</span>
                <span className="flex items-center gap-2 cursor-pointer hover:text-[#58cc02] transition-colors"><span className="text-lg">🇫🇷</span> FRENCH</span>
                <span className="flex items-center gap-2 cursor-pointer hover:text-[#58cc02] transition-colors"><span className="text-lg">🇩🇪</span> GERMAN</span>
                <span className="flex items-center gap-2 cursor-pointer hover:text-[#58cc02] transition-colors"><span className="text-lg">🇮🇹</span> ITALIAN</span>
                <span className="flex items-center gap-2 cursor-pointer hover:text-[#58cc02] transition-colors"><span className="text-lg">🇧🇷</span> PORTUGUESE</span>
                <span className="flex items-center gap-2 cursor-pointer hover:text-[#58cc02] transition-colors"><span className="text-base">➕</span> MATH</span>
                <span className="flex items-center gap-2 cursor-pointer hover:text-[#58cc02] transition-colors"><span className="text-base">👑</span> CHESS</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 font-extrabold text-sm shrink-0">&gt;</button>
            </div>
          </div>

          {/* Section 2: free. fun. effective. */}
          <section className="border-b border-gray-100 py-16 md:py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
              {/* Left text */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col gap-6 text-center md:text-left"
              >
                <h2 className="text-4xl md:text-5xl font-black text-[#58cc02] leading-tight font-sans tracking-wide">
                  free. fun. effective.
                </h2>
                <p className="text-gray-500 font-bold text-base md:text-lg leading-relaxed">
                  Learning with Duolingo is fun, and <span className="text-[#1cb0f6] hover:underline cursor-pointer">research shows that it works</span>! With quick, bite-sized lessons, you'll earn points and unlock new levels while gaining real-world communication skills.
                </p>
              </motion.div>

              {/* Right phone mockup & character */}
              <div className="flex-1 flex items-center justify-center relative w-full max-w-md min-h-[380px]">
                {/* Phone mockup */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="w-[220px] h-[400px] bg-white border-[6px] border-gray-200 rounded-[32px] shadow-2xl relative p-4 flex flex-col gap-4 overflow-hidden"
                >
                  <div className="flex justify-between items-center px-1">
                    <span className="w-10 h-2 bg-gray-200 rounded-full" />
                    <span className="w-3 h-2 bg-gray-200 rounded-full" />
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                    <div className="w-2/3 h-full bg-[#58cc02]" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 flex-1">
                    <motion.div whileHover={{ scale: 1.12, rotate: 2 }} whileTap={{ scale: 0.95 }} className="border-2 border-gray-100 rounded-2xl p-2 flex flex-col items-center justify-center bg-sky-50/20 text-3xl cursor-pointer">🐱</motion.div>
                    <motion.div whileHover={{ scale: 1.12, rotate: -2 }} whileTap={{ scale: 0.95 }} className="border-2 border-green-200 rounded-2xl p-2 flex flex-col items-center justify-center bg-green-50/20 text-3xl cursor-pointer">🦉</motion.div>
                    <motion.div whileHover={{ scale: 1.12, rotate: 2 }} whileTap={{ scale: 0.95 }} className="border-2 border-gray-100 rounded-2xl p-2 flex flex-col items-center justify-center bg-orange-50/20 text-3xl cursor-pointer">👩</motion.div>
                    <motion.div whileHover={{ scale: 1.12, rotate: -2 }} whileTap={{ scale: 0.95 }} className="border-2 border-gray-100 rounded-2xl p-2 flex flex-col items-center justify-center bg-purple-50/20 text-3xl cursor-pointer">👨</motion.div>
                  </div>
                </motion.div>

                {/* Standing character next to phone */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute right-0 bottom-4 w-[140px] h-[160px] bg-white border-2 border-gray-100 rounded-2xl shadow-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="text-4xl">👨🏻</div>
                  <div className="bg-[#ffc800] text-white font-black text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wide">
                    #1 Rank
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Section 3: backed by science */}
          <section className="border-b border-gray-100 py-16 md:py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-16">
              {/* Text */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col gap-6 text-center md:text-left"
              >
                <h2 className="text-4xl md:text-5xl font-black text-[#58cc02] leading-tight font-sans tracking-wide">
                  backed by science
                </h2>
                <p className="text-gray-500 font-bold text-base md:text-lg leading-relaxed">
                  We use a combination of research-backed teaching methods and delightful content to create courses that effectively teach reading, writing, listening, and speaking skills!
                </p>
              </motion.div>

              {/* Lab / Science girl illustration */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex items-center justify-center relative w-full max-w-md min-h-[300px]"
              >
                <motion.svg
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
                  className="w-full h-full max-w-[340px]"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Lab desk */}
                  <rect x="20" y="160" width="160" height="10" rx="4" fill="#f0f0f0" />

                  {/* Microscope */}
                  <rect x="135" y="80" width="10" height="40" transform="rotate(-15 135 80)" fill="#3c4dcf" />
                  <circle cx="132" cy="120" r="8" fill="#afbbbf" />

                  {/* Science girl */}
                  <circle cx="90" cy="70" r="22" fill="#ffe082" />
                  {/* Purple hair */}
                  <path d="M 68 70 C 68 45 112 45 112 70 C 112 85 100 90 90 90 C 80 90 68 85 68 70 Z" fill="#9c27b0" />
                  <circle cx="90" cy="72" r="14" fill="#ffe082" />
                  <circle cx="85" cy="70" r="1.5" fill="#000" />
                  <circle cx="95" cy="70" r="1.5" fill="#000" />
                  {/* Beaker */}
                  <rect x="50" y="120" width="25" height="35" rx="6" fill="#e0f7fa" stroke="#00acc1" strokeWidth="2" />
                  <motion.circle
                    animate={{ cy: [142, 134, 142], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    cx="62"
                    cy="138"
                    r="6"
                    fill="#00acc1"
                  />
                </motion.svg>
              </motion.div>
            </div>
          </section>

          {/* Section 4: stay motivated */}
          <section className="border-b border-gray-100 py-16 md:py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
              {/* Text */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col gap-6 text-center md:text-left"
              >
                <h2 className="text-4xl md:text-5xl font-black text-[#58cc02] leading-tight font-sans tracking-wide">
                  stay motivated
                </h2>
                <p className="text-gray-500 font-bold text-base md:text-lg leading-relaxed">
                  We make it easy to form a habit of language learning with game-like features, fun challenges, and reminders from our friendly mascot, Duo the owl.
                </p>
              </motion.div>

              {/* Motivated runner illustration */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex items-center justify-center relative w-full max-w-md min-h-[300px]"
              >
                <motion.svg
                  animate={{ y: [0, -6, 0], x: [0, 1.5, 0] }}
                  transition={{ y: { repeat: Infinity, duration: 0.6, ease: "easeInOut" }, x: { repeat: Infinity, duration: 0.4, ease: "easeInOut" } }}
                  className="w-full h-full max-w-[340px]"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Phone pathway */}
                  <rect x="50" y="110" width="70" height="35" rx="8" fill="#e0e0e0" />
                  <rect x="80" y="130" width="70" height="35" rx="8" fill="#58cc02" />

                  {/* Runner */}
                  <circle cx="100" cy="70" r="16" fill="#ffe082" />
                  <rect x="92" y="54" width="16" height="5" fill="#ff4b4b" rx="2.5" /> {/* headband */}
                  <path d="M 85 70 C 85 60 115 60 115 70 C 115 80 100 85 100 85 Z" fill="#ffb74d" />
                  <circle cx="100" cy="71" r="12" fill="#ffe082" />
                  <circle cx="96" cy="69" r="1.5" fill="#000" />
                  <circle cx="104" cy="69" r="1.5" fill="#000" />

                  <rect x="88" y="85" width="24" height="25" rx="6" fill="#ff4b4b" />
                </motion.svg>
              </motion.div>
            </div>
          </section>

          {/* Section 5: personalized learning */}
          <section className="border-b border-gray-100 py-16 md:py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
              {/* Overlapping Phones Illustration */}
              <div className="flex-1 flex items-center justify-center relative w-full max-w-md min-h-[300px]">
                <div className="relative w-full h-[280px] flex items-center justify-center">
                  {/* Left Phone: Scooter Rider */}
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [-12, -10, -12] }}
                    transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
                    whileHover={{ scale: 1.05 }}
                    className="absolute left-[10%] bottom-4 w-[160px] h-[240px] bg-white border-4 border-orange-400 rounded-3xl shadow-xl rotate-[-12deg] flex flex-col items-center justify-center p-3 overflow-hidden cursor-pointer"
                  >
                    <div className="text-5xl animate-bounce">🛵</div>
                    <div className="text-3xl mt-2">👨‍💼</div>
                    <span className="text-[10px] font-black text-orange-400 uppercase mt-2">Level 3</span>
                  </motion.div>

                  {/* Right Phone: Turban Character with Flowers */}
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [8, 10, 8] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    className="absolute right-[10%] top-4 w-[160px] h-[240px] bg-white border-4 border-blue-400 rounded-3xl shadow-xl rotate-[8deg] flex flex-col items-center justify-center p-3 overflow-hidden cursor-pointer"
                  >
                    <div className="text-5xl">👳🏾‍♂️</div>
                    <div className="flex gap-2 text-xl mt-2">🌸🌺</div>
                    <span className="text-[10px] font-black text-blue-400 uppercase mt-2">Personalized</span>
                  </motion.div>
                </div>
              </div>

              {/* Text */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col gap-6 text-center md:text-left"
              >
                <h2 className="text-4xl md:text-5xl font-black text-[#58cc02] leading-tight font-sans tracking-wide">
                  personalized learning
                </h2>
                <p className="text-gray-500 font-bold text-base md:text-lg leading-relaxed">
                  Combining the best of AI and language science, lessons are tailored to help you learn at just the right level and pace.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Section 6: learn anytime, anywhere */}
          <section className="py-20 md:py-28 bg-[#ddf4ff] relative overflow-hidden">
            {/* Floating elements backdrop */}
            <div className="absolute inset-0 opacity-15 pointer-events-none select-none text-4xl">
              <motion.span animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute top-[10%] left-[10%]">💎</motion.span>
              <motion.span animate={{ y: [0, -22, 0], rotate: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }} className="absolute top-[20%] right-[15%]">👑</motion.span>
              <motion.span animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }} className="absolute bottom-[20%] left-[20%]">🔥</motion.span>
              <motion.span animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.2 }} className="absolute bottom-[10%] right-[10%]">🧳</motion.span>
              <motion.span animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.8 }} className="absolute top-[50%] left-[5%]">📱</motion.span>
            </div>

            <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-8 relative z-10">
              {/* Title */}
              <motion.h2
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-black text-[#042c5c] leading-tight font-sans tracking-wide"
              >
                learn anytime, anywhere
              </motion.h2>

              {/* App Download Badges */}
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {/* App Store */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="bg-white hover:bg-gray-50 text-gray-800 px-5 py-2.5 rounded-2xl border-2 border-gray-200 shadow-sm flex items-center gap-3 transition-all"
                >
                  <span className="text-2xl">🍎</span>
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Download on the</p>
                    <p className="text-xs font-black">App Store</p>
                  </div>
                </motion.a>
                {/* Google Play */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="bg-white hover:bg-gray-50 text-gray-800 px-5 py-2.5 rounded-2xl border-2 border-gray-200 shadow-sm flex items-center gap-3 transition-all"
                >
                  <span className="text-2xl">🤖</span>
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Get it on</p>
                    <p className="text-xs font-black">Google Play</p>
                  </div>
                </motion.a>
              </div>

              {/* Cute character graphic */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-4 bg-white/60 backdrop-blur-sm border border-white/40 rounded-3xl p-4 mt-4 max-w-sm"
              >
                <span className="text-5xl">🐻</span>
                <p className="text-xs font-bold text-[#042c5c] text-left">
                  "Take Duolingo with you! Get quick lessons on your commute, at lunch, or before bed."
                </p>
              </motion.div>
            </div>
          </section>

          {/* Section 7: power up with super duolingo */}
          <section className="bg-[#0a1128] py-16 md:py-24 text-white relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12">
              {/* Left Character Illustration */}
              <div className="flex-1 flex justify-center relative min-h-[220px] w-full max-w-sm">
                <div className="relative z-10 w-full flex items-center justify-center">
                  <svg className="w-full h-full max-w-[280px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Glowing neon green/blue/pink background aura */}
                    <motion.circle
                      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.45, 0.3] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      cx="100"
                      cy="100"
                      r="70"
                      fill="url(#super-glow)"
                      filter="blur(20px)"
                    />

                    {/* Neon ghost-like Duo Owl character */}
                    <motion.g
                      animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
                    >
                      <path d="M 60 70 C 60 40, 140 40, 140 70 C 140 100, 150 140, 100 160 C 50 140, 60 100, 60 70 Z" fill="url(#super-grad)" stroke="#ffffff" strokeWidth="2.5" />

                      {/* Big eyes */}
                      <circle cx="85" cy="75" r="14" fill="white" />
                      <circle cx="115" cy="75" r="14" fill="white" />
                      <circle cx="85" cy="75" r="6" fill="#1cb0f6" />
                      <circle cx="115" cy="75" r="6" fill="#1cb0f6" />

                      {/* Beak */}
                      <polygon points="100,82 94,92 106,92" fill="#ff9600" />

                      {/* Phone with infinity heart */}
                      <rect x="135" y="100" width="30" height="50" rx="6" fill="#1f2d3d" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="150" cy="125" r="8" fill="#ff4b4b" />
                    </motion.g>

                    {/* Defs for gradients */}
                    <defs>
                      <radialGradient id="super-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#00f2fe" />
                        <stop offset="50%" stopColor="#4facfe" />
                        <stop offset="100%" stopColor="#f093fb" />
                      </radialGradient>
                      <linearGradient id="super-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00f2fe" />
                        <stop offset="50%" stopColor="#4facfe" />
                        <stop offset="100%" stopColor="#f093fb" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Right text and button */}
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col gap-6 text-center md:text-left items-center md:items-start max-w-md"
              >
                <span className="bg-gradient-to-r from-[#00f2fe] to-[#f093fb] text-transparent bg-clip-text text-xs font-black tracking-widest uppercase">
                  SUPER DUOLINGO
                </span>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-wide uppercase leading-tight font-sans">
                  Power up with <br />
                  <span className="bg-gradient-to-r from-[#00f2fe] to-[#f093fb] text-transparent bg-clip-text">Super Duolingo</span>
                </h3>

                <button
                  onClick={() => setScreen("languages")}
                  className="bg-white hover:bg-gray-100 text-[#0a1128] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg border-b-4 border-gray-200 cursor-pointer mt-2"
                >
                  TRY 1 WEEK FREE
                </button>
              </motion.div>
            </div>
          </section>
        </div>
      )}

      {/* Choose Course Language Selection screen */}
      {screen === "languages" && (
        <div className="min-h-screen bg-white flex flex-col">
          {/* Header */}
          <header className="max-w-5xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-gray-100 shrink-0">
            <button
              onClick={() => setScreen("welcome")}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">CHOOSE A LANGUAGE</h2>
            <div className="w-10" />
          </header>

          <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10 overflow-y-auto flex flex-col items-center justify-start gap-8">
            <h1 className="text-3xl font-black text-center text-gray-800 font-sans tracking-wide">
              I want to learn...
            </h1>

            <div className="grid grid-cols-2 gap-6 w-full max-w-lg mt-4">
              {languages.map((lang) => (
                <motion.div
                  key={lang.name}
                  onClick={() => handleSelectLanguage(lang.name)}
                  whileHover={{ scale: 1.05, translateY: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4 cursor-pointer transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-center p-1 bg-white rounded-2xl">
                    {lang.renderFlag()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-800 text-base leading-normal">{lang.name}</h3>
                    <p className="text-[11px] font-bold text-gray-400 mt-1">{lang.learners}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* Log In Overlay/Screen */}
      {screen === "login" && (
        <div className="min-h-screen bg-[#18272f] text-foreground flex items-center justify-center p-6 relative">
          {/* Close button in top-left */}
          <button
            onClick={() => setScreen("welcome")}
            className="absolute top-6 left-6 p-2 text-text-secondary hover:text-text-primary hover:bg-[#202f36]/40 border border-card-border rounded-full cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* SIGN UP button in top-right */}
          <button
            onClick={() => setScreen("languages")}
            className="absolute top-6 right-6 px-4 py-2 border-2 border-card-border hover:bg-[#202f36]/40 text-[#1cb0f6] rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer transition-all"
          >
            SIGN UP
          </button>

          {/* Login Form Card */}
          <div className="max-w-sm w-full flex flex-col gap-6 text-center">
            <h2 className="text-2xl font-black text-white tracking-wide">Log in</h2>

            <form onSubmit={handleLogIn} className="flex flex-col gap-4">
              {loginError && (
                <p className="text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl py-2 px-3 text-left">
                  {loginError}
                </p>
              )}

              {/* Username Input */}
              <div className="bg-[#131f24] border-2 border-card-border rounded-xl p-3 flex items-center gap-3">
                <Mail className="w-5 h-5 text-text-secondary shrink-0" />
                <input
                  type="text"
                  placeholder="Email or username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent border-0 outline-none text-white text-sm w-full placeholder-text-secondary font-bold"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="bg-[#131f24] border-2 border-card-border rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full">
                  <Key className="w-5 h-5 text-text-secondary shrink-0" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-0 outline-none text-white text-sm w-full placeholder-text-secondary font-bold"
                    required
                  />
                </div>
                <span className="text-[10px] font-black text-text-secondary hover:text-text-primary cursor-pointer tracking-wider shrink-0">
                  FORGOT?
                </span>
              </div>

              {/* Submit Log In */}
              <button
                type="submit"
                className="w-full py-4 bg-[#1cb0f6] hover:bg-[#2fc0ff] text-white border-b-4 border-[#1291cd] active:border-b-0 rounded-2xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer mt-2"
              >
                LOG IN
              </button>
            </form>

            {/* Separator line */}
            <div className="relative flex items-center justify-center my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-card-border" />
              </div>
              <span className="relative bg-[#18272f] px-3 text-[10px] font-black text-text-secondary tracking-widest">OR</span>
            </div>

            {/* Social Logins */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setLoginError("Social login is disabled. Please log in with username/password.");
                }}
                className="flex-1 py-3.5 bg-[#18272f] hover:bg-[#202f36]/40 border-2 border-card-border text-[#1cb0f6] rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="text-sm">G</span> Google
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginError("Social login is disabled. Please log in with username/password.");
                }}
                className="flex-1 py-3.5 bg-[#18272f] hover:bg-[#202f36]/40 border-2 border-card-border text-[#1cb0f6] rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="text-sm">f</span> Facebook
              </button>
            </div>

            <p className="text-[10px] font-bold text-text-secondary leading-relaxed px-4 mt-2">
              By signing in to Duolingo, you agree to our <span className="underline cursor-pointer hover:text-white">Terms</span> and <span className="underline cursor-pointer hover:text-white">Privacy Policy</span>.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
