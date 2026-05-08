🌊 ABAYSTEAM | Premium Media Hub

The Flow of Content. An enterprise-grade, full-stack media extraction platform built for speed, security, and a futuristic user experience.

🚀 Overview


<img width="1280" height="561" alt="image" src="https://github.com/user-attachments/assets/d6b3d511-a8d8-42c9-8100-f8b44e7bee19" />



AbaySteam is a high-impact SaaS application designed to streamline media retrieval. Inspired by the powerful flow of the Blue Nile, the platform provides a seamless "Neural Link" between global content and local storage. It features a glassmorphism UI, real-time metadata probing, and high-fidelity merging for 1080p+ resolutions.

Core Capabilities
Intelligent Probing: Instant visual preview of thumbnails, titles, and creator data upon link detection.

High-Fidelity Extraction: Support for 1080p, 720p, 480p, and HQ MP3 formats.

System-Direct Storage: Downloads are routed directly to the user's official Windows Downloads folder (C:\Users\leale\Downloads).

Futuristic UI/UX: A "Deep Space" themed dashboard with responsive sidebar navigation and a custom-branded Favicon.

🛠️ Technical Architecture
The project utilizes a decoupled Service-Oriented Architecture (SOA) to ensure scalability and performance.

Frontend (The Command Center)
React + Vite: High-speed frontend framework.

Tailwind CSS: Utility-first styling for glassmorphism effects.

Lucide Icons: Coordinated "Waves & Zap" iconography for premium branding.

Axios: Manages asynchronous "Uplinks" to the backend node.

Backend (The System Core)
FastAPI: Asynchronous Python framework for high-concurrency requests.

yt-dlp Engine: Advanced media extraction logic.

FFmpeg Integration: Industry-standard media processing for stream merging.

📦 Installation & Setup
1. Prerequisites
Python 3.10+

Node.js & npm

FFmpeg: Must be installed and linked in main.py.

2. Backend Configuration
Bash
# Install dependencies
pip install fastapi uvicorn yt-dlp

# Set FFmpeg Path in main.py
FFMPEG_PATH = "C:\\Users\\leale\\AppData\\Local\\...\\bin"

# Start the Node
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
3. Frontend Deployment
Bash
# Navigate to client directory
npm install
npm run dev
🗺️ Future Roadmap
Following the initial AbaySteam vision, the next development cycles will introduce:

Ethio-Discovery Engine: A dedicated portal for trending regional content and local creator spotlights.

Multi-User Auth: JWT-based login with personal "Creator Vaults" for saved media.

Real-Time Progress: WebSocket integration to provide a percentage-based visual loading bar for large extractions.

Cloud Sync: Optional integration with cloud storage providers for cross-device access.

AI Transcription: Automatic subtitle generation and summary tools for downloaded educational content.

⚖️ Disclaimer & Fair Use
AbaySteam is designed as a personal productivity tool. Users must respect copyright laws and the Terms of Service of content providers. The platform includes clear disclaimers regarding legal usage and content ownership.
