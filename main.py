from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import yt_dlp
import os
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/inspect")
async def inspect_video(url: str):
    """Gathers metadata instantly for the preview card."""
    try:
        with yt_dlp.YoutubeDL({'quiet': True}) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "title": info.get('title'),
                "thumbnail": info.get('thumbnail'),
                "uploader": info.get('uploader'),
                "duration": info.get('duration_string'),
                "views": f"{info.get('view_count', 0):,}"
            }
    except Exception as e:
        return {"error": str(e)}

@app.get("/download")
async def download_video(url: str, quality: str = "1080p"):
    try:
        # Dynamically find your PC's Downloads folder
        # This will point to C:\Users\leale\Downloads automatically
        downloads_path = str(Path.home() / "Downloads")

        # Professional format mapping
        format_map = {
            "1080p": "bestvideo[height<=1080]+bestaudio/best",
            "720p": "bestvideo[height<=720]+bestaudio/best",
            "480p": "bestvideo[height<=480]+bestaudio/best",
            "mp3": "bestaudio/best"
        }

        selected_format = format_map.get(quality, "best")

        ydl_opts = {
            'format': selected_format,
            # Updated to save directly to your system Downloads folder
            'outtmpl': f'{downloads_path}/%(title)s.%(ext)s',
            # Using your specific FFmpeg path found earlier
            'ffmpeg_location': 'C:\\Users\\leale\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-7.1-full_build\\bin',
            'noplaylist': True,
        }

        if quality == "mp3":
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        return {"status": "success", "path": downloads_path}
    except Exception as e:
        print(f"CRITICAL FAILURE: {str(e)}")
        return {"status": "error", "error": str(e)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)