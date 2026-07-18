const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ExerciseOption {
  id: number;
  option_text: string;
  word_order?: number;
}

export interface Exercise {
  id: number;
  lesson_id: number;
  type: string;
  instruction: string;
  question: string;
  options: ExerciseOption[];
  order: number;
}

export interface Lesson {
  id: number;
  skill_id: number;
  name: string;
  xp_reward: number;
  order: number;
  exercises: Exercise[];
}

export interface Skill {
  id: number;
  unit_id: number;
  name: string;
  description: string;
  order: number;
  icon_name: string;
  lessons: Lesson[];
  is_completed: boolean;
  crowns: number;
}

export interface Unit {
  id: number;
  course_id: number;
  title: string;
  description: string;
  order: number;
  skills: Skill[];
}

export interface Course {
  id: number;
  name: string;
  language_code: string;
  flag_code: string;
  units: Unit[];
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  hearts: number;
  max_hearts: number;
  xp: number;
  streak: number;
  crowns: number;
  active_course_id?: number;
  created_at: string;
}

export interface LeaderboardEntry {
  username: string;
  weekly_xp: number;
  rank: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  progress: number;
  requirement_value: number;
  is_unlocked: boolean;
}

export interface DailyGoal {
  id: number;
  xp_goal: number;
  current_xp: number;
  is_completed: boolean;
}

// Global fetch wrapper helper
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  // Default user header for simplifying authentication
  headers.set("X-User-ID", "1");
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "API request failed");
  }

  return response.json();
}

export const api = {
  getUserProfile: () => request<UserProfile>("/users/me"),
  refillHearts: () => request<UserProfile>("/users/refill-hearts", { method: "POST" }),

  getCourses: () => request<Course[]>("/courses"),
  getLearningPath: () => request<Course>("/learning-path"),
  getLesson: (lessonId: number) => request<Lesson>(`/lessons/${lessonId}`),

  submitAnswer: (exerciseId: number, answer: string) =>
    request<{ is_correct: boolean; correct_answer: string; hearts_remaining: number }>(
      `/exercises/${exerciseId}/submit`,
      {
        method: "POST",
        body: JSON.stringify({ exercise_id: exerciseId, user_answer: answer }),
      }
    ),

  completeLesson: (lessonId: number, heartsLost: number, xpGained: number) =>
    request<{ success: boolean; xp_gained: number; hearts_remaining: number; streak_updated: number; new_crowns: number }>(
      "/lessons/complete",
      {
        method: "POST",
        body: JSON.stringify({
          lesson_id: lessonId,
          hearts_lost: heartsLost,
          xp_gained: xpGained,
        }),
      }
    ),

  getLeaderboard: () => request<LeaderboardEntry[]>("/leaderboard"),
  getAchievements: () => request<Achievement[]>("/achievements"),
  getDailyGoal: () => request<DailyGoal>("/daily-goal"),
};
