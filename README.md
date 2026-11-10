# 🎵 PreZify – Full-Stack Music Streaming Platform

> *"Feel Every Beat. Live Every Moment."*

PreZify is a commercial-grade, full-stack music streaming platform featuring a decoupled **Frontend Client** and **Backend REST API & Audio Streaming Server**. Built with a dark cyber-luxury aesthetic, glassmorphic UI elements, dynamic audio visualizers, and responsive controls, PreZify delivers an Apple Music, Spotify, and YouTube Music grade listening experience directly in the browser.

---

## 🗂️ Project Architecture

```
PreZify/
│
├── backend/                        # BACKEND REST API & AUDIO STREAMING SERVER
│   ├── server.js                   # Node.js HTTP Server & Streaming Engine (Zero dependencies)
│   ├── server.py                   # Python 3 alternative Server (Zero dependencies)
│   ├── package.json                # NPM configuration
│   └── data/                       # Database files
│       ├── songs.json              # Music catalog with durations, lyrics & metadata
│       ├── playlists.json          # Curated & editorial playlists
│       └── artists.json            # Artist bios, listeners & top tracks
│
├── frontend/                       # FRONTEND CLIENT
│   ├── index.html                  # Semantic HTML5 app shell & view templates
│   ├── style.css                   # Glassmorphic dark luxury stylesheet
│   ├── script.js                   # Web Audio API DSP, visualizers & API client
│   ├── images/                     # High-resolution artwork & avatars
│   │   ├── logo.png                # Official PreZify glowing soundwave logo
│   │   ├── default-cover.jpg       # Default album artwork fallback
│   │   ├── cover1.jpg - cover6.jpg # Curated album covers
│   │   └── artist1.jpg - artist4.jpg# Artist avatars
│   └── songs/                      # Playable MP3 tracks
│       ├── song1.mp3               # "Midnight Lo-Fi" (Aura Beats)
│       ├── song2.mp3               # "Neon Horizon" (Kavinsky Waves)
│       ├── song3.mp3               # "Ethereal Echoes" (Celeste Moon)
│       ├── song4.mp3               # "Solar Drift" (Hyperion X)
│       ├── song5.mp3               # "Rainy Cafe Nostalgia" (Coffee & Raindrops)
│       └── song6.mp3               # "Starlight Velocity" (Nova Eclipse)
│
├── index.html                      # Root entry point (synced with frontend/index.html)
├── style.css                       # Root stylesheet (synced with frontend/style.css)
├── script.js                       # Root script (synced with frontend/script.js)
├── images/                         # Root images directory
├── songs/                          # Root songs directory
└── README.md                       # Complete documentation
```

---

## 🚀 How to Run the Application

You can launch PreZify in any of the following ways:

