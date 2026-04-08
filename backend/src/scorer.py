def skill_match_score(resume_skills, jd_skills):
    if len(jd_skills) == 0:
        return 0, []

    matched = set(resume_skills) & set(jd_skills)
    return len(matched) / len(jd_skills), list(matched)