from src.skills import SKILLS
from rapidfuzz import fuzz
import re

def extract_skills(text):
    text_clean = re.sub(r'[^\w\s]', ' ', text.lower())
    words = text_clean.split()

    found_skills = []

    for skill in SKILLS:
        if len(skill) <= 4:
            if skill in words:
                found_skills.append(skill)
        else:
            if skill in text_clean:
                found_skills.append(skill)
            else:
                score = fuzz.partial_ratio(skill, text_clean)
                if score > 85:
                    found_skills.append(skill)

    return list(set(found_skills))