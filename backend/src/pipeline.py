from src.parser import extract_text_from_pdf
from src.preprocess import preprocess_text
from src.embedder import get_embedding
from src.similarity import compute_similarity
from src.skill_extractor import extract_skills
from src.scorer import skill_match_score
from src.explainer import generate_explanation

def analyze_resume(resume_path, job_description):   # ✅ renamed

    resume_text = extract_text_from_pdf(resume_path)

    clean_resume = preprocess_text(resume_text)
    clean_jd = preprocess_text(job_description)

    resume_vec = get_embedding(clean_resume)
    jd_vec = get_embedding(clean_jd)

    similarity_score = compute_similarity(resume_vec, jd_vec)

    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)

    skill_score, matched_skills = skill_match_score(resume_skills, jd_skills)

    final_score = (0.6 * similarity_score) + (0.4 * skill_score)

    missing_skills = list(set(jd_skills) - set(resume_skills))

    explanation = generate_explanation(matched_skills, missing_skills, final_score)

    return {
        "match_score": float(round(final_score * 100, 2)),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "explanation": explanation
    }