import os
from fastapi import FastAPI, Depends, HTTPException, Header, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta, timezone

from .database import engine, get_db
from . import models, schemas

# Initialize database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Duolingo Clone API", version="1.0.0")

# Setup CORS origins dynamically for production
cors_origins_env = os.getenv("CORS_ORIGINS")
origins = (
    [origin.strip() for origin in cors_origins_env.split(",")]
    if cors_origins_env
    else ["http://localhost:3000", "http://localhost:3001"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper dependency to get the current user
def get_current_user(x_user_id: Optional[int] = Header(None), db: Session = Depends(get_db)):
    # Default to user with ID 1 (our learner) if header is missing
    user_id = x_user_id or 1
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )
    return user

@app.get("/api/users/me", response_model=schemas.UserResponse)
def get_user_profile(user: models.User = Depends(get_current_user)):
    return user

@app.post("/api/users/refill-hearts", response_model=schemas.UserResponse)
def refill_hearts(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    if user.hearts >= user.max_hearts:
        return user
    
    # Check if user has enough XP to refill (say, 50 XP per refill or practice)
    # For now, we will allow refills and log to history.
    user.hearts = user.max_hearts
    db.add(models.HeartHistory(
        user_id=user.id,
        amount_changed=5,
        reason="refill_practice"
    ))
    db.commit()
    db.refresh(user)
    return user

@app.get("/api/courses", response_model=List[schemas.CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

@app.get("/api/learning-path", response_model=schemas.CourseResponse)
def get_learning_path(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    course_id = user.active_course_id
    if not course_id:
        # Default to first course
        first_course = db.query(models.Course).first()
        if not first_course:
            raise HTTPException(status_code=404, detail="No courses found.")
        course_id = first_course.id
        user.active_course_id = course_id
        db.commit()

    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    # We also want to enrich the skill list with the user's progress
    for unit in course.units:
        for skill in unit.skills:
            progress = db.query(models.UserSkillProgress).filter(
                models.UserSkillProgress.user_id == user.id,
                models.UserSkillProgress.skill_id == skill.id
            ).first()
            if progress:
                skill.is_completed = progress.is_completed
                skill.crowns = progress.crowns
            else:
                skill.is_completed = False
                skill.crowns = 0

    return course

@app.get("/api/lessons/{lesson_id}", response_model=schemas.LessonResponse)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found.")
    return lesson

@app.post("/api/exercises/{exercise_id}/submit", response_model=schemas.AnswerResponse)
def submit_answer(
    exercise_id: int,
    submission: schemas.AnswerSubmission,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    exercise = db.query(models.Exercise).filter(models.Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found.")

    is_correct = False
    
    # Custom validation based on type
    if exercise.type == "match_pairs":
        # Question: boy,girl... Answer: niño,niña...
        # submission should contain pairs separated by comma e.g. "boy-niño,girl-niña"
        # We can perform simple exact validation or assume correct if correct answers match
        submitted = submission.user_answer.strip().lower()
        correct = exercise.correct_answer.strip().lower()
        # For match pairs, we split and match sets
        is_correct = sorted(submitted.split(",")) == sorted(correct.split(","))
    elif exercise.type == "translate_word_bank":
        # Standardize spaces and punctuation
        submitted = " ".join(submission.user_answer.strip().split()).lower()
        correct = " ".join(exercise.correct_answer.strip().split()).lower()
        is_correct = submitted == correct
    else:
        # Standardize lowercase match for general answers
        submitted = submission.user_answer.strip().lower()
        correct = exercise.correct_answer.strip().lower()
        is_correct = submitted == correct

    if not is_correct:
        # Deduct a heart
        if user.hearts > 0:
            user.hearts -= 1
            db.add(models.HeartHistory(
                user_id=user.id,
                amount_changed=-1,
                reason=f"wrong_answer_ex_{exercise_id}"
            ))
            db.commit()

    return schemas.AnswerResponse(
        is_correct=is_correct,
        correct_answer=exercise.correct_answer,
        hearts_remaining=user.hearts
    )

@app.post("/api/lessons/complete", response_model=schemas.LessonCompleteResponse)
def complete_lesson(
    req: schemas.LessonCompleteRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == req.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found.")

    # Record attempt
    attempt = models.LessonAttempt(
        user_id=user.id,
        lesson_id=req.lesson_id,
        xp_gained=req.xp_gained,
        hearts_lost=req.hearts_lost,
        is_completed=True
    )
    db.add(attempt)

    # Award XP
    user.xp += req.xp_gained
    db.add(models.XPHistory(
        user_id=user.id,
        amount_gained=req.xp_gained,
        reason=f"completed_lesson_{req.lesson_id}"
    ))

    # Update skill progress
    skill = lesson.skill
    progress = db.query(models.UserSkillProgress).filter(
        models.UserSkillProgress.user_id == user.id,
        models.UserSkillProgress.skill_id == skill.id
    ).first()

    if not progress:
        progress = models.UserSkillProgress(
            user_id=user.id,
            skill_id=skill.id,
            crowns=1,
            is_completed=True
        )
        db.add(progress)
        user.crowns += 1
    else:
        # Just increment crown count
        progress.crowns += 1
        user.crowns += 1

    # Check/Update Daily Goal
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    daily_goal = db.query(models.DailyGoal).filter(
        models.DailyGoal.user_id == user.id,
        models.DailyGoal.date >= today_start
    ).first()

    # Calculate total XP gained today
    xp_today = db.query(models.XPHistory).filter(
        models.XPHistory.user_id == user.id,
        models.XPHistory.timestamp >= today_start
    ).all()
    total_xp_today = sum(x.amount_gained for x in xp_today) + req.xp_gained

    if daily_goal:
        daily_goal.is_completed = total_xp_today >= daily_goal.xp_goal
    else:
        # Create one
        daily_goal = models.DailyGoal(
            user_id=user.id,
            xp_goal=50,
            date=datetime.utcnow(),
            is_completed=total_xp_today >= 50
        )
        db.add(daily_goal)

    # Check Achievements
    # Check Streak (For simplicity, increment streak if active today)
    user.streak = max(user.streak, 1) # Simple increment/reset logic can be handled or mocked
    
    # Leaderboard update
    leaderboard_entry = db.query(models.Leaderboard).filter(
        models.Leaderboard.user_id == user.id
    ).first()
    if leaderboard_entry:
        leaderboard_entry.weekly_xp += req.xp_gained
    else:
        db.add(models.Leaderboard(
            user_id=user.id,
            weekly_xp=req.xp_gained,
            week_start=datetime.utcnow() - timedelta(days=2)
        ))

    # Evaluate User Achievements
    # Get all achievements
    all_achievements = db.query(models.Achievement).all()
    for ach in all_achievements:
        user_ach = db.query(models.UserAchievement).filter(
            models.UserAchievement.user_id == user.id,
            models.UserAchievement.achievement_id == ach.id
        ).first()

        current_val = 0
        if ach.requirement_type == "xp":
            current_val = user.xp
        elif ach.requirement_type == "lessons":
            current_val = db.query(models.LessonAttempt).filter(
                models.LessonAttempt.user_id == user.id,
                models.LessonAttempt.is_completed == True
            ).count()
        elif ach.requirement_type == "streak":
            current_val = user.streak

        is_unlocked = current_val >= ach.requirement_value

        if not user_ach:
            db.add(models.UserAchievement(
                user_id=user.id,
                achievement_id=ach.id,
                progress=current_val,
                is_unlocked=is_unlocked,
                unlocked_at=datetime.utcnow() if is_unlocked else None
            ))
        else:
            user_ach.progress = current_val
            if is_unlocked and not user_ach.is_unlocked:
                user_ach.is_unlocked = True
                user_ach.unlocked_at = datetime.utcnow()

    db.commit()
    db.refresh(user)

    return schemas.LessonCompleteResponse(
        success=True,
        xp_gained=req.xp_gained,
        hearts_remaining=user.hearts,
        streak_updated=user.streak,
        new_crowns=user.crowns
    )

@app.get("/api/leaderboard", response_model=List[schemas.LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    # Query leaderboard entries, join with user, order by weekly_xp desc
    results = db.query(
        models.User.username,
        models.Leaderboard.weekly_xp
    ).join(
        models.Leaderboard, models.User.id == models.Leaderboard.user_id
    ).order_by(
        models.Leaderboard.weekly_xp.desc()
    ).all()

    entries = []
    for rank, (username, weekly_xp) in enumerate(results, 1):
        entries.append(schemas.LeaderboardEntry(
            username=username,
            weekly_xp=weekly_xp,
            rank=rank
        ))
    return entries

@app.get("/api/achievements", response_model=List[schemas.AchievementResponse])
def get_user_achievements(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    all_ach = db.query(models.Achievement).all()
    responses = []

    for ach in all_ach:
        user_ach = db.query(models.UserAchievement).filter(
            models.UserAchievement.user_id == user.id,
            models.UserAchievement.achievement_id == ach.id
        ).first()

        progress = user_ach.progress if user_ach else 0
        is_unlocked = user_ach.is_unlocked if user_ach else False

        # Calculate progress depending on requirement type if user_ach was not created yet
        if not user_ach:
            if ach.requirement_type == "xp":
                progress = user.xp
            elif ach.requirement_type == "lessons":
                progress = db.query(models.LessonAttempt).filter(
                    models.LessonAttempt.user_id == user.id,
                    models.LessonAttempt.is_completed == True
                ).count()
            elif ach.requirement_type == "streak":
                progress = user.streak
            is_unlocked = progress >= ach.requirement_value

        responses.append(schemas.AchievementResponse(
            id=ach.id,
            name=ach.name,
            description=ach.description,
            icon_name=ach.icon_name,
            progress=min(progress, ach.requirement_value),
            requirement_value=ach.requirement_value,
            is_unlocked=is_unlocked
        ))

    return responses

@app.get("/api/daily-goal", response_model=schemas.DailyGoalResponse)
def get_daily_goal(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    daily_goal = db.query(models.DailyGoal).filter(
        models.DailyGoal.user_id == user.id,
        models.DailyGoal.date >= today_start
    ).first()

    # Calculate total XP gained today
    xp_today = db.query(models.XPHistory).filter(
        models.XPHistory.user_id == user.id,
        models.XPHistory.timestamp >= today_start
    ).all()
    total_xp_today = sum(x.amount_gained for x in xp_today)

    if not daily_goal:
        # Create daily goal default
        daily_goal = models.DailyGoal(
            user_id=user.id,
            xp_goal=50,
            date=datetime.utcnow(),
            is_completed=total_xp_today >= 50
        )
        db.add(daily_goal)
        db.commit()
        db.refresh(daily_goal)

    return schemas.DailyGoalResponse(
        id=daily_goal.id,
        xp_goal=daily_goal.xp_goal,
        current_xp=total_xp_today,
        is_completed=daily_goal.is_completed
    )
