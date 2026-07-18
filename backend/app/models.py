from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hearts = Column(Integer, default=5)
    max_hearts = Column(Integer, default=5)
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    crowns = Column(Integer, default=0)
    active_course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    last_active = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    active_course = relationship("Course", foreign_keys=[active_course_id])
    skill_progresses = relationship("UserSkillProgress", back_populates="user")
    lesson_attempts = relationship("LessonAttempt", back_populates="user")
    achievements = relationship("UserAchievement", back_populates="user")
    daily_goals = relationship("DailyGoal", back_populates="user")
    heart_history = relationship("HeartHistory", back_populates="user")
    xp_history = relationship("XPHistory", back_populates="user")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    language_code = Column(String, nullable=False)
    flag_code = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan")

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    icon_name = Column(String, default="book")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete-orphan")
    user_progresses = relationship("UserSkillProgress", back_populates="skill", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    name = Column(String, nullable=False)
    xp_reward = Column(Integer, default=10)
    order = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan")
    attempts = relationship("LessonAttempt", back_populates="lesson", cascade="all, delete-orphan")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    type = Column(String, nullable=False) # multiple_choice, translate_word_bank, fill_blank, type_answer, match_pairs
    instruction = Column(String, nullable=False)
    question = Column(String, nullable=False) # e.g. "The boy" or word to match
    correct_answer = Column(String, nullable=False) # e.g. "El niño"
    order = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    lesson = relationship("Lesson", back_populates="exercises")
    options = relationship("ExerciseOption", back_populates="exercise", cascade="all, delete-orphan")

class ExerciseOption(Base):
    __tablename__ = "exercise_options"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    option_text = Column(String, nullable=False)
    is_correct = Column(Boolean, default=False)
    word_order = Column(Integer, nullable=True) # for word bank order if needed
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    exercise = relationship("Exercise", back_populates="options")

class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    crowns = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="skill_progresses")
    skill = relationship("Skill", back_populates="user_progresses")

class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    xp_gained = Column(Integer, default=0)
    hearts_lost = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="lesson_attempts")
    lesson = relationship("Lesson", back_populates="attempts")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=False)
    requirement_type = Column(String, nullable=False) # e.g. "xp", "lessons", "streak"
    requirement_value = Column(Integer, nullable=False)
    icon_name = Column(String, default="award")

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    progress = Column(Integer, default=0)
    is_unlocked = Column(Boolean, default=False)
    unlocked_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")

class Leaderboard(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    weekly_xp = Column(Integer, default=0)
    rank = Column(Integer, nullable=True)
    week_start = Column(DateTime, default=datetime.utcnow)

class DailyGoal(Base):
    __tablename__ = "daily_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    xp_goal = Column(Integer, default=50)
    date = Column(DateTime, default=datetime.utcnow)
    is_completed = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="daily_goals")

class HeartHistory(Base):
    __tablename__ = "heart_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount_changed = Column(Integer, nullable=False) # e.g. -1, +1, +5
    reason = Column(String, nullable=False) # e.g. "wrong_answer", "refill_xp", "practice"
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="heart_history")

class XPHistory(Base):
    __tablename__ = "xp_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount_gained = Column(Integer, nullable=False)
    reason = Column(String, nullable=False) # e.g. "lesson_completed", "practice"
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="xp_history")
