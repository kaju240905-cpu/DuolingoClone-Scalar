from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Common schemas
class ExerciseOptionResponse(BaseModel):
    id: int
    option_text: str
    word_order: Optional[int] = None

    class Config:
        from_attributes = True

class ExerciseResponse(BaseModel):
    id: int
    lesson_id: int
    type: str
    instruction: str
    question: str
    options: List[ExerciseOptionResponse]
    order: int

    class Config:
        from_attributes = True

class LessonResponse(BaseModel):
    id: int
    skill_id: int
    name: str
    xp_reward: int
    order: int
    exercises: List[ExerciseResponse] = []

    class Config:
        from_attributes = True

class SkillResponse(BaseModel):
    id: int
    unit_id: int
    name: str
    description: str
    order: int
    icon_name: str
    lessons: List[LessonResponse] = []
    is_completed: bool = False
    crowns: int = 0

    class Config:
        from_attributes = True

class UnitResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: str
    order: int
    skills: List[SkillResponse] = []

    class Config:
        from_attributes = True

class CourseResponse(BaseModel):
    id: int
    name: str
    language_code: str
    flag_code: str
    units: List[UnitResponse] = []

    class Config:
        from_attributes = True

# User schemas
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    hearts: int
    max_hearts: int
    xp: int
    streak: int
    crowns: int
    active_course_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Request schemas
class AnswerSubmission(BaseModel):
    exercise_id: int
    user_answer: str # comma-separated for match pairs or word bank, string for normal type

class AnswerResponse(BaseModel):
    is_correct: bool
    correct_answer: str
    hearts_remaining: int

class LessonCompleteRequest(BaseModel):
    lesson_id: int
    hearts_lost: int
    xp_gained: int

class LessonCompleteResponse(BaseModel):
    success: bool
    xp_gained: int
    hearts_remaining: int
    streak_updated: int
    new_crowns: int

# Leaderboard & Achievement
class LeaderboardEntry(BaseModel):
    username: str
    weekly_xp: int
    rank: int

    class Config:
        from_attributes = True

class AchievementResponse(BaseModel):
    id: int
    name: str
    description: str
    icon_name: str
    progress: int
    requirement_value: int
    is_unlocked: bool

    class Config:
        from_attributes = True

class DailyGoalResponse(BaseModel):
    id: int
    xp_goal: int
    current_xp: int
    is_completed: bool

    class Config:
        from_attributes = True
