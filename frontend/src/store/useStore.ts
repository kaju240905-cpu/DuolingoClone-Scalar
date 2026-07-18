import { create } from "zustand";
import { Lesson, UserProfile, Exercise } from "../services/api";

interface AppState {
  // Auth State
  isLoggedIn: boolean;
  setLoggedIn: (val: boolean) => void;

  // User Profile State
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Gamification Items
  gems: number;
  setGems: (gems: number) => void;
  streakFreezes: number;
  setStreakFreezes: (count: number) => void;

  // Social Following State
  following: string[];
  toggleFollow: (username: string) => void;

  // Lesson Player State
  currentLesson: Lesson | null;
  currentExerciseIndex: number;
  selectedOptions: string[]; // Selected cards / ordered words
  lessonHearts: number;
  lessonXP: number;
  checked: boolean;
  isCorrect: boolean | null;
  correctAnswer: string;
  isLessonCompleted: boolean;
  heartsLost: number;

  // Actions
  startLesson: (lesson: Lesson, initialHearts: number) => void;
  selectOption: (optionText: string) => void;
  deselectOption: (optionText: string) => void;
  clearSelection: () => void;
  submitCurrentExercise: (
    submitFn: (exerciseId: number, answer: string) => Promise<{ is_correct: boolean; correct_answer: string; hearts_remaining: number }>,
    answerOverride?: string
  ) => Promise<boolean>;
  nextExercise: () => void;
  resetLesson: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  isLoggedIn: typeof window !== "undefined" ? localStorage.getItem("isLoggedIn") === "true" : false,
  setLoggedIn: (val) => {
    if (typeof window !== "undefined") localStorage.setItem("isLoggedIn", val ? "true" : "false");
    set({ isLoggedIn: val });
  },

  user: null,
  setUser: (user) => set({ user }),

  gems: typeof window !== "undefined" ? parseInt(localStorage.getItem("gems") || "500") : 500,
  setGems: (gems) => {
    if (typeof window !== "undefined") localStorage.setItem("gems", gems.toString());
    set({ gems });
  },

  streakFreezes: typeof window !== "undefined" ? parseInt(localStorage.getItem("streakFreezes") || "0") : 0,
  setStreakFreezes: (count) => {
    if (typeof window !== "undefined") localStorage.setItem("streakFreezes", count.toString());
    set({ streakFreezes: count });
  },

  following: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("following") || "[]") : [],
  toggleFollow: (username) => {
    const { following } = get();
    const nextFollowing = following.includes(username)
      ? following.filter((name) => name !== username)
      : [...following, username];
    
    if (typeof window !== "undefined") {
      localStorage.setItem("following", JSON.stringify(nextFollowing));
    }
    set({ following: nextFollowing });
  },

  currentLesson: null,
  currentExerciseIndex: 0,
  selectedOptions: [],
  lessonHearts: 5,
  lessonXP: 0,
  checked: false,
  isCorrect: null,
  correctAnswer: "",
  isLessonCompleted: false,
  heartsLost: 0,

  startLesson: (lesson, initialHearts) => set({
    currentLesson: lesson,
    currentExerciseIndex: 0,
    selectedOptions: [],
    lessonHearts: initialHearts,
    lessonXP: 0,
    checked: false,
    isCorrect: null,
    correctAnswer: "",
    isLessonCompleted: false,
    heartsLost: 0
  }),

  selectOption: (optionText) => {
    const { currentLesson, currentExerciseIndex, selectedOptions } = get();
    if (!currentLesson) return;
    const exercise = currentLesson.exercises[currentExerciseIndex];

    if (exercise.type === "multiple_choice" || exercise.type === "fill_blank") {
      // Multiple choice is single select
      set({ selectedOptions: [optionText] });
    } else if (exercise.type === "translate_word_bank") {
      // Word bank appends selected words
      set({ selectedOptions: [...selectedOptions, optionText] });
    } else if (exercise.type === "match_pairs") {
      // Match pairs accumulates pairs
      if (selectedOptions.includes(optionText)) {
        set({ selectedOptions: selectedOptions.filter((o) => o !== optionText) });
      } else {
        set({ selectedOptions: [...selectedOptions, optionText] });
      }
    } else {
      // Type answer is typed directly
      set({ selectedOptions: [optionText] });
    }
  },

  deselectOption: (optionText) => {
    const { selectedOptions } = get();
    set({ selectedOptions: selectedOptions.filter((item) => item !== optionText) });
  },

  clearSelection: () => set({ selectedOptions: [] }),

  submitCurrentExercise: async (submitFn, answerOverride) => {
    const { currentLesson, currentExerciseIndex, selectedOptions, lessonHearts, heartsLost } = get();
    if (!currentLesson) return false;
    const exercise = currentLesson.exercises[currentExerciseIndex];

    let answerString = answerOverride !== undefined ? answerOverride : "";
    if (answerOverride === undefined) {
      if (exercise.type === "translate_word_bank") {
        answerString = selectedOptions.join(" ");
      } else if (exercise.type === "match_pairs") {
        // Re-form pairs representation, e.g. comma separated
        answerString = selectedOptions.join(",");
      } else {
        answerString = selectedOptions[0] || "";
      }
    }

    try {
      const res = await submitFn(exercise.id, answerString);
      const isCorrect = res.is_correct;
      const newHearts = res.hearts_remaining;
      const lost = isCorrect ? heartsLost : (heartsLost + 1);

      set({
        checked: true,
        isCorrect,
        correctAnswer: res.correct_answer,
        lessonHearts: newHearts,
        heartsLost: lost,
        // Accumulate XP if correct
        lessonXP: isCorrect ? (get().lessonXP + 3) : get().lessonXP,
      });

      // Update user hearts in store
      const currentUser = get().user;
      if (currentUser) {
        set({
          user: {
            ...currentUser,
            hearts: newHearts
          }
        });
      }

      return isCorrect;
    } catch (e) {
      console.error(e);
      // Fallback local validation in case API is temporarily unavailable
      const isCorrect = false;
      set({
        checked: true,
        isCorrect,
        correctAnswer: "Verification offline. Please try again.",
        lessonHearts: isCorrect ? lessonHearts : Math.max(0, lessonHearts - 1),
        heartsLost: isCorrect ? heartsLost : (heartsLost + 1),
        lessonXP: isCorrect ? (get().lessonXP + 3) : get().lessonXP,
      });
      return isCorrect;
    }
  },

  nextExercise: () => {
    const { currentLesson, currentExerciseIndex, lessonHearts } = get();
    if (!currentLesson) return;

    const isLast = currentExerciseIndex >= currentLesson.exercises.length - 1;
    const outOfHearts = lessonHearts <= 0;

    if (isLast || outOfHearts) {
      set({ isLessonCompleted: true });
    } else {
      set({
        currentExerciseIndex: currentExerciseIndex + 1,
        selectedOptions: [],
        checked: false,
        isCorrect: null,
        correctAnswer: ""
      });
    }
  },

  resetLesson: () => set({
    currentLesson: null,
    currentExerciseIndex: 0,
    selectedOptions: [],
    checked: false,
    isCorrect: null,
    correctAnswer: "",
    isLessonCompleted: false,
    heartsLost: 0
  })
}));
