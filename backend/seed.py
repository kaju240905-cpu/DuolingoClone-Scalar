import sys
from datetime import datetime, timedelta, timezone
from app.database import SessionLocal, engine, Base
from app.models import (
    Course, Unit, Skill, Lesson, Exercise, ExerciseOption,
    User, Achievement, Leaderboard, DailyGoal
)

def seed_db():
    # Only seed if database is empty or if --force is passed
    force_seed = "--force" in sys.argv
    db = SessionLocal()
    has_data = False
    try:
        # Check if we already have users or courses seeded
        has_data = db.query(User).first() is not None or db.query(Course).first() is not None
    except Exception:
        pass
    finally:
        db.close()

    if has_data and not force_seed:
        print("Database already contains seeded data. Skipping seeding to prevent data loss.")
        print("Run with 'python seed.py --force' if you want to force reset and re-seed.")
        return

    print("Resetting and creating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding achievements...")
        achievements = [
            Achievement(
                name="First Steps",
                description="Earn 50 XP",
                requirement_type="xp",
                requirement_value=50,
                icon_name="award"
            ),
            Achievement(
                name="XP Collector",
                description="Earn 200 XP",
                requirement_type="xp",
                requirement_value=200,
                icon_name="zap"
            ),
            Achievement(
                name="Fast Learner",
                description="Complete 3 lessons",
                requirement_type="lessons",
                requirement_value=3,
                icon_name="check-circle"
            ),
            Achievement(
                name="Streak Legend",
                description="Maintain a 3-day streak",
                requirement_type="streak",
                requirement_value=3,
                icon_name="flame"
            )
        ]
        db.add_all(achievements)
        db.commit()

        # Multi-language translations dictionary
        course_configs = {
            "Spanish": {
                "course_name": "Spanish",
                "lang_code": "es",
                "flag_code": "es",
                "ex1_correct": "El niño",
                "ex1_opts": [("El niño", True), ("La niña", False), ("El perro", False)],
                "ex2_correct": "La niña bebe agua",
                "ex2_opts": ["agua", "bebe", "La", "niña", "leche", "perro", "gato"],
                "ex3_question": "Yo ____ un hombre (soy / comes)",
                "ex3_correct": "soy",
                "ex3_opts": [("soy", True), ("comes", False)],
                "ex4_question": "Hola",
                "ex4_correct": "Hello",
                "ex5_q": "boy,girl,water,milk",
                "ex5_c": "niño,niña,agua,leche",
                "ex5_opts": ["boy", "girl", "water", "milk", "niño", "niña", "agua", "leche"]
            },
            "French": {
                "course_name": "French",
                "lang_code": "fr",
                "flag_code": "fr",
                "ex1_correct": "Le garçon",
                "ex1_opts": [("Le garçon", True), ("La fille", False), ("Le chien", False)],
                "ex2_correct": "La fille boit de l'eau",
                "ex2_opts": ["de", "l'eau", "La", "fille", "boit", "lait", "chien"],
                "ex3_question": "Je ____ un homme (suis / manges)",
                "ex3_correct": "suis",
                "ex3_opts": [("suis", True), ("manges", False)],
                "ex4_question": "Bonjour",
                "ex4_correct": "Hello",
                "ex5_q": "boy,girl,water,milk",
                "ex5_c": "garçon,fille,eau,lait",
                "ex5_opts": ["boy", "girl", "water", "milk", "garçon", "fille", "eau", "lait"]
            },
            "German": {
                "course_name": "German",
                "lang_code": "de",
                "flag_code": "de",
                "ex1_correct": "Der Junge",
                "ex1_opts": [("Der Junge", True), ("Das Mädchen", False), ("Der Hund", False)],
                "ex2_correct": "Das Mädchen trinkt Wasser",
                "ex2_opts": ["Wasser", "trinkt", "Das", "Mädchen", "Milch", "Hund", "Katze"],
                "ex3_question": "Ich ____ ein Mann (bin / isst)",
                "ex3_correct": "bin",
                "ex3_opts": [("bin", True), ("isst", False)],
                "ex4_question": "Hallo",
                "ex4_correct": "Hello",
                "ex5_q": "boy,girl,water,milk",
                "ex5_c": "junge,mädchen,wasser,milch",
                "ex5_opts": ["boy", "girl", "water", "milk", "junge", "mädchen", "wasser", "milch"]
            },
            "Japanese": {
                "course_name": "Japanese",
                "lang_code": "ja",
                "flag_code": "jp",
                "ex1_correct": "男の子",
                "ex1_opts": [("男の子", True), ("女の子", False), ("犬", False)],
                "ex2_correct": "女の子は水を飲みます",
                "ex2_opts": ["水", "飲みます", "女の子は", "牛乳", "犬", "猫"],
                "ex3_question": "私は男の子____ (です / 食べる)",
                "ex3_correct": "です",
                "ex3_opts": [("です", True), ("食べる", False)],
                "ex4_question": "こんにちは",
                "ex4_correct": "Hello",
                "ex5_q": "boy,girl,water,milk",
                "ex5_c": "男の子,女の子,水,牛乳",
                "ex5_opts": ["boy", "girl", "water", "milk", "男の子", "女の子", "水", "牛乳"]
            }
        }

        # Define units templates
        units_data = [
            ("Unit 1", "Form Basic Sentences", "Learn basic words, greetings, and simple descriptions."),
            ("Unit 2", "Get Around in a City", "Ask for directions, order transport, and describe places."),
            ("Unit 3", "Discuss Food and Dining", "Talk about different foods, order at restaurants, and express tastes.")
        ]

        # Define Skills for each unit
        skills_data = {
            1: [
                ("Basics", "Introduce yourself and say simple words.", "book-open"),
                ("Greetings", "Learn how to say hello and goodbye.", "message-circle"),
                ("People", "Describe friends, family, and yourself.", "users")
            ],
            2: [
                ("Travel", "Learn words related to travel and bags.", "plane"),
                ("Directions", "Navigate streets and ask where places are.", "compass"),
                ("Lodging", "Book hotels and talk about amenities.", "home")
            ],
            3: [
                ("Food", "Identify basic food groups and meals.", "coffee"),
                ("Restaurant", "Order meals and pay the check.", "shopping-bag"),
                ("Shopping", "Discuss prices, clothing, and colors.", "tag")
            ]
        }

        # Keep reference to first seeded course for default user
        first_course_id = 1

        for c_idx, (c_name, cfg) in enumerate(course_configs.items(), 1):
            print(f"Seeding Course: {c_name}...")
            course = Course(
                name=cfg["course_name"],
                language_code=cfg["lang_code"],
                flag_code=cfg["flag_code"]
            )
            db.add(course)
            db.commit()

            if c_idx == 1:
                first_course_id = course.id

            # Seed Units and Skills under this course
            for u_idx, (u_title, u_desc, u_detail) in enumerate(units_data, 1):
                unit = Unit(
                    course_id=course.id,
                    title=u_title,
                    description=f"{u_desc} - {u_detail}",
                    order=u_idx
                )
                db.add(unit)
                db.commit()

                skills_in_unit = skills_data[u_idx]
                for s_idx, (s_name, s_desc, s_icon) in enumerate(skills_in_unit, 1):
                    skill = Skill(
                        unit_id=unit.id,
                        name=s_name,
                        description=s_desc,
                        order=s_idx,
                        icon_name=s_icon
                    )
                    db.add(skill)
                    db.commit()

                    # Add 2 lessons per skill to keep it modular but detailed
                    for l_idx in range(1, 3):
                        lesson = Lesson(
                            skill_id=skill.id,
                            name=f"Lesson {l_idx}",
                            xp_reward=15,
                            order=l_idx
                        )
                        db.add(lesson)
                        db.commit()

                        # Add 5 exercises using the language configuration
                        exercises = [
                            Exercise(
                                lesson_id=lesson.id,
                                type="multiple_choice",
                                instruction="Select the correct translation",
                                question="The boy",
                                correct_answer=cfg["ex1_correct"],
                                order=1
                            ),
                            Exercise(
                                lesson_id=lesson.id,
                                type="translate_word_bank",
                                instruction="Translate this sentence",
                                question="The girl drinks water",
                                correct_answer=cfg["ex2_correct"],
                                order=2
                            ),
                            Exercise(
                                lesson_id=lesson.id,
                                type="fill_blank",
                                instruction="Fill in the blank",
                                question=cfg["ex3_question"],
                                correct_answer=cfg["ex3_correct"],
                                order=3
                            ),
                            Exercise(
                                lesson_id=lesson.id,
                                type="type_answer",
                                instruction="Type the correct English translation",
                                question=cfg["ex4_question"],
                                correct_answer=cfg["ex4_correct"],
                                order=4
                            ),
                            Exercise(
                                lesson_id=lesson.id,
                                type="match_pairs",
                                instruction="Match the pairs",
                                question=cfg["ex5_q"],
                                correct_answer=cfg["ex5_c"],
                                order=5
                            )
                        ]

                        for ex in exercises:
                            db.add(ex)
                            db.commit()

                            if ex.type == "multiple_choice":
                                for opt_text, is_corr in cfg["ex1_opts"]:
                                    db.add(ExerciseOption(exercise_id=ex.id, option_text=opt_text, is_correct=is_corr))
                            elif ex.type == "translate_word_bank":
                                for w_idx, w in enumerate(cfg["ex2_opts"]):
                                    db.add(ExerciseOption(
                                        exercise_id=ex.id,
                                        option_text=w,
                                        is_correct=(w in cfg["ex2_correct"].split()),
                                        word_order=w_idx
                                    ))
                            elif ex.type == "fill_blank":
                                for opt_text, is_corr in cfg["ex3_opts"]:
                                    db.add(ExerciseOption(exercise_id=ex.id, option_text=opt_text, is_correct=is_corr))
                            elif ex.type == "match_pairs":
                                for w in cfg["ex5_opts"]:
                                    db.add(ExerciseOption(exercise_id=ex.id, option_text=w, is_correct=True))
                            db.commit()

        print("Seeding default user and leaderboard competitors...")
        # Default user
        learner = User(
            username="learner",
            email="learner@duo.com",
            hearts=5,
            max_hearts=5,
            xp=45,
            streak=2,
            crowns=1,
            active_course_id=first_course_id
        )
        db.add(learner)
        db.commit()

        # Seed initial daily goal
        goal = DailyGoal(
            user_id=learner.id,
            xp_goal=50,
            date=datetime.now(timezone.utc),
            is_completed=False
        )
        db.add(goal)

        # Seed leaderboard entries
        competitors = [
            ("DuoOwl", 350),
            ("Zari", 280),
            ("Lily", 210),
            ("Oscar", 180),
            ("Junior", 120),
            ("Eddy", 90),
            ("Lucy", 75)
        ]
        
        # Add competitors to User table first
        for name, xp_val in competitors:
            comp_user = User(
                username=name,
                email=f"{name.lower()}@duo.com",
                hearts=5,
                xp=xp_val,
                streak=5,
                crowns=3,
                active_course_id=first_course_id
            )
            db.add(comp_user)
            db.commit()

            # Add to leaderboard
            db.add(Leaderboard(
                user_id=comp_user.id,
                weekly_xp=xp_val,
                week_start=datetime.now(timezone.utc) - timedelta(days=2)
            ))
        
        # Add the main learner to the leaderboard
        db.add(Leaderboard(
            user_id=learner.id,
            weekly_xp=45,
            week_start=datetime.now(timezone.utc) - timedelta(days=2)
        ))
        db.commit()

        print("Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
