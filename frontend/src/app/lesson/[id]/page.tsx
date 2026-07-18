"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { X, Heart, AlertTriangle, CheckCircle, ArrowRight, Zap, RefreshCw, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const lessonId = parseInt(params.id as string);

  const {
    currentLesson,
    currentExerciseIndex,
    selectedOptions,
    lessonHearts,
    lessonXP,
    checked,
    isCorrect,
    correctAnswer,
    isLessonCompleted,
    heartsLost,
    startLesson,
    selectOption,
    deselectOption,
    submitCurrentExercise,
    nextExercise,
    resetLesson
  } = useStore();

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => api.getLesson(lessonId),
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: api.getUserProfile
  });

  // Load lesson into state using profile hearts
  useEffect(() => {
    if (lesson && profile) {
      startLesson(lesson, profile.hearts);
    }
  }, [lesson, profile, startLesson]);

  // Clean up store on unmount
  useEffect(() => {
    return () => {
      resetLesson();
    };
  }, [resetLesson]);

  // Speech synthesis audio playback
  const playAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith("es"));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  // Autoplay audio on exercise index change
  useEffect(() => {
    if (currentLesson && !isLessonCompleted) {
      const currentEx = currentLesson.exercises[currentExerciseIndex];
      if (currentEx) {
        const text = currentEx.type === "match_pairs" ? "Select the matching pairs" : currentEx.question;
        const timer = setTimeout(() => {
          playAudio(text);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentExerciseIndex, currentLesson, isLessonCompleted]);

  // Submit complete lesson mutation
  const completeMutation = useMutation({
    mutationFn: () => api.completeLesson(lessonId, heartsLost, lessonXP),
    onSuccess: (data) => {
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      // Invalidate queries to refresh home stats
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["learningPath"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["dailyGoal"] });
    }
  });

  const [typedAnswer, setTypedAnswer] = useState("");
  const [matchPairsState, setMatchPairsState] = useState<{
    selectedWord: string | null;
    matchedWords: string[];
    failedMatch: boolean;
  }>({
    selectedWord: null,
    matchedWords: [],
    failedMatch: false
  });

  if (isLoading || !currentLesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground gap-4">
        <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="font-bold text-text-secondary">Loading lesson...</p>
      </div>
    );
  }

  const exercise = currentLesson.exercises[currentExerciseIndex];
  const progressPercent = ((currentExerciseIndex) / currentLesson.exercises.length) * 100;

  // Handle submit action
  const handleCheck = async () => {
    if (exercise.type === "type_answer") {
      await submitCurrentExercise(api.submitAnswer, typedAnswer);
    } else {
      await submitCurrentExercise(api.submitAnswer);
    }
  };

  const handleContinue = () => {
    if (isLessonCompleted || lessonHearts <= 0) {
      if (!completeMutation.isPending && !completeMutation.isSuccess) {
        completeMutation.mutate();
      } else {
        router.push("/");
      }
    } else {
      setTypedAnswer("");
      setMatchPairsState({ selectedWord: null, matchedWords: [], failedMatch: false });
      nextExercise();
    }
  };

  // Match Pairs rendering helper
  const handleMatchClick = (word: string) => {
    if (checked) return;
    const isSpanish = ["niño", "niña", "agua", "leche"].includes(word);
    const isEnglish = ["boy", "girl", "water", "milk"].includes(word);

    const { selectedWord, matchedWords } = matchPairsState;

    if (!selectedWord) {
      setMatchPairsState({ ...matchPairsState, selectedWord: word, failedMatch: false });
      return;
    }

    if (selectedWord === word) {
      setMatchPairsState({ ...matchPairsState, selectedWord: null });
      return;
    }

    // Check if correct match
    const pairsMap: Record<string, string> = {
      boy: "niño", niño: "boy",
      girl: "niña", niña: "girl",
      water: "agua", agua: "water",
      milk: "leche", leche: "milk"
    };

    if (pairsMap[selectedWord] === word) {
      // Correct Match
      const newMatched = [...matchedWords, selectedWord, word];
      setMatchPairsState({
        selectedWord: null,
        matchedWords: newMatched,
        failedMatch: false
      });
      // Save matched options to selectedOptions to submit
      selectOption(`${selectedWord}-${word}`);
    } else {
      // Failed Match
      setMatchPairsState({
        ...matchPairsState,
        failedMatch: true
      });
      setTimeout(() => {
        setMatchPairsState({
          selectedWord: null,
          matchedWords: matchedWords,
          failedMatch: false
        });
      }, 800);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Lesson Header */}
      <header className="max-w-4xl w-full mx-auto px-6 py-4 flex items-center justify-between gap-6 bg-background">
        <button
          onClick={() => {
            if (confirm("Are you sure you want to quit? Your progress won't be saved.")) {
              router.push("/");
            }
          }}
          className="text-text-secondary hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-4 bg-sidebar-border rounded-full overflow-hidden border-2 border-card-border">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-[#58cc02] transition-all duration-300"
          />
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-2 font-bold text-rose-500">
          <motion.div
            animate={checked && !isCorrect ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Heart className="w-6 h-6 fill-current" />
          </motion.div>
          <span>{lessonHearts}</span>
        </div>
      </header>

      {/* Main Exercise Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10 flex flex-col justify-between bg-background">
        <div className="flex flex-col gap-6">
          {/* Instruction & Mascot */}
          <div className="flex items-start gap-4">
            <div className="text-5xl select-none">🦉</div>
            <div className="bg-card-bg border-2 border-card-border rounded-2xl p-4 relative flex-1">
              <div className="absolute w-3 h-3 bg-card-bg border-l-2 border-t-2 border-card-border rotate-45 -left-2 top-5" />
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1">
                  <p className="font-extrabold text-text-secondary text-xs md:text-sm tracking-wide uppercase">
                    {exercise.instruction}
                  </p>
                  <h2 className="text-base md:text-lg font-bold text-text-primary mt-1">
                    {exercise.type === "match_pairs" ? "Select the matching pairs" : exercise.question}
                  </h2>
                </div>
                <button
                  onClick={() => playAudio(exercise.type === "match_pairs" ? "Select the matching pairs" : exercise.question)}
                  className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-[#1cb0f6] rounded-xl border border-blue-500/20 transition-all cursor-pointer shadow-sm shrink-0 flex items-center justify-center"
                  title="Play audio"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Exercise Input Selectors */}
          <div className="mt-8">
            {/* Multiple Choice Card Grid */}
            {exercise.type === "multiple_choice" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exercise.options.map((opt, idx) => {
                  const isSel = selectedOptions.includes(opt.option_text);
                  return (
                    <motion.button
                      key={opt.id}
                      whileHover={!checked ? { scale: 1.02 } : {}}
                      whileTap={!checked ? { scale: 0.98 } : {}}
                      disabled={checked}
                      onClick={() => selectOption(opt.option_text)}
                      className={`p-4 border-2 rounded-2xl text-left font-bold text-base transition-all cursor-pointer border-b-4 flex justify-between items-center ${
                        isSel
                          ? "border-sky-300 bg-sky-50 text-sky-700 border-b-sky-500"
                          : "border-gray-200 hover:bg-gray-50 border-b-gray-400"
                      }`}
                    >
                      <span>{opt.option_text}</span>
                      <span className="text-xs text-gray-400 font-bold border-2 border-gray-200 rounded px-1.5 py-0.5">
                        {idx + 1}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Word Bank Selector */}
            {exercise.type === "translate_word_bank" && (
              <div className="flex flex-col gap-6">
                {/* Solution slot */}
                <div className="min-h-16 border-b-2 border-gray-200 py-3 flex flex-wrap gap-2 items-center">
                  {selectedOptions.map((word) => (
                    <motion.button
                      layoutId={`word-${word}`}
                      key={word}
                      disabled={checked}
                      onClick={() => deselectOption(word)}
                      className="px-4 py-2 bg-white border-2 border-gray-200 border-b-4 border-b-gray-300 rounded-xl font-bold cursor-pointer hover:bg-gray-50 text-gray-700"
                    >
                      {word}
                    </motion.button>
                  ))}
                </div>

                {/* Bank Choices */}
                <div className="flex flex-wrap gap-2 justify-center py-4">
                  {exercise.options.map((opt) => {
                    const isUsed = selectedOptions.includes(opt.option_text);
                    return (
                      <motion.button
                        layoutId={`word-${opt.option_text}`}
                        key={opt.id}
                        disabled={isUsed || checked}
                        onClick={() => selectOption(opt.option_text)}
                        className={`px-4 py-2 border-2 rounded-xl font-bold border-b-4 transition-all ${
                          isUsed
                            ? "bg-gray-100 border-gray-200 border-b-gray-200 text-transparent cursor-default select-none"
                            : "bg-white border-gray-200 border-b-gray-300 hover:bg-gray-50 text-gray-700 cursor-pointer"
                        }`}
                      >
                        {opt.option_text}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fill Blank Options */}
            {exercise.type === "fill_blank" && (
              <div className="flex flex-col gap-6 items-center">
                <div className="flex gap-4">
                  {exercise.options.map((opt) => {
                    const isSel = selectedOptions.includes(opt.option_text);
                    return (
                      <motion.button
                        key={opt.id}
                        disabled={checked}
                        onClick={() => selectOption(opt.option_text)}
                        className={`px-6 py-3 border-2 rounded-2xl font-bold border-b-4 cursor-pointer transition-all ${
                          isSel
                            ? "border-sky-300 bg-sky-50 text-sky-700 border-b-sky-500"
                            : "border-gray-200 hover:bg-gray-50 border-b-gray-400"
                        }`}
                      >
                        {opt.option_text}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Direct Type Answer */}
            {exercise.type === "type_answer" && (
              <div className="flex flex-col gap-4">
                <textarea
                  disabled={checked}
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  placeholder="Type the English translation..."
                  className="w-full min-h-32 p-4 border-2 border-gray-200 border-b-4 border-b-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold text-gray-700 text-lg resize-none"
                />
              </div>
            )}

            {/* Match Pairs */}
            {exercise.type === "match_pairs" && (
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {exercise.options.map((opt) => {
                  const isMatched = matchPairsState.matchedWords.includes(opt.option_text);
                  const isSelected = matchPairsState.selectedWord === opt.option_text;
                  const isFailed = isSelected && matchPairsState.failedMatch;

                  return (
                    <motion.button
                      key={opt.id}
                      disabled={isMatched || checked}
                      onClick={() => handleMatchClick(opt.option_text)}
                      className={`p-3.5 border-2 rounded-xl font-bold text-base border-b-4 transition-all flex items-center justify-center cursor-pointer ${
                        isMatched
                          ? "bg-gray-100 border-gray-200 border-b-gray-200 text-gray-300 cursor-default"
                          : isFailed
                          ? "border-rose-400 bg-rose-50 border-b-rose-500 text-rose-700 animate-shake"
                          : isSelected
                          ? "border-sky-300 bg-sky-50 border-b-sky-500 text-sky-700"
                          : "border-gray-200 hover:bg-gray-50 border-b-gray-300 text-gray-700"
                      }`}
                    >
                      {opt.option_text}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Interactive Bottom Feedback Bar */}
      <AnimatePresence>
        {!checked ? (
          <div className="border-t border-card-border px-6 py-6 bg-card-bg sticky bottom-0">
            <div className="max-w-2xl mx-auto flex items-center justify-end">
              <button
                disabled={selectedOptions.length === 0 && typedAnswer === ""}
                onClick={handleCheck}
                className={`px-8 py-3.5 rounded-xl font-bold tracking-wider cursor-pointer border-b-4 border-emerald-600 active:border-b-0 ${
                  selectedOptions.length > 0 || typedAnswer !== ""
                    ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                    : "bg-sidebar-border border-b-0 text-text-secondary cursor-not-allowed"
                }`}
              >
                CHECK
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className={`px-6 py-6 border-t sticky bottom-0 ${
              isCorrect ? "bg-[#182f25] border-emerald-900/30 text-emerald-400" : "bg-[#3b1c1c] border-rose-950/30 text-rose-400"
            }`}
          >
            <div className="max-w-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-3">
                {isCorrect ? (
                  <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-rose-500 shrink-0" />
                )}
                <div>
                  <h3 className={`font-black text-lg ${isCorrect ? "text-[#58cc02]" : "text-rose-400"}`}>
                    {isCorrect ? "You are correct!" : "Correct translation:"}
                  </h3>
                  {!isCorrect && (
                    <p className="text-sm font-bold text-rose-350 mt-1">{correctAnswer}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleContinue}
                className={`px-8 py-3.5 rounded-xl font-bold tracking-wider cursor-pointer border-b-4 flex items-center justify-center gap-2 ${
                  isCorrect
                    ? "bg-[#58cc02] hover:bg-emerald-400 border-emerald-700 text-white"
                    : "bg-rose-500 hover:bg-rose-400 border-rose-600 text-white"
                }`}
              >
                CONTINUE
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Complete / Success Dialog Overlay */}
      {completeMutation.isSuccess && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 gap-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center max-w-sm text-center gap-6"
          >
            <span className="text-8xl select-none">🏆</span>
            <div>
              <h2 className="text-3xl font-black text-emerald-500">Lesson Complete!</h2>
              <p className="font-bold text-text-secondary mt-2">
                You've completed the lesson and boosted your skills!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <div className="bg-yellow-950/20 border-2 border-yellow-900/30 rounded-2xl p-4 flex flex-col items-center">
                <Zap className="w-6 h-6 text-yellow-500 fill-current mb-1" />
                <span className="font-black text-lg text-yellow-400">+{lessonXP}</span>
                <span className="text-xs font-bold text-yellow-500">XP GAINED</span>
              </div>
              <div className="bg-rose-950/20 border-2 border-rose-900/30 rounded-2xl p-4 flex flex-col items-center">
                <Heart className="w-6 h-6 text-rose-500 fill-current mb-1" />
                <span className="font-black text-lg text-rose-400">
                  {Math.round(((currentLesson.exercises.length - heartsLost) / currentLesson.exercises.length) * 100)}%
                </span>
                <span className="text-xs font-bold text-rose-500">ACCURACY</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full bg-[#58cc02] hover:bg-emerald-400 text-white font-extrabold py-3.5 rounded-xl border-b-4 border-emerald-700 active:border-b-0 cursor-pointer mt-4"
            >
              GREAT WORK
            </button>
          </motion.div>
        </div>
      )}

      {/* Out of Hearts Modal Overlay */}
      {lessonHearts <= 0 && !completeMutation.isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card-bg text-foreground rounded-3xl p-6 max-w-sm w-full text-center flex flex-col items-center gap-6 border-b-6 border-card-border"
          >
            <span className="text-6xl select-none">💔</span>
            <div>
              <h2 className="text-2xl font-black text-rose-500">Out of Hearts!</h2>
              <p className="font-bold text-text-secondary mt-2">
                Need more hearts to continue? Refill in the practice area or buy a full heart package.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => {
                  router.push("/");
                }}
                className="w-full bg-rose-500 hover:bg-rose-400 text-white font-extrabold py-3.5 rounded-xl border-b-4 border-rose-600 active:border-b-0 cursor-pointer"
              >
                RETURN HOME
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
