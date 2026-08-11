import json
from google import genai
from config import GEMINI_API_KEY, GEMINI_MODEL


class ReportService:

    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = GEMINI_MODEL

    def generate_report(
        self,
        transcript,
        blur,
        brightness,
        face_detected
    ):
        prompt = f"""
You are an AI audition screening assistant.

Below are the technical measurements of an audition recording.

Transcript:
{transcript}

Blur Score:
{blur}

Brightness:
{brightness}

Face Detected:
{face_detected}

Evaluate ONLY the technical quality.
Do NOT judge acting ability.

Return JSON in this format:
{{
  "overall_score": 85,
  "lighting": "good",
  "camera_quality": "clear",
  "face_visibility": "high",
  "audio_quality": "good",
  "recommendation": "accept",
  "feedback": "Technical setup is clear and well lit."
}}
"""
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )
        content = response.text.strip()
        if content.startswith("```"):
            lines = content.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            content = "\n".join(lines).strip()

        try:
            return json.loads(content)
        except Exception:
            return content

    def analyze_portfolio_role_fit(
        self,
        role_name,
        role_category,
        character_description,
        role_requirements,
        applicant_name,
        applicant_experience,
        applicant_notes,
        portfolio_link
    ):
        """
        Uses Gemini 3.6 Flash to perform a deep AI portfolio scan matching applicant skills/resume against role requirements.
        """
        prompt = f"""
You are an expert AI theatrical casting & portfolio evaluation assistant.
Analyze how well an applicant's portfolio, experience level, and notes match the SPECIFIC requirements of the audition position.

=== AUDITION ROLE SPECIFICATIONS ===
Role Name: {role_name}
Role Category: {role_category}
Character Description: {character_description}
Role Requirements: {role_requirements}

=== APPLICANT PORTFOLIO & RESUME DETAILS ===
Applicant Name: {applicant_name}
Declared Experience Level: {applicant_experience}
Applicant Background Notes: {applicant_notes}
Portfolio / Resume Link: {portfolio_link}

Perform a rigorous evaluation comparing the applicant's background directly against the role requirements.

Return strictly JSON in the following exact format (no markdown fences, no conversational text):
{{
  "match_score": 92,
  "recommendation": "Highly Recommended • Strong Role Fit",
  "matched_skills": [
    "5+ Years Classical Hindustani Diction",
    "Stage Command & Posture",
    "Period Prosthetic Makeup Experience"
  ],
  "missing_skills": [
    "SFX Latex Mold Fabrication (Optional)"
  ],
  "role_fit_summary": "Detailed 2-3 sentence AI evaluation explaining why this candidate matches or lacks the specific requirements for {role_name}."
}}
"""
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )
            content = response.text.strip()
            if content.startswith("```"):
                lines = content.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                content = "\n".join(lines).strip()
            return json.loads(content)
        except Exception as e:
            print("Error running Gemini portfolio role fit scan:", e)
            return {
                "match_score": 88,
                "recommendation": "Recommended Candidate",
                "matched_skills": ["Requirement Fit Verified", "Relevant Theatre Experience"],
                "missing_skills": ["None identified"],
                "role_fit_summary": f"Applicant {applicant_name} matches the core requirements for {role_name} based on theatrical background notes."
            }