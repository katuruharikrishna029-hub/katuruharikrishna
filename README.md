# 🎵 PreZify – Premium Music Streaming Platform

> *"Feel Every Beat. Live Every Moment."*

PreZify is a commercial-grade, modern, and responsive music streaming web application built with vanilla web technologies (HTML5, CSS3, JavaScript, Web Audio API). Designed with a dark cyber-luxury aesthetic, glassmorphic UI elements, dynamic audio visualizers, and responsive controls, PreZify delivers an Apple Music & Spotify grade listening experience directly in the browser.

---

## 🚀 Live Demo & Getting Started

PreZify is 100% client-side and requires no build steps or heavy node frameworks. It is designed to run seamlessly in **VS Code Live Server** or any static web server.

### Running with VS Code Live Server:
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey) if you haven't already.
3. Right-click `index.html` and select **"Open with Live Server"** (or click "Go Live" on the bottom status bar).
4. Your default browser will launch PreZify at `http://127.0.0.1:5500/index.html`.

---

## 🎨 Brand Identity & Design System

PreZify implements a tailored, modern visual language:

- **Primary Background**: `#090B14` (Deep space black)
- **Secondary Background**: `#111525` (Subtle midnight navy)
- **Card Background**: `#171D30` (Glassmorphic dark card)
- **Primary Accent**: `#8B5CF6` (Vivid Royal Violet)
- **Secondary Accent**: `#22D3EE` (Electric Cyan)
- **Main Text**: `#FFFFFF` (Pure white)
- **Secondary Text**: `#A1A1AA` (Muted zinc)
- **Typography**: `Plus Jakarta Sans` & `Space Grotesk` (Google Fonts)
- **Iconography**: Bootstrap Icons

---

## ✨ Key Features

### 🎧 1. Hi-Fi Audio Playback Engine
- Built with the native **HTML5 Audio API** and extended with the **Web Audio API**.
- Real-time Web Audio DSP Equalizer presets (**Flat**, **Bass Boost (+7dB)**, **Crystal Treble**, **Vocal Clarity**, **Club EDM**).
- Dual Live Frequency Visualizer Spectrum (compact real-time spectrum in the bottom bar + full frequency canvas in the Lyrics Soundstage).
- Procedural Web Audio Synthesizer fallback to ensure sound never drops even in offline scenarios.

### 🎛️ 2. Fixed Bottom Music Player
- Track metadata with album artwork, animated equalizer bars, and artist links.
- Interactive Seeker bar with loaded buffer indicator, hover timestamp preview tooltip, and smooth scrub/drag capabilities.
- Full playback controls:
  - **Play / Pause** with animated state switching.
  - **Next / Previous** track transitions.
  - **Shuffle Mode** powered by the Fisher-Yates algorithm.
  - **Repeat Mode** (Off, Repeat All, Repeat One).
  - **Playback Speed Selector** (0.75x, 1.0x, 1.25x, 1.5x, 2.0x).
  - **Dynamic Volume Slider** with one-click Mute/Unmute.
  - **Live Playing Queue Drawer** ("Up Next") with track removal.

