import os
import re
import yt_dlp
from pathlib import Path
from pydantic import BaseModel
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AbaySteam Backend Node")

# --- CROSS-ORIGIN RESOURCE SHARING (CORS) ---
# This allows your React frontend to communicate with this Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- IN-MEMORY DATABASE ---
# Stores real-time progress for each download task
progress_db = {}


class DownloadRequest(BaseModel):
    url: str
    quality: str = "1080p"


def clean_ansi(text: str) -> str:
    """Strips terminal color codes from yt-dlp output to get clean percentages."""
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    return ansi_escape.sub('', text).strip()


def progress_hook(d):
    """Intercepts yt-dlp internal data to update our progress tracker."""
    task_id = d.get('info_dict', {}).get('id', 'unknown')

    if d['status'] == 'downloading':
        percent = clean_ansi(d.get('_percent_str', '0%'))
        progress_db[task_id] = {
            "status": "downloading",
            "percent": percent
        }
    elif d['status'] == 'finished':
        # Once download is done, FFmpeg begins merging
        progress_db[task_id] = {
            "status": "merging",
            "percent": "100%"
        }


def run_download(url: str, quality: str, task_id: str):
    """The core engine that handles the high-quality extraction."""
    # Smart path logic to find your Windows Downloads folder automatically
    downloads_path = str(Path.home() / "Downloads")

    # Configure quality based on user selection
    format_selector = 'bestvideo[height<=1080]+bestaudio/best'
    if quality == "mp3":
        format_selector = 'bestaudio/best'
    elif quality == "720p":
        format_selector = 'bestvideo[height<=720]+bestaudio/best'

    ydl_opts = {
        'format': format_selector,
        # Verbatim path for your FFmpeg installation
        'ffmpeg_location': 'C:\\Users\\leale\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.WinGet.Source_8wekyb3d8bbwe\\ffmpeg-7.1-full_build\\bin',        'outtmpl': f'{downloads_path}/%(title)s.%(ext)s',
        'noplaylist': True,
        'progress_hooks': [progress_hook],
    }

    if quality == "mp3":
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }]

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        progress_db[task_id] = {"status": "finished", "percent": "100%"}
    except Exception as e:
        print(f"Extraction Error: {e}")
        progress_db[task_id] = {"status": "error", "percent": "0%"}


# --- ENDPOINTS ---

@app.get("/inspect")
async def inspect_link(url: str):
    """Quickly fetches metadata for the visual preview on your UI."""
    try:
        with yt_dlp.YoutubeDL({'quiet': True}) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "title": info.get('title'),
                "thumbnail": info.get('thumbnail'),
                "uploader": info.get('uploader'),
                "duration": f"{info.get('duration') // 60}:{info.get('duration') % 60:02d}",
                "views": f"{info.get('view_count', 0):,}",
                "id": info.get('id')
            }
    except Exception as e:
        return {"error": str(e)}


@app.post("/extract")
async def start_extraction(req: DownloadRequest, background_tasks: BackgroundTasks):
    """Initiates the download in the background and returns the task ID."""
    try:
        # Get ID without downloading to initialize the progress tracker
        with yt_dlp.YoutubeDL({'quiet': True}) as ydl:
            info = ydl.extract_info(req.url, download=False)
            task_id = info.get('id')

        # Initialize the 'brain'
        progress_db[task_id] = {"status": "starting", "percent": "0%"}

        # Start the background thread
        background_tasks.add_task(run_download, req.url, req.quality, task_id)

        return {"task_id": task_id, "status": "initiated"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/progress/{task_id}")
async def get_progress(task_id: str):
    """Called by the React progress bar every second."""
    return progress_db.get(task_id, {"status": "waiting", "percent": "0%"})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)