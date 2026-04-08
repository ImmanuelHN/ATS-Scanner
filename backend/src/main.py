from parser import extract_text_from_pdf
from preprocess import preprocess_text
from embedder import get_embedding 
from similarity import compute_similarity
from explainer import generate_explanation
from skill_extractor import extract_skills
from scorer import skill_match_score

resume_text = extract_text_from_pdf("../data/IMMANUEL HN SE.pdf")

job_description = """
Looking for a Python developer with experience in machine learning,
data analysis, aws and SQL.
"""
#preprocess
clean_resume = preprocess_text(resume_text)
clean_jd = preprocess_text(job_description)

#embedding
resume_vec = get_embedding(clean_resume)
jd_vec = get_embedding(clean_jd)

#similarity
similarity = compute_similarity(resume_vec, jd_vec)

#skills extraction
resume_skills = extract_skills(resume_text)
jd_skills = extract_skills(job_description)

print("JD Skills:", jd_skills)
print("Resume Skills:", resume_skills)

#skill matching
skill_score, matched_skills = skill_match_score(resume_skills, jd_skills)

#final score
final_score = (0.6 * similarity) + (0.4 * skill_score)

#missing skills
missing_skills = list(set(jd_skills) - set(resume_skills))

explanation = generate_explanation(matched_skills, missing_skills, final_score)

print("\n==============================")
print("ATS Resume Evaluation Result")
print("==============================\n")

print(f"Match Score: {round(final_score * 100, 2)}%\n")

print(f"Matched Skills: {matched_skills}")
print(f"Missing Skills: {missing_skills}")

print(explanation)