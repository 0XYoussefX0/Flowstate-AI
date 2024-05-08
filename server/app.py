from youtube_transcript_api import YouTubeTranscriptApi
from flask import Flask, request
from youtube_transcript_api.formatters import TextFormatter
#next line is from chatgpt
from flask_cors import CORS

app = Flask(__name__)

#next line is from chatgpt
CORS(app)

@app.route("/youtube_transcript", methods=["GET"])
def getYoutubeTranscript():
    video_id = request.args.get('videoId')
    try: 
        transcript = YouTubeTranscriptApi.get_transcript(video_id=video_id)
    except:
        return "Subtitles are disabled for this video", 500
    textFormatter = TextFormatter()
    formatted = textFormatter.format_transcript(transcript)
    return {"transcript": formatted}
