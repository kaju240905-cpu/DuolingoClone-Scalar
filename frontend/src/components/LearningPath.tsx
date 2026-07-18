"use client";

import { useQuery } from "@tanstack/react-query";
import { api, Course, Skill } from "../services/api";
import { Star, Check, Play, Lock, BookOpen, Gift, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function LearningPath() {
  const { data: course, isLoading, error } = useQuery<Course>({
    queryKey: ["learningPath"],
    queryFn: api.getLearningPath,
  });

  const [activeSkillId, setActiveSkillId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-10 gap-8 max-w-2xl mx-auto w-full">
        {[1, 2].map((i) => (
          <div key={i} className="w-full bg-[#18272f] border border-[#202f36] rounded-3xl p-6 animate-pulse flex flex-col gap-4">
            <div className="h-6 w-1/3 bg-[#202f36] rounded" />
            <div className="h-4 w-2/3 bg-[#202f36] rounded" />
            <div className="flex justify-center gap-6 mt-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="w-20 h-20 bg-[#202f36] rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-gray-500 font-bold">Failed to load learning path.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  // Flatten all skills to compute locked status based on previous skills
  const allSkills: Skill[] = course.units.flatMap((u) => u.skills);

  // Define offset levels for snake layout
  const snakeOffsets = [0, -20, -40, -20, 0, 20, 40, 20];

  const bannerColors = [
    "bg-[#58cc02] border-[#46a302]", // green
    "bg-[#c33df5] border-[#9c2bc4]", // purple
    "bg-[#1cb0f6] border-[#1899d6]", // blue
  ];

  return (
    <div className="flex flex-col gap-12 max-w-2xl mx-auto py-10 px-6 w-full">
      {course.units.map((unit, uIdx) => {
        const currentBannerColor = bannerColors[uIdx % bannerColors.length];

        return (
          <section key={unit.id} className="flex flex-col gap-8">
            {/* Unit Header Banner matching Duolingo actual app */}
            <div className={`${currentBannerColor} text-white p-5 rounded-2xl flex items-center justify-between border-b-4`}>
              <div className="flex flex-col gap-1">
                <h2 className="text-xs font-black tracking-widest uppercase opacity-85">
                  Section 1, Unit {unit.order}
                </h2>
                <p className="text-lg font-black tracking-wide leading-tight">
                  {unit.title.split("-")[0].trim()}
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-transparent hover:bg-black/10 border-2 border-white/20 rounded-2xl font-black text-xs uppercase tracking-wider text-white transition-all cursor-pointer shrink-0">
                <BookOpen className="w-4 h-4 fill-current" />
                Guidebook
              </button>
            </div>

            {/* Skill Nodes List */}
            <div className="flex flex-col items-center gap-12 py-6 relative">
              {unit.skills.map((skill, sIdx) => {
                const globalIndex = uIdx * 3 + sIdx;
                const xOffset = snakeOffsets[globalIndex % snakeOffsets.length];
                const isSelected = activeSkillId === skill.id;

                // Find overall index in flat list
                const flatIndex = allSkills.findIndex((s) => s.id === skill.id);
                const isUnlocked = flatIndex === 0 || allSkills[flatIndex - 1].is_completed;
                const isActiveNode = isUnlocked && !skill.is_completed;

                // Grab the first lesson of this skill for the play button
                const firstLessonId = skill.lessons?.[0]?.id || 1;

                return (
                  <div
                    key={skill.id}
                    className="relative flex flex-col items-center"
                    style={{ transform: `translateX(${xOffset}px)` }}
                  >
                    
                    {/* Bouncing start tag above active node */}
                    {isActiveNode && (
                      <div className="absolute -top-10 bg-[#58cc02] text-white font-black text-[10px] tracking-widest px-2.5 py-1 rounded-xl shadow-lg border-2 border-[#131F24] uppercase z-10 animate-bounce">
                        START
                      </div>
                    )}

                    {/* Skill Node Button */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSkillId(isSelected ? null : skill.id)}
                      className={`w-20 h-20 rounded-full relative flex items-center justify-center cursor-pointer border-b-6 transition-all ${
                        skill.is_completed
                          ? "bg-[#ffc800] border-[#e6b400] text-background"
                          : !isUnlocked
                          ? "bg-sidebar-border border-sidebar-border text-text-secondary"
                          : "bg-[#58cc02] border-[#46a302] text-white"
                      }`}
                    >
                      {skill.is_completed ? (
                        <Check className="w-8 h-8 stroke-[4]" />
                      ) : !isUnlocked ? (
                        <Lock className="w-7 h-7 stroke-[3]" />
                      ) : (
                        <Star className="w-8 h-8 stroke-[3] fill-current" />
                      )}
                    </motion.button>

                    <span className="mt-3 font-black text-text-secondary text-xs uppercase tracking-wider">
                      {skill.name}
                    </span>

                    {/* Animated Cartoon Duo Owl next to active skill node */}
                    {isActiveNode && (
                      <div className="absolute left-24 -top-4 flex flex-col items-center gap-1 shrink-0 z-20">
                        {/* Shadow */}
                        <div className="absolute bottom-[-6px] w-12 h-2.5 bg-sidebar-border/60 rounded-full blur-[1px]" />
                        
                        {/* Owl SVG */}
                        <svg className="w-14 h-14 animate-float select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Body */}
                          <ellipse cx="50" cy="55" rx="35" ry="38" fill="#58cc02" />
                          {/* Belly */}
                          <ellipse cx="50" cy="62" rx="22" ry="24" fill="#84d800" />
                          {/* Left Eye outer */}
                          <circle cx="36" cy="38" r="14" fill="#ffffff" />
                          {/* Right Eye outer */}
                          <circle cx="64" cy="38" r="14" fill="#ffffff" />
                          {/* Left Pupil */}
                          <circle cx="36" cy="38" r="6" fill="#1f2d3d" />
                          {/* Right Pupil */}
                          <circle cx="64" cy="38" r="6" fill="#1f2d3d" />
                          {/* Beak */}
                          <polygon points="50,44 44,54 56,54" fill="#f7b500" />
                          {/* Left Wing */}
                          <path d="M15,45 C10,55 10,70 20,75 C25,70 22,55 18,48" fill="#58cc02" />
                          {/* Right Wing */}
                          <path d="M85,45 C90,55 90,70 80,75 C75,70 78,55 82,48" fill="#58cc02" />
                          {/* Feet */}
                          <circle cx="40" cy="92" r="5" fill="#f7b500" />
                          <circle cx="60" cy="92" r="5" fill="#f7b500" />
                        </svg>
                      </div>
                    )}

                    {/* Popover overlay for starting lessons or showing lock state */}
                    {isSelected && (
                      <div className="absolute z-30 bottom-24 bg-card-bg border-2 border-card-border rounded-2xl shadow-xl p-4 w-56 flex flex-col items-center gap-3 text-center animate-fade-in">
                        <div className="absolute w-3.5 h-3.5 bg-card-bg border-r-2 border-b-2 border-card-border rotate-45 -bottom-2" />
                        <div>
                          <h4 className="font-extrabold text-foreground text-sm">{skill.name}</h4>
                          <p className="text-[11px] text-text-secondary mt-0.5">{skill.description}</p>
                        </div>

                        {isUnlocked ? (
                          <>
                            <div className="w-full h-1.5 bg-sidebar-border rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#58cc02]"
                                style={{ width: skill.is_completed ? "100%" : "30%" }}
                              />
                            </div>

                            <Link href={`/lesson/${firstLessonId}`} className="w-full">
                              <button className="w-full bg-[#58cc02] hover:bg-[#62e002] text-white py-2 rounded-xl font-black text-xs border-b-4 border-[#46a302] active:border-b-0 flex items-center justify-center gap-1.5 cursor-pointer">
                                <Play className="w-3.5 h-3.5 fill-current" />
                                START (+15 XP)
                              </button>
                            </Link>
                          </>
                        ) : (
                          <div className="w-full bg-background border border-card-border rounded-xl p-2.5 flex flex-col items-center gap-1 mt-1">
                            <Lock className="w-4 h-4 text-text-secondary" />
                            <span className="text-[10px] text-text-secondary font-black uppercase">Skill Locked</span>
                            <p className="text-[9px] text-[#52656d] font-bold leading-normal">
                              Complete "{allSkills[flatIndex - 1]?.name}" to unlock this skill!
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Interspersed Chest Reward Node at the end of each unit */}
              <div className="relative flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-[#202f36] border-b-4 border-[#37464f] flex items-center justify-center cursor-pointer">
                  <Gift className="w-7 h-7 text-[#afbbbf]" />
                </div>
                <span className="mt-2 font-black text-[#52656d] text-[10px] uppercase tracking-wider">
                  Bonus Chest
                </span>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