### 🌟 3. Views & Navigation
- **Home Dashboard**:
  - Featured Spotlight Banner with direct playback, favorite toggle, and share action.
  - Quick genre filtering chips (**Synthwave**, **Lo-Fi**, **Electronic**, **Ambient**, **Chillhop**, **Cyberpunk**).
  - Trending Songs with ranked badges (#01–#06), duration, play count, and favorite buttons.
  - Editorial Curated Playlists hand-crafted for focus, workouts, and night drives.
  - Popular Artists with circular avatars and follower metrics.
  - Recommended Albums and New Releases.
- **Explore / Discover**:
  - Colorful genre tiles with rich gradients.
  - Mood & Activity soundscapes (Late Night Coding, Hyper Drive, Cosmic Deep Sleep, 80s Neon Sunset).
- **Global Instant Search**:
  - Fast client-side search across song titles, artists, albums, and genres.
  - Dedicated "Top Match" highlight card and tabular song match list.
  - Global `Ctrl + K` or `/` shortcut activation.
- **My Library**:
  - Liked Songs collection.
  - Recently Played listening history.
  - Custom User Playlists.
- **Liked Songs View**:
  - Dedicated playlist page with play all, shuffle play, total run time calculation, and song management.
- **Playlist & Artist Detail Views**:
  - Dynamic route rendering with full track tables, follow/play buttons, and playlist deletion.
- **Synchronized Lyrics & Soundstage**:
  - Line-by-line synchronized lyrics highlighting with click-to-seek timestamp support.
  - Dedicated live frequency spectrum canvas.

### 💾 4. Persistence & Personalization
- **LocalStorage Data Persistence**:
  - Saved Liked Songs (hearts state).
  - Custom User Playlists (create custom playlists with color theme covers and add tracks).
  - Recently Played session history (with "Clear History" option).
  - Selected Volume level, Shuffle state, and Repeat state.
  - Equalizer presets and Custom Accent Color themes (**Royal Violet**, **Cyber Cyan**, **Neon Pink**, **Emerald Matrix**).

### 🔔 5. Modals, Notifications & Extra Polish
- **Create Playlist Modal**: Custom name, description, and color gradient cover picker.
- **Add to Playlist Modal**: Quick one-click dialog to attach tracks to any personal playlist.
- **Settings & Equalizer Modal**: Streaming audio quality selector (Normal 160kbps, High 320kbps, Lossless Hi-Fi), equalizer presets, playback crossfade duration slider (0–10s), and accent theme customizer.
- **Premium Subscription Modal**: Commercial pricing comparison (Free vs Plus vs Family) with interactive upgrade simulation.
- **Interactive Glassmorphic Toasts**: Real-time feedback for all user actions.
- **Notification Popover**: System updates, high-fidelity alerts, and mark all read toggle.
- **Mobile Responsive Experience**: Mobile navigation drawer, responsive hamburger menu, and mobile bottom navigation bar.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|:---|:---|
| <kbd>Space</kbd> | Play / Pause playback |
| <kbd>→</kbd> (Right Arrow) | Seek forward 5 seconds |
| <kbd>←</kbd> (Left Arrow) | Seek backward 5 seconds |
| <kbd>Shift</kbd> + <kbd>N</kbd> | Next song in queue |
| <kbd>Shift</kbd> + <kbd>P</kbd> | Previous song in queue |
| <kbd>M</kbd> | Mute / Unmute audio |
| <kbd>L</kbd> | Like / Favorite current track |
| <kbd>S</kbd> | Toggle Shuffle mode |
| <kbd>R</kbd> | Cycle Repeat mode (Off → All → One) |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> or <kbd>/</kbd> | Focus global search bar |
| <kbd>Esc</kbd> | Close open modals or drawers |

---

## 📁 Project Architecture

```
PreZify/
│
├── index.html              # Core semantic HTML5 application shell & view templates
├── style.css               # Complete brand stylesheet, glassmorphism, responsive styles
├── script.js               # AudioEngine, UI controller, state management, visualizers
│
├── images/
│   ├── logo.png            # Official PreZify high-resolution brand logo
│   ├── default-cover.jpg   # Default album artwork fallback
│   ├── cover1.jpg          # Album cover: Tokyo Rain Reflections (Aura Beats)
│   ├── cover2.jpg          # Album cover: Cyber Drive 2099 (Kavinsky Waves)
│   ├── cover3.jpg          # Album cover: Deep Cosmos (Celeste Moon)
│   ├── cover4.jpg          # Album cover: Velocity & Bass (Hyperion X)
│   ├── cover5.jpg          # Album cover: Cozy Afternoons (Coffee & Raindrops)
│   ├── cover6.jpg          # Album cover: Stellar Journey (Nova Eclipse)
│   ├── artist1.jpg         # Artist avatar: Aura Beats
│   ├── artist2.jpg         # Artist avatar: Kavinsky Waves
│   ├── artist3.jpg         # Artist avatar: Celeste Moon
│   └── artist4.jpg         # Artist avatar: Hyperion X
│
├── songs/
│   ├── song1.mp3           # Genuine full-length audio: Midnight Lo-Fi
│   ├── song2.mp3           # Genuine full-length audio: Neon Horizon
│   ├── song3.mp3           # Genuine full-length audio: Ethereal Echoes
│   ├── song4.mp3           # Genuine full-length audio: Solar Drift
│   ├── song5.mp3           # Genuine full-length audio: Rainy Cafe Nostalgia
│   └── song6.mp3           # Genuine full-length audio: Starlight Velocity
│
└── README.md               # Technical documentation & usage instructions
```

---

## 🧪 Testing & Validation Checklist

- [x] Audio playback starts, pauses, resumes, and seeks without error.
- [x] Previous and Next track controls transition smoothly.
- [x] Shuffle mode randomizes queue properly without losing track references.
- [x] Repeat modes (All and One) cycle and function as expected.
- [x] Real-time audio visualizers animate smoothly across bottom bar and lyrics soundstage.
- [x] Synchronized lyrics highlight in sync with audio time progression and allow click-to-seek.
- [x] Live search returns instant matches with top result highlight.
- [x] Adding/removing favorites updates badges and persists in LocalStorage across page refreshes.
- [x] Custom playlists can be created, populated, and managed.
- [x] Equalizer presets dynamically adjust Web Audio frequency nodes.
- [x] Fully responsive across Desktop (1440px+), Laptop (1024px), Tablet (768px), and Mobile (375px+).

---

## 📜 License
Created for hackathon demonstration. Royalty-free musical assets and imagery used under Creative Commons / Unsplash licenses.

