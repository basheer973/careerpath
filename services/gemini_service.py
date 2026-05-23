import os
import json
import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def get_ai_results(category, sector, role, filters, page):

    prompt = f"""

    Find 15 active {category} opportunities.

    Sector:
    {sector}

    Role:
    {role}

    Filters:
    {filters}

    Page Number:
    {page}

    Requirements:

    - Only active opportunities
    - Real companies only
    - Provide direct apply links
    - No fake opportunities

    Provide data in JSON array format.

    Each object must contain:

    {{
        "company":"",
        "role":"",
        "location":"",
        "mode":"",
        "stipend":"",
        "salary":"",
        "duration":"",
        "qualification":"",
        "experience":"",
        "deadline":"",
        "short_description":"",
        "apply_link":""
    }}

    Return JSON only.
    """

    try:

        response = model.generate_content(prompt)

        text = response.text

        text = text.replace("```json", "")
        text = text.replace("```", "")

        data = json.loads(text)

        return data

    except Exception as e:

        print("GEMINI ERROR:", e)

        return []
