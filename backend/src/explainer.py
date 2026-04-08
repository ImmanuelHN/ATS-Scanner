def generate_explanation(matched_skills, missing_skills, score):
    score_pct = round(score * 100, 2)
    total_skills = len(matched_skills) + len(missing_skills)
    match_ratio = len(matched_skills) / total_skills if total_skills > 0 else 0

    explanation = "Candidate Evaluation:\n"

    if matched_skills:
        explanation += f"\n✔ Strong in: {', '.join(matched_skills)}"

    if missing_skills:
        explanation += f"\n❌ Missing: {', '.join(missing_skills)}"

    explanation += "\n\nDetailed Analysis:\n"

    if score_pct >= 80:
        explanation += "• Semantic alignment: Excellent — candidate's profile strongly mirrors the JD context.\n"
    elif score_pct >= 60:
        explanation += "• Semantic alignment: Good — meaningful overlap with the job description.\n"
    elif score_pct >= 40:
        explanation += "• Semantic alignment: Moderate — partial relevance detected.\n"
    else:
        explanation += "• Semantic alignment: Low — significant mismatch with the job description.\n"

    if total_skills > 0:
        coverage_pct = round(match_ratio * 100)
        explanation += f"• Skill coverage: {coverage_pct}% ({len(matched_skills)}/{total_skills} required skills found).\n"

    if score_pct >= 60:
        explanation += f"• ATS Filter: PASS — score {score_pct}% exceeds typical 60% threshold.\n"
    else:
        explanation += f"• ATS Filter: RISK — score {score_pct}% may not clear automated screening.\n"

    explanation += "\nFinal Verdict:\n"

    if score_pct >= 80 and not missing_skills:
        explanation += "Excellent match. Candidate meets all requirements. Strongly recommend for interview."
    elif score_pct >= 75:
        explanation += "Excellent candidate. Minor gaps exist but overall profile is compelling."
    elif score_pct >= 60 and missing_skills:
        explanation += "Good candidate but lacks some skills. Recommend screening call to assess upskilling potential."
    elif score_pct >= 40:
        explanation += "Partial match. Candidate shows potential but requires significant skill development."
    else:
        explanation += "Candidate is missing critical skills. Not recommended for this role at this stage."

    return explanation