### 🖥️ Option 1: Native Windows Desktop App (`PreZify.exe`) - Recommended
- Simply **double-click [`PreZify.exe`](file:///c:/Users/harik/OneDrive/Desktop/newapp/PreZify.exe)** in this folder.
- **What it does**:
  - Automatically launches the embedded high-performance local server with HTTP 206 audio streaming.
  - Opens PreZify in a dedicated, frameless desktop application window (similar to the Spotify desktop app).
  - Places a PreZify icon in the **Windows System Tray** with quick controls (Open PreZify, Open in Browser, About, Exit).
  - No terminal, node, or python installation required!

---

### 🌐 Option 2: Full-Stack Mode (Node.js / Python Backend API)
1. **Start the Backend Server**:
   - Using **Node.js**:
     ```bash
     node backend/server.js
     ```
   - Or using **Python 3**:
     ```bash
     python backend/server.py
     ```
2. **Access the Application**:
   - Open your browser to **`http://localhost:5000`**.
   - The backend server automatically hosts the REST API at `/api/` and serves the frontend client!
   - In the frontend player, the status indicator will show:  
     🟢 **`REST API Backend Online`**

---

### Mode B: Standalone Frontend Mode (VS Code Live Server)
1. Open the project in **Visual Studio Code**.
2. Right-click on [`frontend/index.html`](file:///c:/Users/harik/OneDrive/Desktop/newapp/frontend/index.html) (or root `index.html`).
3. Select **"Open with Live Server"**.
4. The frontend will launch at `http://127.0.0.1:5500/index.html`. PreZify's API client will automatically detect that the backend server is offline and seamlessly engage standalone client mode with embedded metadata and procedural audio fallbacks!

---

## 🔌 Backend REST API Specifications

The PreZify backend exposes the following endpoints (default port: `5000`):

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/songs` | List all songs in the catalog with lyrics, genre, and duration |
| `GET` | `/api/songs/:id` | Retrieve metadata for a specific song |
| `GET` | `/api/songs/:id/stream` | **HTTP 206 Partial Content** audio stream with byte-range seeking |
| `GET` | `/api/playlists` | List curated and custom user playlists |
| `POST` | `/api/playlists` | Create a new custom playlist (`{ title, desc, cover }`) |
| `POST` | `/api/playlists/:id/tracks` | Add a track to an existing playlist (`{ trackId }`) |
| `DELETE` | `/api/playlists/:id` | Delete a playlist |
| `GET` | `/api/artists` | Retrieve popular verified artists with listener statistics |
| `GET` | `/api/search?q=:query` | Full-text search across songs, artists, and playlists |

---

## 🎨 Brand Identity & Design System

- **Primary Background**: `#090B14` (Deep space black)
- **Secondary Background**: `#111525` (Midnight navy)
- **Card Background**: `#171D30` (Glassmorphic dark card)
- **Primary Accent**: `#8B5CF6` (Vivid Royal Violet)
- **Secondary Accent**: `#22D3EE` (Electric Cyan)
- **Main Text**: `#FFFFFF` (Pure white)
- **Secondary Text**: `#A1A1AA` (Muted zinc)
- **Typography**: `Plus Jakarta Sans` & `Space Grotesk` (Google Fonts)

---

## 🎧 Frontend Features

1. **Hi-Fi Playback Engine**:
   - HTML5 Audio API + Web Audio API.
   - Real-time DSP Equalizer presets (**Flat**, **Bass Boost +7dB**, **Crystal Treble**, **Vocal Clarity**, **Club EDM**).
   - Real-time dual frequency visualizer spectrum canvas.
   - Procedural Web Audio Synthesizer fallback.
2. **Fixed Bottom Music Player**:
   - Scrubable seeker bar with hover timestamp preview tooltip and loaded buffer bar.
   - Master Play/Pause, Next, Previous, Shuffle, and 3-state Repeat modes.
   - Playback speed selector (`0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`).
   - Up Next Queue slide-over drawer.
3. **Synchronized Lyrics Soundstage**:
   - Line-by-line synchronized lyrics highlighting with click-to-seek timestamp support.
   - Real-time live frequency spectrum canvas.
4. **Dynamic Views**:
   - Home Dashboard (Spotlight banner, Trending top tracks, Curated playlists, Popular artists, Recommended albums).
   - Discover View (Interactive genre cards and mood soundscapes).
   - Real-time Instant Search (`Ctrl + K`).
   - Liked Songs & Recently Played listening history.
   - Custom Playlist Creator with color theme covers.
5. **LocalStorage Persistence**:
   - Remembers liked songs, custom playlists, recently played tracks, volume level, and equalizer settings.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|:---|:---|
| <kbd>Space</kbd> | Play / Pause playback |
| <kbd>→</kbd> | Seek forward 5 seconds |
| <kbd>←</kbd> | Seek backward 5 seconds |
| <kbd>Shift</kbd> + <kbd>N</kbd> | Next song in queue |
| <kbd>Shift</kbd> + <kbd>P</kbd> | Previous song in queue |
| <kbd>M</kbd> | Mute / Unmute audio |
| <kbd>L</kbd> | Like / Favorite current track |
| <kbd>S</kbd> | Toggle Shuffle mode |
| <kbd>R</kbd> | Cycle Repeat mode (Off → All → One) |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> or <kbd>/</kbd> | Focus global search bar |
| <kbd>Esc</kbd> | Close open modals or drawers |

---

## 📜 License
Created for hackathon demonstration. Royalty-free musical assets and imagery used under Creative Commons / Unsplash licenses.
