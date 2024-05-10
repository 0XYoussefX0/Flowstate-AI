from typing import Any
from youtube_transcript_api import YouTubeTranscriptApi
from flask import Flask, request
from youtube_transcript_api.formatters import TextFormatter
from flask_cors import CORS
import google.generativeai as genai
from load_creds import load_creds

app = Flask(__name__)

#next 5 lines are from chatgpt
CORS(app, resources={r"/verdict": {"origins": "https://www.youtube.com", "methods": ["POST"]}})
def chop_text(text, num_words=200):
    words = text.split()
    chopped_text = ' '.join(words[:num_words])
    return chopped_text

# Check if a value is a non-empty string made by ChatGPT :)
def is_non_empty_string(value):
    return isinstance(value, str) and value.strip() != ""

generation_config = {
  "temperature": 0.9,
  "top_p": 1,
  "top_k": 0,
  "max_output_tokens": 8192,
}

safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_NONE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_NONE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_NONE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_NONE"
  },
]

creds = load_creds()

genai.configure(credentials=creds)

model = genai.GenerativeModel(model_name="tunedModels/tuning-test-3-ixwfs2wkakqh",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

@app.route("/verdict", methods=["POST"])
def getVerdict():
    request_data: Any = request.get_json()
    if not isinstance(request_data, dict):
        return "Invalid Data", 400
  
    video_id = request_data.get("video_id")
    goal = request_data.get("goal")
    
    if video_id is None or not is_non_empty_string(video_id):
        return "Video id is not provided or it's not a string", 400
    if goal is None or not is_non_empty_string(goal):
        return "goal is not provided or it's not a string", 400
    
    try: 
        transcript = YouTubeTranscriptApi.get_transcript(video_id=video_id)
    except:
        return "Subtitles are disabled for this video", 500
    textFormatter = TextFormatter()
    formatted = textFormatter.format_transcript(transcript)
    transcriptSnippet = chop_text(formatted)

    prompt = f"Goal: {goal}\nVideo Transcript: {transcriptSnippet}"
    response = model.generate_content(prompt)
   
    responseWords = response.text.split()
    if responseWords[1] == "Not" :
       verdict = " ".join(responseWords[1:3])
       encouragement = " ".join(responseWords[5:]) 
    else:
       verdict = " ".join(responseWords[1:2])
       encouragement = " ".join(responseWords[4:]) 
   
    return {"verdict": verdict, "encouragement": encouragement}