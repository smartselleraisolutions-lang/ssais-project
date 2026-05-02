import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()
import imageio_ffmpeg as ffmpeg
import subprocess
import sys

 

from faster_whisper import WhisperModel
from pyannote.audio import Pipeline
from flask_cors import CORS

import librosa
import torch

 
# -------------------------
# INIT APP
# -------------------------
app = Flask(__name__)
@app.route("/")
def home():
    return "SSAIS API is running 🚀"

CORS(app, origins=["https://ssais-project.vercel.app"])
app.config['MAX_CONTENT_LENGTH'] = 200 * 1024 * 1024  # 200MB

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 🔐 Add your HuggingFace token here
HF_TOKEN = os.environ.get("HF_TOKEN")

# -------------------------
# LOAD MODELS (only once)
# -------------------------
print("🚀 Loading models...")

whisper_model = WhisperModel(
    "large-v3",  # change to small for faster
    compute_type="int8"
)

pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1",
    token=HF_TOKEN
)

print("✅ Models loaded")

# -------------------------
# CONVERT VIDEO → AUDIO
# -------------------------
def convert(input_file, output_file):
    try:
        # Check if input file exists
        if not os.path.exists(input_file):
            print(f"❌ Input file not found: {input_file}")
            return

        # Get FFmpeg executable path (auto download)
        ffmpeg_path = ffmpeg.get_ffmpeg_exe()

        print("✅ Using FFmpeg at:", ffmpeg_path)
        print("🎬 Converting video...")

        # Run FFmpeg command
        result = subprocess.run(
            [
                ffmpeg_path,
                "-i", input_file,
                output_file
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Check result
        if result.returncode == 0:
            print(f"✅ Conversion successful: {output_file}")
        else:
            print("❌ FFmpeg error:")
            print(result.stderr)

    except Exception as e:
        print("❌ Unexpected error:", str(e))
# -------------------------
# LOAD AUDIO
# -------------------------
def load_audio(audio_path):
    waveform, sr = librosa.load(audio_path, sr=16000, mono=True)
    return torch.tensor(waveform).unsqueeze(0), sr

# -------------------------
# SPEAKER DIARIZATION
# -------------------------
def get_speakers(audio_path):
    waveform, sr = load_audio(audio_path)

    diarization = pipeline({
        "waveform": waveform,
        "sample_rate": sr
    })

    annotation = diarization.speaker_diarization

    speakers = []
    for segment, _, speaker in annotation.itertracks(yield_label=True):
        speakers.append({
            "start": segment.start,
            "end": segment.end,
            "speaker": speaker
        })

    return speakers

# -------------------------
# TRANSCRIPTION
# -------------------------
def transcribe(audio_path):
    segments, _ = whisper_model.transcribe(
        audio_path,
        task="translate"  # Tamil → English
    )
    return list(segments)

# -------------------------
# MATCH SPEAKER
# -------------------------
def get_speaker(seg, speakers):
    best = "Speaker"
    max_overlap = 0

    for spk in speakers:
        overlap = max(0, min(seg.end, spk["end"]) - max(seg.start, spk["start"]))
        if overlap > max_overlap:
            max_overlap = overlap
            best = spk["speaker"]

    return best

# -------------------------
# MERGE RESULTS
# -------------------------
def merge(segments, speakers):
    results = []

    for seg in segments:
        results.append({
            "time": f"{int(seg.start//60):02d}:{int(seg.start%60):02d}",
            "speaker": get_speaker(seg, speakers),
            "text": seg.text
        })

    return results

# -------------------------
# TEST ROUTE
# -------------------------
@app.route("/test")
def test():
    return "✅ API is working"

# -------------------------
# MAIN PROCESS ROUTE
# -------------------------
@app.route("/process", methods=["POST"])
def process():

    if "video" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["video"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        video_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(video_path)

        audio_path = video_path + ".wav"

        print("🎬 Converting video...")
        convert(video_path, audio_path)

        print("👥 Detecting speakers...")
        speakers = get_speakers(audio_path)

        print("🧠 Transcribing...")
        segments = transcribe(audio_path)

        print("🔗 Merging results...")
        results = merge(segments, speakers)

        return jsonify(results)

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

# -------------------------
# RUN APP
# -------------------------
 
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Render provides PORT
    app.run(host="0.0.0.0", port=port)