"use client";

import Sidebar from "@/components/Sidebar";
import StatsHeader from "@/components/StatsHeader";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Award, Zap, Flame, CheckCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function AchievementsPage() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: api.getAchievements,
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "zap":
        return <Zap className="w-8 h-8 text-yellow-500 fill-current" />;
      case "flame":
        return <Flame className="w-8 h-8 text-orange-500 fill-current" />;
      case "check-circle":
        return <CheckCircle className="w-8 h-8 text-emerald-500 fill-current" />;
      default:
        return <Award className="w-8 h-8 text-purple-500 fill-current" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col min-h-screen max-w-4xl border-r border-sidebar-border bg-background">
        <StatsHeader />

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-xl mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-6xl select-none">🏅</span>
              <h1 className="text-3xl font-black text-text-primary tracking-wide">Achievements</h1>
              <p className="font-bold text-text-secondary">Complete challenges to earn special rewards and badges.</p>
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
              ) : (
                achievements?.map((ach, idx) => (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`border-2 rounded-2xl p-5 flex gap-4 transition-all bg-card-bg relative ${
                      ach.is_unlocked
                        ? "border-yellow-500 bg-yellow-500/5"
                        : "border-card-border"
                    }`}
                  >
                    <div className="shrink-0 flex items-center justify-center bg-background rounded-xl p-3 border-2 border-card-border">
                      {getIcon(ach.icon_name)}
                    </div>

                    <div className="flex-1 flex flex-col gap-2 justify-center">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-extrabold text-text-primary text-base md:text-lg">
                            {ach.name}
                          </h3>
                          <p className="text-sm font-bold text-text-secondary mt-0.5">
                            {ach.description}
                          </p>
                        </div>
                        {ach.is_unlocked && (
                          <span className="bg-yellow-400 text-yellow-900 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                            Unlocked
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex justify-between text-xs font-bold text-text-secondary">
                          <span>Progress</span>
                          <span>{ach.progress} / {ach.requirement_value}</span>
                        </div>
                        <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-card-border">
                          <div
                            className="h-full bg-[#58cc02] rounded-full"
                            style={{ width: `${(ach.progress / ach.requirement_value) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
