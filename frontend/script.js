/**
 * PREZIFY – PREMIUM MUSIC STREAMING WEB APPLICATION
 * Core Application Engine & Controller
 */

'use strict';

/* ==========================================================================
   1. MUSIC CATALOG & EDITORIAL DATABASE
   ========================================================================== */

const TRACKS_DATABASE = [
  {
    id: 'track-1',
    title: 'Midnight Lo-Fi',
    artist: 'Aura Beats',
    album: 'Tokyo Rain Reflections',
    genre: 'Lo-Fi',
    audioSrc: 'songs/song1.mp3',
    cover: 'images/cover1.jpg',
    plays: '1,894,320',
    duration: 196, // 3:16
    year: 2026,
    lyrics: [
      { time: 0, text: "♪ (Lofi vinyl crackle & electric piano intro) ♪" },
      { time: 6, text: "Midnight raindrops tapping on the glass" },
      { time: 14, text: "Neon glow reflecting softly as the shadows pass" },
      { time: 23, text: "Warm steam rising from a porcelain cup" },
      { time: 32, text: "Lost in twilight hours, never looking up" },
      { time: 42, text: "Feel every beat, let the calm take hold" },
      { time: 54, text: "Every quiet second worth its weight in gold" },
      { time: 68, text: "♪ (Smooth chillhop groove & sub-bass pulse) ♪" },
      { time: 82, text: "Lines of code and city lights below" },
      { time: 94, text: "Moving to a rhythm steady and slow" },
      { time: 108, text: "Feel every beat... live every moment." },
      { time: 125, text: "♪ (Gentle fading guitar outro) ♪" }
    ]
  },
  {
    id: 'track-2',
    title: 'Neon Horizon',
    artist: 'Kavinsky Waves',
    album: 'Cyber Drive 2099',
    genre: 'Synthwave',
    audioSrc: 'songs/song2.mp3',
    cover: 'images/cover2.jpg',
    plays: '2,741,900',
    duration: 147, // 2:27
    year: 2026,
    lyrics: [
      { time: 0, text: "♪ (Punchy 80s analog synth arpeggio) ♪" },
      { time: 8, text: "Accelerating down the cyber expressway" },
      { time: 16, text: "Chrome reflections fading in the purple spray" },
      { time: 24, text: "Twin turbochargers breathing in the night" },
      { time: 33, text: "Chasing after visions in synthetic light" },
      { time: 42, text: "Neon Horizon, tearing through the grid!" },
      { time: 52, text: "Never look behind at what the darkness did" },
      { time: 62, text: "♪ (Heavy driving synthwave drop & drums) ♪" },
      { time: 78, text: "Speed of light, zero gravity" },
      { time: 90, text: "PreZify frequency setting us free!" },
      { time: 104, text: "Racing towards tomorrow on the edge of sound" },
      { time: 120, text: "♪ (Analog brass crescendo & outro) ♪" }
    ]
  },
  {
    id: 'track-3',
    title: 'Ethereal Echoes',
    artist: 'Celeste Moon',
    album: 'Deep Cosmos',
    genre: 'Ambient',
    audioSrc: 'songs/song3.mp3',
    cover: 'images/cover3.jpg',
    plays: '984,120',
    duration: 104, // 1:44
    year: 2026,
    lyrics: [
      { time: 0, text: "♪ (432Hz harmonic drone & celestial bells) ♪" },
      { time: 10, text: "Floating past stellar dust and ancient rings" },
      { time: 22, text: "Listening to what the boundless silence sings" },
      { time: 36, text: "Weightless drift across the cosmic sea" },
      { time: 50, text: "A timeless breath of pure serenity" },
      { time: 65, text: "Echoes of light across the starry night" },
      { time: 80, text: "Hold the vibration, sacred and bright" },
      { time: 94, text: "♪ (Deep resonant reverb fading into stars) ♪" }
    ]
  },
  {
    id: 'track-4',
    title: 'Solar Drift',
    artist: 'Hyperion X',
    album: 'Velocity & Bass',
    genre: 'Electronic',
    audioSrc: 'songs/song4.mp3',
    cover: 'images/cover4.jpg',
    plays: '1,429,080',
    duration: 147, // 2:27
    year: 2026,
    lyrics: [
      { time: 0, text: "♪ (Deep house four-on-the-floor beat buildup) ♪" },
      { time: 12, text: "Solar flare charging through the atmosphere" },
      { time: 22, text: "Signals locked in, crystal sharp and clear" },
      { time: 34, text: "Pulse on the floor, bass in your chest" },
      { time: 46, text: "Energy unbounded, put your soul to the test" },
      { time: 58, text: "Feel the surge, drift into the sun!" },
      { time: 70, text: "♪ (Massive club drop with vibrating sub-bass) ♪" },
      { time: 88, text: "Solar Drift... keep the cadence high" },
      { time: 102, text: "Electric thunder rolling through the sky" },
      { time: 120, text: "♪ (High-energy filter sweep & rhythm) ♪" }
    ]
  },
  {
    id: 'track-5',
    title: 'Rainy Cafe Nostalgia',
    artist: 'Coffee & Raindrops',
    album: 'Cozy Afternoons',
    genre: 'Chillhop',
    audioSrc: 'songs/song5.mp3',
    cover: 'images/cover5.jpg',
    plays: '810,400',
    duration: 196, // 3:16
    year: 2026,
    lyrics: [
      { time: 0, text: "♪ (Acoustic jazz chords & soft drum brushes) ♪" },
      { time: 8, text: "Sipping cinnamon tea by the corner booth" },
      { time: 20, text: "Old paperback novels telling timeless truth" },
      { time: 34, text: "Raindrops race each other on the window glass" },
      { time: 48, text: "Watching all the hurried strangers swiftly pass" },
      { time: 64, text: "Take a breath, slow down the ticking hands" },
      { time: 80, text: "Music understands what no one understands" },
      { time: 98, text: "♪ (Sweet saxophone solo with soft rhodes) ♪" },
      { time: 120, text: "Stay here awhile, let the cozy warmth remain" },
      { time: 140, text: "In harmony with the soft November rain" },
      { time: 165, text: "♪ (Gentle chime outro) ♪" }
    ]
  },
  {
    id: 'track-6',
    title: 'Starlight Velocity',
    artist: 'Nova Eclipse',
    album: 'Stellar Journey',
    genre: 'Cyberpunk',
    audioSrc: 'songs/song6.mp3',
    cover: 'images/cover6.jpg',
    plays: '1,192,600',
    duration: 104, // 1:44
    year: 2026,
    lyrics: [
      { time: 0, text: "♪ (Aggressive modular synth pulse & glitch drums) ♪" },
      { time: 10, text: "Neural uplink connected, speed unlimited" },
      { time: 20, text: "Every synapse sparking, consciousness transmitted" },
      { time: 32, text: "Through dark matter storms and laser skies" },
      { time: 44, text: "Look into the starlight through robotic eyes" },
      { time: 58, text: "Velocity maximum, breaking sound barriers!" },
      { time: 72, text: "♪ (Heavy industrial cyber drop) ♪" },
      { time: 86, text: "PreZify hyper-drive activated" },
      { time: 96, text: "♪ (Glitch fade & cosmic echo) ♪" }
    ]
  },
  {
    id: 'track-7',
    title: 'Run Phonk Energy',
    artist: 'Mickeyscat',
    album: 'Phonk Drift 2026',
    genre: 'Drift Phonk',
    audioSrc: 'songs/song7.mp3',
    cover: 'images/my-photo.jpg',
    plays: '3,142,500',
    duration: 120, // 2:00
    year: 2026,
    lyrics: [
      { time: 0, text: "♪ (Cowbell melody & heavy 808 distortion) ♪" },
      { time: 10, text: "Drifting through the midnight neon rain" },
      { time: 25, text: "Adrenaline rushing straight into the vein" },
      { time: 40, text: "Run phonk energy, feeling the raw speed" },
      { time: 55, text: "PreZify bass is all that you need" },
      { time: 75, text: "♪ (Aggressive phonk drop & distorted 808s) ♪" },
      { time: 95, text: "Smoke on the asphalt, tires screeching loud" },
      { time: 110, text: "♪ (Slow fade out with dark atmospheric synth) ♪" }
    ]
  },
  {
    id: 'track-8',
    title: 'Run Phonk Energy (Night Edition)',
    artist: 'Mickeyscat',
    album: 'Phonk Drift 2026',
    genre: 'Drift Phonk',
    audioSrc: 'songs/song8.mp3',
    cover: 'images/cover2.jpg',
    plays: '1,850,200',
    duration: 190,
    year: 2026,
    lyrics: [
      { time: 0, text: "♪ (Heavy bass drop & aggressive phonk rhythm) ♪" },
      { time: 15, text: "Midnight runners speeding through the rain" },
      { time: 35, text: "Night Edition overdrive, breaking through the pain" },
      { time: 60, text: "Feel the engine roar under neon sky" },
      { time: 90, text: "♪ (Dark phonk cowbell solo & distorted 808 drop) ♪" },
      { time: 130, text: "Push the limits, never slowing down" },
      { time: 165, text: "PreZify sound echoes across the town" },
      { time: 180, text: "♪ (Smooth outro fade) ♪" }
    ]
  },
  {
    id: 'track-9',
    title: 'Radhimaa',
    artist: 'PreZify Devotional & Melody',
    album: 'Divine Beats 2026',
    genre: 'Melody / Indian',
    audioSrc: 'songs/song9.mp3',
    cover: 'images/my-photo-new.jpg',
    plays: '2,480,100',
    duration: 212,
    year: 2026,
    lyrics: [
      { time: 0, text: "♪ (Soulful melodic intro & acoustic flute) ♪" },
      { time: 12, text: "Radhimaa... sacred rhythm in the breeze" },
      { time: 30, text: "Melodies that put the heart and soul at ease" },
      { time: 55, text: "A journey through the divine harmonies" },
      { time: 85, text: "♪ (Grand instrumental crescendo & rhythm) ♪" },
      { time: 120, text: "Feel every beat... live every moment with Radhimaa" },
      { time: 160, text: "Peaceful resonance echoing through time" },
      { time: 200, text: "♪ (Peaceful closing flute outro) ♪" }
    ]
  },
  {
    id: 'track-10',
    title: 'Radhimaa (Music Video Version)',
    artist: 'Vivek & Thejo Bharathwaj ft. Bhagyashri Borse',
    album: 'Radhimaa Official Soundtrack',
    genre: 'Soundtrack / Indian Pop',
    audioSrc: 'songs/song10.mp3',
    cover: 'images/my-photo-new.jpg',
    plays: '3,890,400',
    duration: 185,
    year: 2026,
    lyrics: [
      { time: 0, text: "♪ (Official music video melodic overture) ♪" },
      { time: 15, text: "Heartbeats synchronizing with the melody" },
      { time: 35, text: "Bhagyashri Borse & Vivek — timeless love harmony" },
      { time: 60, text: "Thejo Bharathwaj rhythm bringing smiles across" },
      { time: 90, text: "♪ (Vibrant emotional chorus drop) ♪" },
      { time: 120, text: "Radhimaa... streaming in lossless Hi-Fi on PreZify" },
      { time: 155, text: "Every beat, every note, pure magic" },
      { time: 175, text: "♪ (Orchestral cinematic finale) ♪" }
    ]
  }
];

const CURATED_PLAYLISTS = [
  {
    id: 'pl-cyberpunk',
    title: 'Cyberpunk Pulse 2099',
    desc: 'High-octane synthwave, dark synth, and industrial future beats for night drives.',
    cover: 'images/cover2.jpg',
    creator: 'PreZify Editorial',
    trackIds: ['track-2', 'track-6', 'track-4']
  },
  {
    id: 'pl-lofi',
    title: 'Midnight Lo-Fi Chill',
    desc: 'Mellow beats, vinyl dust, and relaxing keys designed for deep study and focus.',
    cover: 'images/cover1.jpg',
    creator: 'PreZify Lo-Fi Team',
    trackIds: ['track-1', 'track-5', 'track-3']
  },
  {
    id: 'pl-workout',
    title: 'Adrenaline High-Speed',
    desc: 'Electrifying progressive house & high BPM drops to smash your workout records.',
    cover: 'images/cover4.jpg',
    creator: 'PreZify Fitness',
    trackIds: ['track-4', 'track-2', 'track-6']
  },
  {
    id: 'pl-space',
    title: 'Cosmic Deep Sleep',
    desc: 'Binaural soundscapes and soothing ambient drones that melt away stress.',
    cover: 'images/cover3.jpg',
    creator: 'PreZify Sound Labs',
    trackIds: ['track-3', 'track-1', 'track-5']
  }
];

const POPULAR_ARTISTS = [
  {
    name: 'Aura Beats',
    genre: 'Lo-Fi / Chillhop',
    listeners: '1,420,890 monthly listeners',
    avatar: 'images/artist1.jpg',
    topTrackIds: ['track-1', 'track-5']
  },
  {
    name: 'Kavinsky Waves',
    genre: 'Synthwave / Retrowave',
    listeners: '2,741,900 monthly listeners',
    avatar: 'images/artist2.jpg',
    topTrackIds: ['track-2', 'track-4']
  },
  {
    name: 'Celeste Moon',
    genre: 'Ambient / Sound Healing',
    listeners: '984,120 monthly listeners',
    avatar: 'images/artist3.jpg',
    topTrackIds: ['track-3']
  },
  {
    name: 'Hyperion X',
    genre: 'EDM / Future Bass',
    listeners: '3,120,500 monthly listeners',
    avatar: 'images/artist4.jpg',
    topTrackIds: ['track-4', 'track-6']
  }
];

const DISCOVER_GENRES = [
  { name: 'Synthwave', color: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', icon: 'bi-disc', tracks: 120 },
  { name: 'Lo-Fi Chill', color: 'linear-gradient(135deg, #F43F5E, #FB923C)', icon: 'bi-cup-hot', tracks: 245 },
  { name: 'Electronic', color: 'linear-gradient(135deg, #06B6D4, #3B82F6)', icon: 'bi-lightning', tracks: 310 },
  { name: 'Ambient Cosmos', color: 'linear-gradient(135deg, #10B981, #06B6D4)', icon: 'bi-moon-stars', tracks: 88 },
  { name: 'Cyberpunk', color: 'linear-gradient(135deg, #EC4899, #8B5CF6)', icon: 'bi-cpu', tracks: 164 },
  { name: 'Chillhop', color: 'linear-gradient(135deg, #F59E0B, #EF4444)', icon: 'bi-headphones', tracks: 190 },
  { name: 'Future Bass', color: 'linear-gradient(135deg, #6366F1, #EC4899)', icon: 'bi-soundwave', tracks: 142 },
  { name: 'Acoustic Calm', color: 'linear-gradient(135deg, #14B8A6, #84CC16)', icon: 'bi-music-note-beamed', tracks: 95 }
];

/* ==========================================================================
   2. APPLICATION STATE MANAGEMENT
   ========================================================================== */

class PreZifyState {
  constructor() {
    this.currentTrack = null;
    this.currentTrackIndex = 0;
    this.queue = [...TRACKS_DATABASE];
    this.originalQueue = [...TRACKS_DATABASE];
    this.isPlaying = false;
    this.isShuffled = false;
    this.repeatMode = 'off'; // 'off' | 'all' | 'one'
    this.volume = 0.8;
    this.isMuted = false;
    this.playbackRate = 1.0;
    this.activeView = 'home';
    this.activeGenre = 'All';
    this.searchQuery = '';

    // LocalStorage backed
    this.likedSongIds = this.loadLikedSongs();
    this.customPlaylists = this.loadCustomPlaylists();
    this.historySongIds = this.loadHistory();
    this.settings = this.loadSettings();
  }

  loadLikedSongs() {
    try {
      const saved = localStorage.getItem('prezify_liked');
      return saved ? new Set(JSON.parse(saved)) : new Set(['track-1', 'track-2']);
    } catch {
      return new Set(['track-1', 'track-2']);
    }
  }

  saveLikedSongs() {
    try {
      localStorage.setItem('prezify_liked', JSON.stringify([...this.likedSongIds]));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  loadCustomPlaylists() {
    try {
      const saved = localStorage.getItem('prezify_playlists');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'user-pl-1',
        title: 'Deep Focus & Code',
        desc: 'Productivity soundtrack with pure flow state vibes.',
        theme: 'cyan',
        cover: 'images/cover1.jpg',
        trackIds: ['track-1', 'track-3', 'track-5']
      }
    ];
  }

  saveCustomPlaylists() {
    try {
      localStorage.setItem('prezify_playlists', JSON.stringify(this.customPlaylists));
    } catch (e) {
      console.warn('LocalStorage save playlists failed', e);
    }
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem('prezify_history');
      return saved ? JSON.parse(saved) : ['track-2', 'track-1'];
    } catch {
      return ['track-2', 'track-1'];
    }
  }

  addToHistory(trackId) {
    this.historySongIds = this.historySongIds.filter(id => id !== trackId);
    this.historySongIds.unshift(trackId);
    if (this.historySongIds.length > 30) this.historySongIds.pop();
    try {
      localStorage.setItem('prezify_history', JSON.stringify(this.historySongIds));
    } catch {}
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('prezify_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      quality: 'lossless',
      eqPreset: 'flat',
      crossfade: 3,
      accent: 'purple'
    };
  }

  saveSettings() {
    try {
      localStorage.setItem('prezify_settings', JSON.stringify(this.settings));
    } catch {}
  }
}

/* ==========================================================================
   3. AUDIO ENGINE (HTML5 AUDIO + WEB AUDIO API DSP & VISUALIZER)
   ========================================================================== */

class PreZifyAudioEngine {
  constructor(state, onTimeUpdate, onTrackEnd, onStateChange) {
    this.state = state;
    this.onTimeUpdate = onTimeUpdate;
    this.onTrackEnd = onTrackEnd;
    this.onStateChange = onStateChange;

    this.audio = document.getElementById('prezify-audio-engine');
    this.audio.volume = this.state.volume;

    // Web Audio API context & nodes (lazy-initialized upon user gesture)
    this.audioCtx = null;
    this.sourceNode = null;
    this.analyser = null;
    this.biquadFilter = null;
    this.isWebAudioReady = false;

    // Fallback synth in case an offline audio file fails
    this.synthOsc = null;
    this.synthGain = null;
    this.isSynthRunning = false;

    this.initAudioListeners();
  }

  initAudioListeners() {
    this.audio.addEventListener('timeupdate', () => {
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.audio.currentTime, this.audio.duration || 0);
      }
    });

    this.audio.addEventListener('progress', () => {
      this.updateBuffer();
    });

    this.audio.addEventListener('ended', () => {
      if (this.onTrackEnd) this.onTrackEnd();
    });

    this.audio.addEventListener('play', () => {
      this.state.isPlaying = true;
      if (this.onStateChange) this.onStateChange('play');
    });

    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
      if (this.onStateChange) this.onStateChange('pause');
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Native audio load error, engaging procedural synthesizer fallback', e);
      this.startSynthFallback();
    });
  }

  ensureWebAudio() {
    if (this.isWebAudioReady) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      // Equalizer filter
      this.biquadFilter = this.audioCtx.createBiquadFilter();
      this.applyEqPreset(this.state.settings.eqPreset || 'flat');

      // Hook up media element
      this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);
      this.sourceNode.connect(this.biquadFilter);
      this.biquadFilter.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      this.isWebAudioReady = true;
    } catch (err) {
      console.warn('Web Audio initialization note (safely bypassed):', err);
    }
  }

  loadTrack(track, autoPlay = true) {
    if (!track) return;
    this.stopSynthFallback();
    this.audio.src = track.audioSrc;
    this.audio.playbackRate = this.state.playbackRate;

    if (autoPlay) {
      this.play();
    }
  }

  play() {
    this.ensureWebAudio();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('Autoplay prevented or network blocked. User interaction needed or synth fallback:', err);
        // Will start when user clicks
      });
    }
  }

  pause() {
    this.audio.pause();
    this.stopSynthFallback();
  }

  seek(seconds) {
    if (Number.isFinite(seconds) && this.audio.duration) {
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration));
    }
  }

  setVolume(vol) {
    this.state.volume = Math.max(0, Math.min(1, vol));
    this.audio.volume = this.state.isMuted ? 0 : this.state.volume;
  }

  toggleMute() {
    this.state.isMuted = !this.state.isMuted;
    this.audio.volume = this.state.isMuted ? 0 : this.state.volume;
    return this.state.isMuted;
  }

  setPlaybackRate(rate) {
    this.state.playbackRate = rate;
    this.audio.playbackRate = rate;
  }

  applyEqPreset(preset) {
    this.state.settings.eqPreset = preset;
    this.state.saveSettings();
    if (!this.biquadFilter) return;

    if (preset === 'bass') {
      this.biquadFilter.type = 'lowshelf';
      this.biquadFilter.frequency.value = 250;
      this.biquadFilter.gain.value = 7.0;
    } else if (preset === 'treble') {
      this.biquadFilter.type = 'highshelf';
      this.biquadFilter.frequency.value = 3500;
      this.biquadFilter.gain.value = 6.0;
    } else if (preset === 'vocal') {
      this.biquadFilter.type = 'peaking';
      this.biquadFilter.frequency.value = 1500;
      this.biquadFilter.Q.value = 1.0;
      this.biquadFilter.gain.value = 5.0;
    } else if (preset === 'electronic') {
      this.biquadFilter.type = 'peaking';
      this.biquadFilter.frequency.value = 80;
      this.biquadFilter.gain.value = 5.0;
    } else {
      // Flat
      this.biquadFilter.type = 'peaking';
      this.biquadFilter.gain.value = 0;
    }
  }

  updateBuffer() {
    const seekerBuffer = document.getElementById('seeker-buffer');
    if (!seekerBuffer || !this.audio.duration) return;
    try {
      if (this.audio.buffered.length > 0) {
        const bufferedEnd = this.audio.buffered.end(this.audio.buffered.length - 1);
        const pct = (bufferedEnd / this.audio.duration) * 100;
        seekerBuffer.style.width = `${pct}%`;
      }
    } catch {}
  }

  startSynthFallback() {
    if (this.isSynthRunning) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) this.audioCtx = new AudioContext();
      this.synthOsc = this.audioCtx.createOscillator();
      this.synthGain = this.audioCtx.createGain();

      this.synthOsc.type = 'sine';
      this.synthOsc.frequency.setValueAtTime(220, this.audioCtx.currentTime); // A3 chord
      this.synthGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);

      this.synthOsc.connect(this.synthGain);
      if (this.analyser) {
        this.synthGain.connect(this.analyser);
      } else {
        this.synthGain.connect(this.audioCtx.destination);
      }
      this.synthOsc.start();
      this.isSynthRunning = true;
    } catch {}
  }

  stopSynthFallback() {
    if (this.isSynthRunning && this.synthOsc) {
      try {
        this.synthOsc.stop();
        this.synthOsc.disconnect();
      } catch {}
      this.isSynthRunning = false;
    }
  }
}

/* ==========================================================================
   4. USER INTERFACE & APPLICATION CONTROLLER
   ========================================================================== */

/* ==========================================================================
   BACKEND REST API CLIENT CONNECTOR
   ========================================================================== */

class PreZifyApiClient {
  constructor() {
    // Probe relative URL first, then default backend port 5000
    this.apiBase = window.location.port === '5000' ? '' : 'http://localhost:5000';
    this.isOnline = false;
  }

  async init() {
    try {
      const res = await fetch(`${this.apiBase}/api/songs`, { method: 'GET' });
      if (res.ok) {
        const json = await res.json();
        if (json && json.data && json.data.length > 0) {
          this.isOnline = true;
          console.log(`[PreZify API] Connected to Backend (${json.data.length} songs loaded)`);
          return json.data;
        }
      }
    } catch (err) {
      console.log('[PreZify API] Backend server offline, running in standalone client mode.');
    }
    return null;
  }
}

class PreZifyApp {
  constructor() {
    this.apiClient = new PreZifyApiClient();
    this.state = new PreZifyState();
    this.audioEngine = new PreZifyAudioEngine(
      this.state,
      (curr, dur) => this.onAudioTimeUpdate(curr, dur),
      () => this.onAudioTrackEnd(),
      (status) => this.onAudioStateChange(status)
    );

    this.isScrubbing = false;
    this.isVolumeScrubbing = false;

    // Cache key DOM elements
    this.dom = {
      // Nav
      globalSearchInput: document.getElementById('global-search-input'),
      searchClearBtn: document.getElementById('search-clear-btn'),
      brandHomeBtn: document.getElementById('brand-home-btn'),
      mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
      sidebarCloseBtn: document.getElementById('sidebar-close-btn'),
      sidebar: document.getElementById('sidebar'),
      notificationToggle: document.getElementById('notification-toggle'),
      notificationsPopover: document.getElementById('notifications-popover'),
      profileToggle: document.getElementById('profile-toggle'),
      profilePopover: document.getElementById('profile-popover'),
      navPremiumBtn: document.getElementById('nav-premium-btn'),

      // Views
      viewHome: document.getElementById('view-home'),
      viewDiscover: document.getElementById('view-discover'),
      viewSearch: document.getElementById('view-search'),
      viewLibrary: document.getElementById('view-library'),
      viewLiked: document.getElementById('view-liked'),
      viewPlaylistDetail: document.getElementById('view-playlist-detail'),
      viewArtistDetail: document.getElementById('view-artist-detail'),
      viewHistory: document.getElementById('view-history'),
      viewLyrics: document.getElementById('view-lyrics'),

      // Player Elements
      bottomPlayer: document.getElementById('bottom-player'),
      playerTitle: document.getElementById('player-title'),
      playerArtist: document.getElementById('player-artist'),
      playerCoverImg: document.getElementById('player-cover-img'),
      playerPlayBtn: document.getElementById('player-play-btn'),
      playerPlayIcon: document.getElementById('player-play-icon'),
      playerPrevBtn: document.getElementById('player-prev-btn'),
      playerNextBtn: document.getElementById('player-next-btn'),
      playerShuffleBtn: document.getElementById('player-shuffle-btn'),
      playerRepeatBtn: document.getElementById('player-repeat-btn'),
      playerRepeatIcon: document.getElementById('player-repeat-icon'),
      playerLikeBtn: document.getElementById('player-like-btn'),
      playerCurrentTime: document.getElementById('player-current-time'),
      playerTotalDuration: document.getElementById('player-total-duration'),
      playerSeekerContainer: document.getElementById('player-seeker-container'),
      seekerProgress: document.getElementById('seeker-progress'),
      seekerTooltip: document.getElementById('seeker-tooltip'),
      miniEqBars: document.getElementById('mini-eq-bars'),
      playerVisualizerCanvas: document.getElementById('player-visualizer-canvas'),
      lyricsCanvas: document.getElementById('lyrics-canvas'),
      playerSpeedBtn: document.getElementById('player-speed-btn'),
      playerLyricsBtn: document.getElementById('player-lyrics-btn'),
      playerQueueBtn: document.getElementById('player-queue-btn'),
      queueCountPill: document.getElementById('queue-count-pill'),
      playerVolumeBtn: document.getElementById('player-volume-btn'),
      playerVolumeIcon: document.getElementById('player-volume-icon'),
      volumeSliderTrack: document.getElementById('volume-slider-track'),
      volumeSliderFill: document.getElementById('volume-slider-fill'),

      // Hero Elements
      heroPlayBtn: document.getElementById('hero-play-btn'),
      heroLikeBtn: document.getElementById('hero-like-btn'),
      heroShareBtn: document.getElementById('hero-share-btn'),

      // Queue Drawer
      queueDrawer: document.getElementById('queue-drawer'),
      queueCloseBtn: document.getElementById('queue-close-btn'),
      queueNowPlaying: document.getElementById('queue-now-playing-item'),
      queueItemsList: document.getElementById('queue-items-list'),
      clearQueueBtn: document.getElementById('clear-queue-btn'),

      // Modals
      createPlaylistModal: document.getElementById('create-playlist-modal'),
      addToPlaylistModal: document.getElementById('add-to-playlist-modal'),
      settingsModal: document.getElementById('settings-modal'),
      premiumModal: document.getElementById('premium-modal'),

      // Containers
      trendingContainer: document.getElementById('trending-songs-container'),
      curatedPlaylistsContainer: document.getElementById('curated-playlists-container'),
      popularArtistsContainer: document.getElementById('popular-artists-container'),
      recommendedAlbumsContainer: document.getElementById('recommended-albums-container'),
      discoverCategoriesGrid: document.getElementById('discover-categories-grid'),
      sidebarPlaylistsList: document.getElementById('sidebar-playlists-list'),
      toastContainer: document.getElementById('toast-container'),
      likedCountBadge: document.getElementById('liked-count-badge')
    };

    this.init();
  }

  init() {
    // 1. Initial track setup
    this.state.currentTrack = TRACKS_DATABASE[0];
    this.updatePlayerUI(this.state.currentTrack);
    this.audioEngine.loadTrack(this.state.currentTrack, false);

    // 2. Render all dashboard sections
    this.renderHomeSections();
    this.renderDiscoverSections();
    this.renderSidebarPlaylists();
    this.updateLikedBadges();

    // 3. Bind UI Events
    this.bindNavigationEvents();
    this.bindPlayerEvents();
    this.bindSearchEvents();
    this.bindModalEvents();
    this.bindKeyboardShortcuts();

    // 4. Start visualizer canvas loop
    this.initVisualizer();

    // 5. Apply saved theme accent
    this.applyAccentTheme(this.state.settings.accent || 'purple');

    // 5b. Initialize Authentication System
    this.initAuth();

    // 6. Check for live Backend REST API
    this.apiClient.init().then(serverTracks => {
      if (serverTracks) {
        const rateLabel = document.getElementById('engine-rate-label');
        if (rateLabel) rateLabel.textContent = 'REST API Backend Online';
        this.showToast('PreZify REST API Server Connected', 'cyan');
      }
    });

    console.log('PreZify Audio Streaming Platform initialized successfully.');
  }

  /* ==========================================================================
     RENDER METHODS
     ========================================================================== */

  renderHomeSections() {
    // Trending Songs Grid
    this.renderTrendingSongs();

    // Curated Editorial Playlists
    this.renderCuratedPlaylists();

    // Popular Artists
    this.renderPopularArtists();

    // Recommended Albums
    this.renderRecommendedAlbums();
  }

  renderTrendingSongs(genreFilter = 'All') {
    if (!this.dom.trendingContainer) return;
    this.dom.trendingContainer.innerHTML = '';

    const filtered = genreFilter === 'All'
      ? TRACKS_DATABASE
      : TRACKS_DATABASE.filter(t => t.genre.toLowerCase() === genreFilter.toLowerCase());

    const tracksToShow = filtered.length > 0 ? filtered : TRACKS_DATABASE;

    tracksToShow.forEach((track, index) => {
      const isLiked = this.state.likedSongIds.has(track.id);
      const isCurrent = this.state.currentTrack && this.state.currentTrack.id === track.id;

      const card = document.createElement('div');
      card.className = `trending-card ${isCurrent ? 'is-active' : ''}`;
      card.dataset.id = track.id;

      card.innerHTML = `
        <span class="trending-rank">0${index + 1}</span>
        <div class="trending-thumb-wrap">
          <img src="${track.cover}" alt="${track.title}" class="trending-thumb">
          <div class="trending-card-play">
            <i class="bi ${isCurrent && this.state.isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}"></i>
          </div>
        </div>
        <div class="trending-info">
          <div class="trending-song-title">${track.title}</div>
          <div class="trending-song-artist">${track.artist}</div>
        </div>
        <div class="trending-meta">
          <span>${this.formatTime(track.duration)}</span>
          <button class="trending-like-btn ${isLiked ? 'liked' : ''}" data-like-id="${track.id}" title="${isLiked ? 'Remove from favorites' : 'Add to favorites'}">
            <i class="bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}"></i>
          </button>
        </div>
      `;

      // Play track on click (unless clicking like button)
      card.addEventListener('click', (e) => {
        if (e.target.closest('.trending-like-btn')) return;
        this.playTrackById(track.id);
      });

      // Like toggle
      const likeBtn = card.querySelector('.trending-like-btn');
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleLikeTrack(track.id);
      });

      this.dom.trendingContainer.appendChild(card);
    });
  }

  renderCuratedPlaylists() {
    if (!this.dom.curatedPlaylistsContainer) return;
    this.dom.curatedPlaylistsContainer.innerHTML = '';

    CURATED_PLAYLISTS.forEach(pl => {
      const card = document.createElement('div');
      card.className = 'music-card';
      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${pl.cover}" alt="${pl.title}" class="card-cover-img">
          <button class="card-play-fab" title="Play Playlist">
            <i class="bi bi-play-fill"></i>
          </button>
        </div>
        <h4 class="card-title">${pl.title}</h4>
        <p class="card-desc">${pl.desc}</p>
      `;

      card.addEventListener('click', () => {
        this.openPlaylistDetail(pl);
      });

      const fab = card.querySelector('.card-play-fab');
      fab.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playPlaylist(pl);
      });

      this.dom.curatedPlaylistsContainer.appendChild(card);
    });
  }

  renderPopularArtists() {
    if (!this.dom.popularArtistsContainer) return;
    this.dom.popularArtistsContainer.innerHTML = '';

    POPULAR_ARTISTS.forEach(artist => {
      const card = document.createElement('div');
      card.className = 'artist-card';
      card.innerHTML = `
        <div class="artist-avatar-circle">
          <img src="${artist.avatar}" alt="${artist.name}" class="artist-avatar-img">
        </div>
        <h4 class="artist-name-text">${artist.name}</h4>
        <span class="artist-listeners-text">${artist.listeners.split(' ')[0]} listeners</span>
      `;

      card.addEventListener('click', () => {
        this.openArtistDetail(artist);
      });

      this.dom.popularArtistsContainer.appendChild(card);
    });
  }

  renderRecommendedAlbums() {
    if (!this.dom.recommendedAlbumsContainer) return;
    this.dom.recommendedAlbumsContainer.innerHTML = '';

    const albums = [
      { title: 'Cyber Drive 2099', artist: 'Kavinsky Waves', cover: 'images/cover2.jpg', year: '2026' },
      { title: 'Tokyo Rain Reflections', artist: 'Aura Beats', cover: 'images/cover1.jpg', year: '2026' },
      { title: 'Deep Cosmos', artist: 'Celeste Moon', cover: 'images/cover3.jpg', year: '2026' },
      { title: 'Velocity & Bass', artist: 'Hyperion X', cover: 'images/cover4.jpg', year: '2026' }
    ];

    albums.forEach(album => {
      const card = document.createElement('div');
      card.className = 'music-card';
      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${album.cover}" alt="${album.title}" class="card-cover-img">
          <button class="card-play-fab"><i class="bi bi-play-fill"></i></button>
        </div>
        <h4 class="card-title">${album.title}</h4>
        <p class="card-desc">${album.artist} • Album</p>
      `;

      card.addEventListener('click', () => {
        const found = TRACKS_DATABASE.find(t => t.album === album.title);
        if (found) this.playTrackById(found.id);
      });

      this.dom.recommendedAlbumsContainer.appendChild(card);
    });
  }

  renderDiscoverSections() {
    if (!this.dom.discoverCategoriesGrid) return;
    this.dom.discoverCategoriesGrid.innerHTML = '';

    DISCOVER_GENRES.forEach(genre => {
      const card = document.createElement('div');
      card.className = 'genre-card';
      card.style.background = genre.color;
      card.innerHTML = `
        <span class="genre-card-title">${genre.name}</span>
        <span class="genre-card-tracks">${genre.tracks} Tracks</span>
        <i class="bi ${genre.icon} genre-card-icon"></i>
      `;

      card.addEventListener('click', () => {
        this.switchView('home');
        this.filterGenre(genre.name.split(' ')[0]);
        this.showToast(`Browsing ${genre.name} soundscapes`, 'cyan');
      });

      this.dom.discoverCategoriesGrid.appendChild(card);
    });
  }

  renderSidebarPlaylists() {
    if (!this.dom.sidebarPlaylistsList) return;
    this.dom.sidebarPlaylistsList.innerHTML = '';

    // Standard Curated Playlists
    CURATED_PLAYLISTS.forEach(pl => {
      const li = document.createElement('li');
      li.innerHTML = `
        <button class="sidebar-link" data-pl-id="${pl.id}">
          <i class="bi bi-music-note-beamed"></i>
          <span>${pl.title}</span>
        </button>
      `;
      li.querySelector('button').addEventListener('click', () => {
        this.openPlaylistDetail(pl);
      });
      this.dom.sidebarPlaylistsList.appendChild(li);
    });

    // Custom User Playlists
    this.state.customPlaylists.forEach(pl => {
      const li = document.createElement('li');
      li.innerHTML = `
        <button class="sidebar-link" data-user-pl-id="${pl.id}">
          <i class="bi bi-folder2-open text-cyan"></i>
          <span>${pl.title}</span>
        </button>
      `;
      li.querySelector('button').addEventListener('click', () => {
        this.openPlaylistDetail(pl, true);
      });
      this.dom.sidebarPlaylistsList.appendChild(li);
    });
  }

  renderLikedSongsView() {
    const tbody = document.getElementById('liked-tracks-tbody');
    const emptyState = document.getElementById('liked-empty-state');
    const countLabel = document.getElementById('liked-detail-count');
    const timeLabel = document.getElementById('liked-detail-time');

    if (!tbody) return;
    tbody.innerHTML = '';

    const likedTracks = TRACKS_DATABASE.filter(t => this.state.likedSongIds.has(t.id));

    if (likedTracks.length === 0) {
      emptyState.classList.remove('hidden');
      countLabel.textContent = '0 songs';
      timeLabel.textContent = '0 mins';
      return;
    }

    emptyState.classList.add('hidden');
    countLabel.textContent = `${likedTracks.length} ${likedTracks.length === 1 ? 'song' : 'songs'}`;

    const totalSeconds = likedTracks.reduce((acc, t) => acc + t.duration, 0);
    timeLabel.textContent = `${Math.round(totalSeconds / 60)} mins`;

    likedTracks.forEach((track, idx) => {
      const tr = this.createTrackTableRow(track, idx + 1);
      tbody.appendChild(tr);
    });
  }

  renderHistoryView() {
    const tbody = document.getElementById('history-tracks-tbody');
    const emptyState = document.getElementById('history-empty-state');
    if (!tbody) return;
    tbody.innerHTML = '';

    const historyTracks = this.state.historySongIds
      .map(id => TRACKS_DATABASE.find(t => t.id === id))
      .filter(Boolean);

    if (historyTracks.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    historyTracks.forEach((track, idx) => {
      const tr = this.createTrackTableRow(track, idx + 1);
      tbody.appendChild(tr);
    });
  }

  createTrackTableRow(track, index) {
    const isPlayingCurrent = this.state.currentTrack && this.state.currentTrack.id === track.id && this.state.isPlaying;
    const isLiked = this.state.likedSongIds.has(track.id);

    const tr = document.createElement('tr');
    tr.className = `track-row ${this.state.currentTrack && this.state.currentTrack.id === track.id ? 'playing' : ''}`;
    tr.dataset.id = track.id;

    tr.innerHTML = `
      <td class="track-num-cell">
        <span class="row-index">${index}</span>
        <i class="bi ${isPlayingCurrent ? 'bi-pause-fill' : 'bi-play-fill'} row-play-icon"></i>
      </td>
      <td class="track-title-cell">
        <img src="${track.cover}" alt="${track.title}" class="table-thumb">
        <div class="table-track-meta">
          <strong>${track.title}</strong>
          <span>${track.artist}</span>
        </div>
      </td>
      <td class="track-album-cell">${track.album}</td>
      <td class="track-genre-cell">${track.genre}</td>
      <td class="track-duration-cell">${this.formatTime(track.duration)}</td>
      <td class="track-actions-cell">
        <button class="table-action-btn ${isLiked ? 'liked' : ''}" data-action="like" title="Favorite">
          <i class="bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}"></i>
        </button>
        <button class="table-action-btn" data-action="add-pl" title="Add to playlist">
          <i class="bi bi-plus-circle"></i>
        </button>
      </td>
    `;

    tr.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      this.playTrackById(track.id);
    });

    const likeBtn = tr.querySelector('[data-action="like"]');
    likeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleLikeTrack(track.id);
    });

    const addPlBtn = tr.querySelector('[data-action="add-pl"]');
    addPlBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openAddToPlaylistModal(track);
    });

    return tr;
  }

  /* ==========================================================================
     PLAYBACK LOGIC
     ========================================================================== */

  playTrackById(trackId) {
    const track = TRACKS_DATABASE.find(t => t.id === trackId);
    if (!track) return;

    // If already playing this track, toggle play/pause
    if (this.state.currentTrack && this.state.currentTrack.id === track.id) {
      this.togglePlayPause();
      return;
    }

    this.state.currentTrack = track;
    this.state.currentTrackIndex = this.state.queue.findIndex(t => t.id === track.id);
    if (this.state.currentTrackIndex === -1) {
      this.state.queue.unshift(track);
      this.state.currentTrackIndex = 0;
    }

    this.state.addToHistory(track.id);
    this.updatePlayerUI(track);
    this.audioEngine.loadTrack(track, true);
    this.updateActiveTrackInUI();
    this.renderQueueDrawer();
  }

  togglePlayPause() {
    if (this.state.isPlaying) {
      this.audioEngine.pause();
    } else {
      this.audioEngine.play();
    }
  }

  playNextTrack() {
    if (this.state.queue.length === 0) return;

    if (this.state.repeatMode === 'one') {
      this.audioEngine.seek(0);
      this.audioEngine.play();
      return;
    }

    let nextIndex = this.state.currentTrackIndex + 1;
    if (nextIndex >= this.state.queue.length) {
      if (this.state.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        this.showToast('Reached end of playlist queue', 'purple');
        return;
      }
    }

    const nextTrack = this.state.queue[nextIndex];
    this.playTrackById(nextTrack.id);
  }

  playPrevTrack() {
    if (this.state.queue.length === 0) return;

    // If more than 3 seconds in, restart track
    if (this.audioEngine.audio.currentTime > 3) {
      this.audioEngine.seek(0);
      return;
    }

    let prevIndex = this.state.currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.state.queue.length - 1;
    }

    const prevTrack = this.state.queue[prevIndex];
    this.playTrackById(prevTrack.id);
  }

  toggleShuffle() {
    this.state.isShuffled = !this.state.isShuffled;
    this.dom.playerShuffleBtn.classList.toggle('active', this.state.isShuffled);

    if (this.state.isShuffled) {
      // Fisher-Yates shuffle
      const shuffled = [...this.state.queue];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      this.state.queue = shuffled;
      this.showToast('Shuffle Mode: ON', 'cyan');
    } else {
      this.state.queue = [...this.state.originalQueue];
      this.showToast('Shuffle Mode: OFF', 'purple');
    }

    this.renderQueueDrawer();
  }

  cycleRepeatMode() {
    if (this.state.repeatMode === 'off') {
      this.state.repeatMode = 'all';
      this.dom.playerRepeatBtn.classList.add('active');
      this.dom.playerRepeatIcon.className = 'bi bi-repeat';
      this.showToast('Repeat Mode: ALL', 'cyan');
    } else if (this.state.repeatMode === 'all') {
      this.state.repeatMode = 'one';
      this.dom.playerRepeatBtn.classList.add('active');
      this.dom.playerRepeatIcon.className = 'bi bi-repeat-1';
      this.showToast('Repeat Mode: ONE', 'cyan');
    } else {
      this.state.repeatMode = 'off';
      this.dom.playerRepeatBtn.classList.remove('active');
      this.dom.playerRepeatIcon.className = 'bi bi-repeat';
      this.showToast('Repeat Mode: OFF', 'purple');
    }
  }

  cyclePlaybackSpeed() {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(this.state.playbackRate);
    const nextRate = speeds[(currentIndex + 1) % speeds.length];
    this.audioEngine.setPlaybackRate(nextRate);
    this.dom.playerSpeedBtn.textContent = `${nextRate}x`;
    this.showToast(`Playback Speed: ${nextRate}x`, 'cyan');
  }

  playPlaylist(playlist) {
    const tracks = playlist.trackIds.map(id => TRACKS_DATABASE.find(t => t.id === id)).filter(Boolean);
    if (tracks.length === 0) return;

    this.state.queue = [...tracks];
    this.state.originalQueue = [...tracks];
    this.playTrackById(tracks[0].id);
    this.showToast(`Playing "${playlist.title}"`, 'cyan');
  }

  /* ==========================================================================
     UI UPDATES & SYNCHRONIZATION
     ========================================================================== */

  updatePlayerUI(track) {
    if (!track) return;
    this.dom.playerTitle.textContent = track.title;
    this.dom.playerArtist.textContent = track.artist;
    this.dom.playerCoverImg.src = track.cover;
    this.dom.playerTotalDuration.textContent = this.formatTime(track.duration);

    // Update Player Like button
    const isLiked = this.state.likedSongIds.has(track.id);
    this.dom.playerLikeBtn.classList.toggle('liked', isLiked);
    this.dom.playerLikeBtn.querySelector('i').className = isLiked ? 'bi bi-heart-fill' : 'bi bi-heart';

    // Update Fullscreen Lyrics View metadata
    const lyricsTitle = document.getElementById('lyrics-song-title');
    const lyricsArtist = document.getElementById('lyrics-artist-name');
    const lyricsCover = document.getElementById('lyrics-cover-img');
    if (lyricsTitle) lyricsTitle.textContent = track.title;
    if (lyricsArtist) lyricsArtist.textContent = track.artist;
    if (lyricsCover) lyricsCover.src = track.cover;

    this.renderLyricsView(track);
  }

  onAudioTimeUpdate(currentTime, duration) {
    if (this.isScrubbing) return;

    this.dom.playerCurrentTime.textContent = this.formatTime(currentTime);
    const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
    this.dom.seekerProgress.style.width = `${pct}%`;

    // Highlight current lyric line
    this.syncLyricsTime(currentTime);
  }

  onAudioTrackEnd() {
    this.playNextTrack();
  }

  onAudioStateChange(status) {
    if (status === 'play') {
      this.dom.playerPlayIcon.className = 'bi bi-pause-fill';
      this.dom.miniEqBars.classList.add('playing');
    } else {
      this.dom.playerPlayIcon.className = 'bi bi-play-fill';
      this.dom.miniEqBars.classList.remove('playing');
    }
    this.updateActiveTrackInUI();
  }

  updateActiveTrackInUI() {
    const currentId = this.state.currentTrack ? this.state.currentTrack.id : null;

    // Update trending cards
    document.querySelectorAll('.trending-card').forEach(card => {
      const isCurrent = card.dataset.id === currentId;
      card.classList.toggle('is-active', isCurrent);
      const icon = card.querySelector('.trending-card-play i');
      if (icon) {
        icon.className = isCurrent && this.state.isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill';
      }
    });

    // Update track table rows
    document.querySelectorAll('.track-row').forEach(row => {
      const isCurrent = row.dataset.id === currentId;
      row.classList.toggle('playing', isCurrent);
      const icon = row.querySelector('.row-play-icon');
      if (icon) {
        icon.className = isCurrent && this.state.isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill';
      }
    });
  }

  toggleLikeTrack(trackId) {
    const isLiked = this.state.likedSongIds.has(trackId);
    if (isLiked) {
      this.state.likedSongIds.delete(trackId);
      this.showToast('Removed from Liked Songs', 'purple');
    } else {
      this.state.likedSongIds.add(trackId);
      this.showToast('Added to Liked Songs', 'cyan');
    }
    this.state.saveLikedSongs();
    this.updateLikedBadges();

    // Re-render liked & active state
    this.updatePlayerUI(this.state.currentTrack);
    this.renderTrendingSongs(this.state.activeGenre);
    if (this.state.activeView === 'liked') this.renderLikedSongsView();
  }

  updateLikedBadges() {
    const count = this.state.likedSongIds.size;
    if (this.dom.likedCountBadge) this.dom.likedCountBadge.textContent = count;
    const summary = document.getElementById('lib-liked-summary');
    if (summary) summary.textContent = `${count} ${count === 1 ? 'track' : 'tracks'} saved`;
  }

  /* ==========================================================================
     LYRICS & VISUALIZER ENGINE
     ========================================================================== */

  renderLyricsView(track) {
    const container = document.getElementById('lyrics-lines-container');
    if (!container) return;
    container.innerHTML = '';

    if (!track.lyrics || track.lyrics.length === 0) {
      container.innerHTML = '<p class="text-muted">Instrumental audio stream. Enjoy the acoustic ambience.</p>';
      return;
    }

    track.lyrics.forEach((line) => {
      const div = document.createElement('div');
      div.className = 'lyric-line';
      div.dataset.time = line.time;
      div.textContent = line.text;

      // Jump to timestamp when clicked
      div.addEventListener('click', () => {
        this.audioEngine.seek(line.time);
      });

      container.appendChild(div);
    });
  }

  syncLyricsTime(currentTime) {
    const lines = document.querySelectorAll('.lyric-line');
    if (!lines.length) return;

    let activeLine = null;
    lines.forEach(line => {
      const lineTime = parseFloat(line.dataset.time);
      if (currentTime >= lineTime) {
        activeLine = line;
      }
    });

    lines.forEach(line => line.classList.remove('active'));
    if (activeLine) {
      activeLine.classList.add('active');
      activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  initVisualizer() {
    const playerCanvas = this.dom.playerVisualizerCanvas;
    const lyricsCanvas = this.dom.lyricsCanvas;
    if (!playerCanvas) return;

    const pCtx = playerCanvas.getContext('2d');
    const lCtx = lyricsCanvas ? lyricsCanvas.getContext('2d') : null;

    const render = () => {
      requestAnimationFrame(render);

      // Mini Player Canvas
      pCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
      const bars = 16;
      const barWidth = playerCanvas.width / bars - 1;

      // Fullscreen Lyrics Canvas
      if (lCtx && lyricsCanvas) {
        lCtx.clearRect(0, 0, lyricsCanvas.width, lyricsCanvas.height);
      }

      if (this.audioEngine.analyser && this.state.isPlaying) {
        const bufferLength = this.audioEngine.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.audioEngine.analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < bars; i++) {
          const val = dataArray[i * 2] || 0;
          const barHeight = (val / 255) * playerCanvas.height * 0.9 + 2;

          // Gradient bar
          const grad = pCtx.createLinearGradient(0, playerCanvas.height, 0, 0);
          grad.addColorStop(0, '#8B5CF6');
          grad.addColorStop(1, '#22D3EE');

          pCtx.fillStyle = grad;
          pCtx.fillRect(i * (barWidth + 1), playerCanvas.height - barHeight, barWidth, barHeight);

          if (lCtx && lyricsCanvas) {
            const lBarWidth = lyricsCanvas.width / 32 - 2;
            const lBarHeight = (val / 255) * lyricsCanvas.height * 0.85 + 4;
            const lGrad = lCtx.createLinearGradient(0, lyricsCanvas.height, 0, 0);
            lGrad.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
            lGrad.addColorStop(1, '#22D3EE');
            lCtx.fillStyle = lGrad;
            lCtx.fillRect(i * 2 * (lBarWidth + 2), lyricsCanvas.height - lBarHeight, lBarWidth, lBarHeight);
          }
        }
      } else {
        // Idle gentle waveform
        const time = Date.now() * 0.003;
        for (let i = 0; i < bars; i++) {
          const h = Math.sin(time + i * 0.5) * 3 + 4;
          pCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          pCtx.fillRect(i * (barWidth + 1), playerCanvas.height - h, barWidth, h);
        }
      }
    };

    render();
  }

  /* ==========================================================================
     QUEUE DRAWER MANAGEMENT
     ========================================================================== */

  renderQueueDrawer() {
    const list = this.dom.queueItemsList;
    const nowBox = this.dom.queueNowPlaying;
    if (!list || !nowBox) return;

    list.innerHTML = '';
    nowBox.innerHTML = '';

    const current = this.state.currentTrack;
    if (current) {
      nowBox.innerHTML = `
        <div class="queue-item active">
          <img src="${current.cover}" alt="${current.title}" class="queue-thumb">
          <div class="queue-item-meta">
            <div class="queue-item-title">${current.title}</div>
            <div class="queue-item-artist">${current.artist}</div>
          </div>
          <span class="text-cyan"><i class="bi bi-soundwave"></i></span>
        </div>
      `;
    }

    const upNext = this.state.queue.slice(this.state.currentTrackIndex + 1);
    this.dom.queueCountPill.textContent = upNext.length;

    if (upNext.length === 0) {
      list.innerHTML = '<p class="text-muted" style="font-size:12px; padding:8px;">No upcoming tracks in queue.</p>';
      return;
    }

    upNext.forEach((track, idx) => {
      const item = document.createElement('div');
      item.className = 'queue-item';
      item.innerHTML = `
        <img src="${track.cover}" alt="${track.title}" class="queue-thumb">
        <div class="queue-item-meta">
          <div class="queue-item-title">${track.title}</div>
          <div class="queue-item-artist">${track.artist}</div>
        </div>
        <button class="queue-remove-btn" title="Remove from queue"><i class="bi bi-x"></i></button>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.closest('.queue-remove-btn')) return;
        this.playTrackById(track.id);
      });

      const removeBtn = item.querySelector('.queue-remove-btn');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.state.queue.splice(this.state.currentTrackIndex + 1 + idx, 1);
        this.renderQueueDrawer();
        this.showToast(`Removed "${track.title}" from queue`, 'purple');
      });

      list.appendChild(item);
    });
  }

  /* ==========================================================================
     VIEWS & NAVIGATION
     ========================================================================== */

  switchView(viewName) {
    this.state.activeView = viewName;

    // Toggle panels
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const targetPanel = document.getElementById(`view-${viewName}`);
    if (targetPanel) targetPanel.classList.add('active');

    // Update active nav links
    document.querySelectorAll('.sidebar-link[data-view]').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });
    document.querySelectorAll('.nav-pill[data-nav]').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.nav === viewName);
    });
    document.querySelectorAll('.mobile-nav-btn[data-nav]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.nav === viewName);
    });

    // Close mobile sidebar if open
    this.dom.sidebar.classList.remove('mobile-open');

    // Scroll to top
    document.getElementById('main-content').scrollTop = 0;

    // Lazy view render updates
    if (viewName === 'liked') this.renderLikedSongsView();
    if (viewName === 'history') this.renderHistoryView();
    if (viewName === 'library') this.renderLibraryView();
  }

  openPlaylistDetail(playlist, isCustom = false) {
    this.switchView('playlist-detail');

    document.getElementById('pl-detail-title').textContent = playlist.title;
    document.getElementById('pl-detail-desc').textContent = playlist.desc;
    document.getElementById('pl-detail-img').src = playlist.cover || 'images/cover1.jpg';
    document.getElementById('pl-detail-creator').textContent = playlist.creator || 'Alex River';

    const deleteBtn = document.getElementById('pl-delete-btn');
    if (isCustom) {
      deleteBtn.style.display = 'inline-flex';
      deleteBtn.onclick = () => {
        if (confirm(`Delete playlist "${playlist.title}"?`)) {
          this.state.customPlaylists = this.state.customPlaylists.filter(p => p.id !== playlist.id);
          this.state.saveCustomPlaylists();
          this.renderSidebarPlaylists();
          this.switchView('library');
          this.showToast('Playlist deleted', 'purple');
        }
      };
    } else {
      deleteBtn.style.display = 'none';
    }

    const tracks = playlist.trackIds.map(id => TRACKS_DATABASE.find(t => t.id === id)).filter(Boolean);
    document.getElementById('pl-detail-count').textContent = `${tracks.length} tracks`;

    const tbody = document.getElementById('pl-tracks-tbody');
    tbody.innerHTML = '';
    tracks.forEach((track, idx) => {
      tbody.appendChild(this.createTrackTableRow(track, idx + 1));
    });

    document.getElementById('pl-play-all-btn').onclick = () => this.playPlaylist(playlist);
    document.getElementById('pl-shuffle-btn').onclick = () => {
      this.playPlaylist(playlist);
      if (!this.state.isShuffled) this.toggleShuffle();
    };
  }

  openArtistDetail(artist) {
    this.switchView('artist-detail');
    document.getElementById('artist-detail-name').textContent = artist.name;
    document.getElementById('artist-detail-listeners').textContent = artist.listeners;
    document.getElementById('artist-detail-avatar').src = artist.avatar;

    const tracks = artist.topTrackIds.map(id => TRACKS_DATABASE.find(t => t.id === id)).filter(Boolean);
    const tbody = document.getElementById('artist-tracks-tbody');
    tbody.innerHTML = '';
    tracks.forEach((track, idx) => {
      tbody.appendChild(this.createTrackTableRow(track, idx + 1));
    });

    document.getElementById('artist-play-btn').onclick = () => {
      if (tracks.length > 0) this.playTrackById(tracks[0].id);
    };

    const followBtn = document.getElementById('artist-follow-btn');
    followBtn.onclick = () => {
      const isFollowing = followBtn.classList.toggle('following');
      followBtn.textContent = isFollowing ? 'Following' : 'Follow';
      this.showToast(isFollowing ? `Followed ${artist.name}` : `Unfollowed ${artist.name}`, 'cyan');
    };
  }

  renderLibraryView() {
    const grid = document.getElementById('user-playlists-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const allPlaylists = [...CURATED_PLAYLISTS, ...this.state.customPlaylists];
    allPlaylists.forEach(pl => {
      const card = document.createElement('div');
      card.className = 'music-card';
      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${pl.cover || 'images/cover1.jpg'}" alt="${pl.title}" class="card-cover-img">
          <button class="card-play-fab"><i class="bi bi-play-fill"></i></button>
        </div>
        <h4 class="card-title">${pl.title}</h4>
        <p class="card-desc">${pl.desc}</p>
      `;

      card.addEventListener('click', () => {
        this.openPlaylistDetail(pl, pl.id.startsWith('user-'));
      });

      card.querySelector('.card-play-fab').addEventListener('click', (e) => {
        e.stopPropagation();
        this.playPlaylist(pl);
      });

      grid.appendChild(card);
    });
  }

  filterGenre(genre) {
    this.state.activeGenre = genre;
    document.querySelectorAll('.genre-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.genre.toLowerCase() === genre.toLowerCase());
    });
    this.renderTrendingSongs(genre);
  }

  /* ==========================================================================
     SEARCH ENGINE
     ========================================================================== */

  performSearch(query) {
    this.state.searchQuery = query.trim().toLowerCase();
    const heading = document.getElementById('search-results-heading');
    const sub = document.getElementById('search-results-sub');
    const emptyState = document.getElementById('search-empty-state');
    const activeContent = document.getElementById('search-active-content');
    const tbody = document.getElementById('search-tracks-tbody');
    const topMatchContainer = document.getElementById('search-top-match-container');

    if (!this.state.searchQuery) {
      heading.textContent = 'Search';
      sub.textContent = 'Discover songs, artists, albums, or vibes';
      emptyState.classList.remove('hidden');
      activeContent.style.display = 'none';
      return;
    }

    heading.textContent = `Results for "${query}"`;
    emptyState.classList.add('hidden');
    activeContent.style.display = 'block';

    // Match tracks
    const matchedTracks = TRACKS_DATABASE.filter(t =>
      t.title.toLowerCase().includes(this.state.searchQuery) ||
      t.artist.toLowerCase().includes(this.state.searchQuery) ||
      t.album.toLowerCase().includes(this.state.searchQuery) ||
      t.genre.toLowerCase().includes(this.state.searchQuery)
    );

    // Render Top Match
    topMatchContainer.innerHTML = '';
    if (matchedTracks.length > 0) {
      const top = matchedTracks[0];
      const topCard = document.createElement('div');
      topCard.className = 'top-match-card';
      topCard.innerHTML = `
        <span class="top-match-tag">TOP RESULT</span>
        <div class="top-match-content">
          <img src="${top.cover}" alt="${top.title}" class="top-match-img">
          <div class="top-match-info">
            <h3>${top.title}</h3>
            <p>${top.artist} • Song</p>
          </div>
          <button class="card-play-fab" style="opacity:1; transform:none; position:static; margin-left:auto;">
            <i class="bi bi-play-fill"></i>
          </button>
        </div>
      `;
      topCard.addEventListener('click', () => this.playTrackById(top.id));
      topMatchContainer.appendChild(topCard);
    }

    // Render Table Rows
    tbody.innerHTML = '';
    if (matchedTracks.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align:center; padding:30px;">No tracks found matching "${query}". Try searching for Synthwave, Lo-Fi, or Aura Beats.</td></tr>`;
    } else {
      matchedTracks.forEach((t, i) => {
        tbody.appendChild(this.createTrackTableRow(t, i + 1));
      });
    }
  }

  /* ==========================================================================
     EVENT BINDINGS
     ========================================================================== */

  bindNavigationEvents() {
    // Brand link to home
    this.dom.brandHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchView('home');
    });

    // Top nav pills
    document.querySelectorAll('.nav-pill[data-nav]').forEach(pill => {
      pill.addEventListener('click', () => this.switchView(pill.dataset.nav));
    });

    // Sidebar links
    document.querySelectorAll('.sidebar-link[data-view]').forEach(link => {
      link.addEventListener('click', () => this.switchView(link.dataset.view));
    });

    // Mobile nav buttons
    document.querySelectorAll('.mobile-nav-btn[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => this.switchView(btn.dataset.nav));
    });

    // Mobile sidebar toggle
    this.dom.mobileMenuToggle.addEventListener('click', () => {
      this.dom.sidebar.classList.add('mobile-open');
    });
    this.dom.sidebarCloseBtn.addEventListener('click', () => {
      this.dom.sidebar.classList.remove('mobile-open');
    });

    // Genre pills row
    document.querySelectorAll('.genre-pill').forEach(pill => {
      pill.addEventListener('click', () => this.filterGenre(pill.dataset.genre));
    });

    // Hero buttons
    this.dom.heroPlayBtn.addEventListener('click', () => {
      this.playTrackById('track-2'); // Featured Neon Horizon
    });

    this.dom.heroLikeBtn.addEventListener('click', () => {
      this.toggleLikeTrack('track-2');
    });

    this.dom.heroShareBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        this.showToast('Link copied to clipboard!', 'cyan');
      }
    });

    // Play All Trending
    document.getElementById('play-all-trending-btn').addEventListener('click', () => {
      this.state.queue = [...TRACKS_DATABASE];
      this.playTrackById(TRACKS_DATABASE[0].id);
      this.showToast('Playing all Trending Songs', 'cyan');
    });

    // Liked Songs Hero Actions
    document.getElementById('liked-play-all-btn').addEventListener('click', () => {
      const liked = TRACKS_DATABASE.filter(t => this.state.likedSongIds.has(t.id));
      if (liked.length > 0) {
        this.state.queue = [...liked];
        this.playTrackById(liked[0].id);
      }
    });

    document.getElementById('liked-shuffle-btn').addEventListener('click', () => {
      const liked = TRACKS_DATABASE.filter(t => this.state.likedSongIds.has(t.id));
      if (liked.length > 0) {
        this.state.queue = [...liked];
        this.playTrackById(liked[0].id);
        if (!this.state.isShuffled) this.toggleShuffle();
      }
    });

    // Library summary cards
    document.getElementById('lib-liked-card').addEventListener('click', () => this.switchView('liked'));
    document.getElementById('lib-history-card').addEventListener('click', () => this.switchView('history'));
    document.getElementById('library-new-playlist-btn').addEventListener('click', () => this.openModal('create-playlist-modal'));

    // Clear history
    document.getElementById('clear-history-btn').addEventListener('click', () => {
      this.state.historySongIds = [];
      try { localStorage.removeItem('prezify_history'); } catch {}
      this.renderHistoryView();
      this.showToast('Listening history cleared', 'purple');
    });

    // Notification dropdown toggle
    this.dom.notificationToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dom.notificationsPopover.classList.toggle('show');
      this.dom.profilePopover.classList.remove('show');
    });

    // Profile dropdown toggle
    this.dom.profileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dom.profilePopover.classList.toggle('show');
      this.dom.notificationsPopover.classList.remove('show');
    });

    // Mark all read button
    document.getElementById('mark-all-read-btn').addEventListener('click', () => {
      document.querySelectorAll('.notification-item.unread').forEach(el => el.classList.remove('unread'));
      const ind = document.querySelector('.notification-indicator');
      if (ind) ind.style.display = 'none';
      this.showToast('All notifications marked as read', 'cyan');
    });

    // Profile menu actions
    document.querySelectorAll('.profile-popover [data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.dom.profilePopover.classList.remove('show');
        if (action === 'view-liked') this.switchView('liked');
        if (action === 'open-settings') this.openModal('settings-modal');
        if (action === 'open-premium') this.openModal('premium-modal');
      });
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
      this.showToast('Profile: Guest Session Active', 'purple');
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.notification-wrapper')) {
        this.dom.notificationsPopover.classList.remove('show');
      }
      if (!e.target.closest('.profile-wrapper')) {
        this.dom.profilePopover.classList.remove('show');
      }
    });

    // Explore Premium
    this.dom.navPremiumBtn.addEventListener('click', () => this.openModal('premium-modal'));
    document.getElementById('sidebar-settings-btn').addEventListener('click', () => this.openModal('settings-modal'));
    document.getElementById('sidebar-eq-btn').addEventListener('click', () => this.openModal('settings-modal'));

    // Lyrics Fullscreen toggle
    this.dom.playerLyricsBtn.addEventListener('click', () => {
      if (this.state.activeView === 'lyrics') {
        this.switchView('home');
      } else {
        this.switchView('lyrics');
      }
    });
    document.getElementById('lyrics-close-btn').addEventListener('click', () => this.switchView('home'));
    document.getElementById('mobile-lyrics-nav-btn').addEventListener('click', () => this.switchView('lyrics'));

    // Queue drawer toggle
    this.dom.playerQueueBtn.addEventListener('click', () => {
      this.dom.queueDrawer.classList.toggle('open');
      this.renderQueueDrawer();
    });
    this.dom.queueCloseBtn.addEventListener('click', () => {
      this.dom.queueDrawer.classList.remove('open');
    });
    this.dom.clearQueueBtn.addEventListener('click', () => {
      this.state.queue = this.state.currentTrack ? [this.state.currentTrack] : [];
      this.renderQueueDrawer();
      this.showToast('Playback queue cleared', 'purple');
    });
  }

  bindPlayerEvents() {
    // Play/Pause Master
    this.dom.playerPlayBtn.addEventListener('click', () => this.togglePlayPause());

    // Next / Prev
    this.dom.playerNextBtn.addEventListener('click', () => this.playNextTrack());
    this.dom.playerPrevBtn.addEventListener('click', () => this.playPrevTrack());

    // Shuffle & Repeat
    this.dom.playerShuffleBtn.addEventListener('click', () => this.toggleShuffle());
    this.dom.playerRepeatBtn.addEventListener('click', () => this.cycleRepeatMode());

    // Like button
    this.dom.playerLikeBtn.addEventListener('click', () => {
      if (this.state.currentTrack) this.toggleLikeTrack(this.state.currentTrack.id);
    });

    // Speed button
    this.dom.playerSpeedBtn.addEventListener('click', () => this.cyclePlaybackSpeed());

    // Seeker Drag & Scrubbing
    const seeker = this.dom.playerSeekerContainer;
    seeker.addEventListener('mousedown', (e) => {
      this.isScrubbing = true;
      this.handleSeekerScrub(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isScrubbing) {
        this.handleSeekerScrub(e);
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isScrubbing) {
        this.isScrubbing = false;
      }
      if (this.isVolumeScrubbing) {
        this.isVolumeScrubbing = false;
      }
    });

    // Hover tooltip on seeker
    seeker.addEventListener('mousemove', (e) => {
      const rect = seeker.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const dur = this.audioEngine.audio.duration || 0;
      this.dom.seekerTooltip.textContent = this.formatTime(pct * dur);
      this.dom.seekerTooltip.style.left = `${e.clientX - rect.left}px`;
      this.dom.seekerTooltip.style.opacity = '1';
    });

    seeker.addEventListener('mouseleave', () => {
      this.dom.seekerTooltip.style.opacity = '0';
    });

    // Volume Slider & Mute
    this.dom.playerVolumeBtn.addEventListener('click', () => {
      const isMuted = this.audioEngine.toggleMute();
      this.updateVolumeUI(isMuted ? 0 : this.state.volume);
    });

    const volTrack = this.dom.volumeSliderTrack;
    volTrack.addEventListener('mousedown', (e) => {
      this.isVolumeScrubbing = true;
      this.handleVolumeScrub(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isVolumeScrubbing) {
        this.handleVolumeScrub(e);
      }
    });
  }

  handleSeekerScrub(e) {
    const seeker = this.dom.playerSeekerContainer;
    const rect = seeker.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.dom.seekerProgress.style.width = `${pct * 100}%`;

    const dur = this.audioEngine.audio.duration || 0;
    this.audioEngine.seek(pct * dur);
  }

  handleVolumeScrub(e) {
    const track = this.dom.volumeSliderTrack;
    const rect = track.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.state.isMuted = false;
    this.audioEngine.setVolume(pct);
    this.updateVolumeUI(pct);
  }

  updateVolumeUI(vol) {
    this.dom.volumeSliderFill.style.width = `${vol * 100}%`;
    const icon = this.dom.playerVolumeIcon;
    if (vol === 0) {
      icon.className = 'bi bi-volume-mute-fill';
    } else if (vol < 0.5) {
      icon.className = 'bi bi-volume-down-fill';
    } else {
      icon.className = 'bi bi-volume-up-fill';
    }
  }

  bindSearchEvents() {
    let debounceTimer = null;
    this.dom.globalSearchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      this.dom.searchClearBtn.style.display = val ? 'inline-flex' : 'none';

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (val) this.switchView('search');
        this.performSearch(val);
      }, 150);
    });

    this.dom.searchClearBtn.addEventListener('click', () => {
      this.dom.globalSearchInput.value = '';
      this.dom.searchClearBtn.style.display = 'none';
      this.performSearch('');
    });

    this.dom.globalSearchInput.addEventListener('focus', () => {
      if (this.dom.globalSearchInput.value) this.switchView('search');
    });
  }

  bindModalEvents() {
    // Open create playlist modal
    document.getElementById('create-playlist-trigger').addEventListener('click', () => {
      this.openModal('create-playlist-modal');
    });

    // Close buttons on all modals
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeModal(btn.dataset.close);
      });
    });

    // Backdrop click close
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal(modal.id);
      });
    });

    // Color theme picker for playlist
    let selectedColor = 'purple';
    document.querySelectorAll('#playlist-theme-picker .color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('#playlist-theme-picker .color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        selectedColor = dot.dataset.color;
      });
    });

    // Confirm Create Playlist
    document.getElementById('confirm-create-playlist-btn').addEventListener('click', () => {
      const nameInput = document.getElementById('new-playlist-name');
      const descInput = document.getElementById('new-playlist-desc');
      const title = nameInput.value.trim() || 'My New Playlist';
      const desc = descInput.value.trim() || 'Personal curated soundtrack.';

      const newPl = {
        id: `user-pl-${Date.now()}`,
        title,
        desc,
        theme: selectedColor,
        cover: 'images/cover4.jpg',
        trackIds: []
      };

      this.state.customPlaylists.push(newPl);
      this.state.saveCustomPlaylists();
      this.renderSidebarPlaylists();

      nameInput.value = '';
      descInput.value = '';
      this.closeModal('create-playlist-modal');
      this.showToast(`Created playlist "${title}"`, 'cyan');
    });

    // Equalizer Preset Buttons
    document.querySelectorAll('#eq-presets-container .eq-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#eq-presets-container .eq-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.audioEngine.applyEqPreset(pill.dataset.preset);
        this.showToast(`Equalizer Preset: ${pill.textContent}`, 'cyan');
      });
    });

    // Crossfade Slider
    const cfSlider = document.getElementById('crossfade-slider');
    const cfLabel = document.getElementById('crossfade-value-label');
    cfSlider.addEventListener('input', (e) => {
      cfLabel.textContent = `${e.target.value} seconds`;
      this.state.settings.crossfade = parseInt(e.target.value, 10);
      this.state.saveSettings();
    });

    // Theme Accent Switcher
    document.querySelectorAll('#theme-accent-row .accent-choice-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#theme-accent-row .accent-choice-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.applyAccentTheme(btn.dataset.accent);
      });
    });

    // Upgrade buttons simulation
    document.getElementById('upgrade-pro-btn').addEventListener('click', () => {
      this.closeModal('premium-modal');
      this.showToast('Welcome to PreZify Plus! Enjoy 24-bit Lossless Audio.', 'cyan');
      document.getElementById('engine-rate-label').textContent = '24-bit / 96kHz Lossless FLAC';
    });

    document.getElementById('upgrade-family-btn').addEventListener('click', () => {
      this.closeModal('premium-modal');
      this.showToast('PreZify Family Activated! 6 accounts streaming in Hi-Fi.', 'cyan');
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('show');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
  }

  openAddToPlaylistModal(track) {
    this.openModal('add-to-playlist-modal');
    document.getElementById('add-track-target-name').textContent = `Add "${track.title}" to:`;
    const container = document.getElementById('add-to-playlist-options');
    container.innerHTML = '';

    this.state.customPlaylists.forEach(pl => {
      const btn = document.createElement('button');
      btn.className = 'menu-item';
      btn.style.padding = '12px 14px';
      btn.style.width = '100%';
      btn.style.background = 'rgba(255,255,255,0.04)';
      btn.style.marginBottom = '6px';
      btn.innerHTML = `<i class="bi bi-music-note text-cyan"></i> <strong>${pl.title}</strong> (${pl.trackIds.length} tracks)`;

      btn.addEventListener('click', () => {
        if (!pl.trackIds.includes(track.id)) {
          pl.trackIds.push(track.id);
          this.state.saveCustomPlaylists();
          this.showToast(`Added to "${pl.title}"`, 'cyan');
        } else {
          this.showToast(`Track already exists in "${pl.title}"`, 'purple');
        }
        this.closeModal('add-to-playlist-modal');
      });

      container.appendChild(btn);
    });
  }

  applyAccentTheme(accent) {
    this.state.settings.accent = accent;
    this.state.saveSettings();

    const root = document.documentElement;
    if (accent === 'cyan') {
      root.style.setProperty('--accent-primary', '#22D3EE');
      root.style.setProperty('--accent-secondary', '#8B5CF6');
      root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #22D3EE 0%, #8B5CF6 100%)');
    } else if (accent === 'pink') {
      root.style.setProperty('--accent-primary', '#EC4899');
      root.style.setProperty('--accent-secondary', '#F43F5E');
      root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)');
    } else if (accent === 'emerald') {
      root.style.setProperty('--accent-primary', '#10B981');
      root.style.setProperty('--accent-secondary', '#06B6D4');
      root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)');
    } else {
      // Default Purple / Cyan
      root.style.setProperty('--accent-primary', '#8B5CF6');
      root.style.setProperty('--accent-secondary', '#22D3EE');
      root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%)');
    }
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') document.activeElement.blur();
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          this.togglePlayPause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.audioEngine.seek(this.audioEngine.audio.currentTime + 5);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.audioEngine.seek(this.audioEngine.audio.currentTime - 5);
          break;
        case 'KeyN':
          if (e.shiftKey) {
            e.preventDefault();
            this.playNextTrack();
          }
          break;
        case 'KeyP':
          if (e.shiftKey) {
            e.preventDefault();
            this.playPrevTrack();
          }
          break;
        case 'KeyM':
          e.preventDefault();
          this.dom.playerVolumeBtn.click();
          break;
        case 'KeyL':
          e.preventDefault();
          this.dom.playerLikeBtn.click();
          break;
        case 'KeyS':
          e.preventDefault();
          this.toggleShuffle();
          break;
        case 'KeyR':
          e.preventDefault();
          this.cycleRepeatMode();
          break;
        case 'Slash':
          e.preventDefault();
          this.dom.globalSearchInput.focus();
          break;
        case 'Escape':
          document.querySelectorAll('.modal-backdrop.show').forEach(m => m.classList.remove('show'));
          this.dom.queueDrawer.classList.remove('open');
          break;
      }
    });

    // Global Ctrl+K shortcut for search
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.dom.globalSearchInput.focus();
      }
    });
  }

  showToast(message, type = 'cyan') {
    const container = this.dom.toastContainer;
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'purple' ? 'toast-purple' : ''}`;
    toast.innerHTML = `
      <i class="bi ${type === 'purple' ? 'bi-info-circle-fill text-accent' : 'bi-check-circle-fill text-cyan'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  /* ==========================================================================
     AUTHENTICATION SYSTEM (SPOTIFY / GOOGLE / CREDENTIALS)
     ========================================================================== */

  initAuth() {
    this.authModal = document.getElementById('auth-modal');
    this.authModalTitle = document.getElementById('auth-modal-title');
    this.authModalSubtitle = document.getElementById('auth-modal-subtitle');
    this.authForm = document.getElementById('auth-form');
    this.authInputName = document.getElementById('auth-input-name');
    this.authInputEmail = document.getElementById('auth-input-email');
    this.authInputPassword = document.getElementById('auth-input-password');
    this.groupAuthName = document.getElementById('group-auth-name');
    this.authSubmitBtn = document.getElementById('auth-submit-btn');
    this.authSwitchModeBtn = document.getElementById('auth-switch-mode-btn');
    this.authTogglePrompt = document.getElementById('auth-toggle-prompt');
    this.authModalClose = document.getElementById('auth-modal-close');

    this.navLoginBtn = document.getElementById('nav-login-btn');
    this.navSignupBtn = document.getElementById('nav-signup-btn');
    this.authButtonsGroup = document.getElementById('auth-buttons-group');
    this.profileWrapper = document.getElementById('profile-wrapper');
    this.logoutBtn = document.getElementById('logout-btn');

    this.isSignUpMode = false;

    // Load active session from localStorage
    const savedUser = localStorage.getItem('prezify_auth_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }

    this.updateAuthUI();

    // Event Listeners
    if (this.navLoginBtn) {
      this.navLoginBtn.addEventListener('click', () => this.openAuthModal(false));
    }
    if (this.navSignupBtn) {
      this.navSignupBtn.addEventListener('click', () => this.openAuthModal(true));
    }
    if (this.authModalClose) {
      this.authModalClose.addEventListener('click', () => this.closeAuthModal());
    }

    if (this.authSwitchModeBtn) {
      this.authSwitchModeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleAuthMode();
      });
    }

    // Toggle password visibility
    const togglePwdBtn = document.getElementById('btn-toggle-pwd');
    if (togglePwdBtn && this.authInputPassword) {
      togglePwdBtn.addEventListener('click', () => {
        const isPwd = this.authInputPassword.type === 'password';
        this.authInputPassword.type = isPwd ? 'text' : 'password';
        togglePwdBtn.innerHTML = isPwd ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
      });
    }

    // Social Auth Handlers
    const googleBtn = document.getElementById('btn-auth-google');
    if (googleBtn) {
      googleBtn.addEventListener('click', () => this.handleSocialAuth('Google'));
    }
    const spotifyBtn = document.getElementById('btn-auth-spotify');
    if (spotifyBtn) {
      spotifyBtn.addEventListener('click', () => this.handleSocialAuth('Spotify'));
    }
    const appleBtn = document.getElementById('btn-auth-apple');
    if (appleBtn) {
      appleBtn.addEventListener('click', () => this.handleSocialAuth('Apple'));
    }

    // Form Submit
    if (this.authForm) {
      this.authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCredentialsAuth();
      });
    }

    // Logout button
    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // If user is not logged in, prompt sign-in after 2 seconds
    if (!this.currentUser) {
      setTimeout(() => {
        const hasPrompted = sessionStorage.getItem('prezify_auth_prompted');
        if (!hasPrompted) {
          sessionStorage.setItem('prezify_auth_prompted', 'true');
          this.openAuthModal(false);
        }
      }, 1500);
    }
  }

  openAuthModal(isSignUp = false) {
    this.isSignUpMode = isSignUp;
    this.setAuthMode(isSignUp);
    if (this.authModal) {
      this.authModal.classList.add('show');
    }
  }

  closeAuthModal() {
    if (this.authModal) {
      this.authModal.classList.remove('show');
    }
  }

  toggleAuthMode() {
    this.isSignUpMode = !this.isSignUpMode;
    this.setAuthMode(this.isSignUpMode);
  }

  setAuthMode(isSignUp) {
    if (isSignUp) {
      this.authModalTitle.textContent = 'Sign up for PreZify';
      this.authModalSubtitle.textContent = 'Join millions streaming lossless audio worldwide.';
      this.groupAuthName.style.display = 'block';
      this.authSubmitBtn.querySelector('span').textContent = 'Create Account';
      this.authTogglePrompt.innerHTML = `Already have an account? <a href="#" class="text-accent fw-bold" id="auth-switch-mode-btn">Log in here</a>`;
    } else {
      this.authModalTitle.textContent = 'Log in to PreZify';
      this.authModalSubtitle.textContent = 'Feel Every Beat. Live Every Moment.';
      this.groupAuthName.style.display = 'none';
      this.authSubmitBtn.querySelector('span').textContent = 'Log In';
      this.authTogglePrompt.innerHTML = `Don't have an account? <a href="#" class="text-accent fw-bold" id="auth-switch-mode-btn">Sign up for PreZify</a>`;
    }

    // Re-bind the switch button since innerHTML was updated
    const switchBtn = document.getElementById('auth-switch-mode-btn');
    if (switchBtn) {
      switchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleAuthMode();
      });
    }
  }

  handleSocialAuth(provider) {
    const defaultName = provider === 'Google' ? 'Harikrishna (Google)' : provider === 'Spotify' ? 'Harikrishna (Spotify)' : 'Harikrishna User';
    const email = `harikrishna.${provider.toLowerCase()}@prezify.stream`;
    const avatar = 'images/my-photo-new.jpg';

    this.currentUser = {
      name: defaultName,
      email: email,
      avatar: avatar,
      provider: provider
    };

    localStorage.setItem('prezify_auth_user', JSON.stringify(this.currentUser));
    this.updateAuthUI();
    this.closeAuthModal();
    this.showToast(`Logged in successfully with ${provider}!`, 'cyan');
  }

  handleCredentialsAuth() {
    const email = this.authInputEmail ? this.authInputEmail.value.trim() : '';
    const name = this.isSignUpMode && this.authInputName && this.authInputName.value.trim() 
      ? this.authInputName.value.trim() 
      : email.split('@')[0] || 'Harikrishna';

    this.currentUser = {
      name: name,
      email: email,
      avatar: 'images/my-photo-new.jpg',
      provider: 'email'
    };

    localStorage.setItem('prezify_auth_user', JSON.stringify(this.currentUser));
    this.updateAuthUI();
    this.closeAuthModal();
    this.showToast(this.isSignUpMode ? `Welcome to PreZify, ${name}!` : `Welcome back, ${name}!`, 'cyan');
  }

  handleLogout() {
    this.currentUser = null;
    localStorage.removeItem('prezify_auth_user');
    this.updateAuthUI();
    this.showToast('Logged out of PreZify profile.', 'purple');
    this.openAuthModal(false);
  }

  updateAuthUI() {
    const navProfileName = document.getElementById('nav-profile-name');
    const cardProfileName = document.getElementById('card-profile-name');
    const cardProfileEmail = document.getElementById('card-profile-email');
    const navProfileAvatar = document.getElementById('nav-profile-avatar');
    const cardProfileAvatar = document.getElementById('card-profile-avatar');

    if (this.currentUser) {
      // User is logged in
      if (this.authButtonsGroup) this.authButtonsGroup.style.display = 'none';
      if (this.profileWrapper) this.profileWrapper.style.display = 'block';

      if (navProfileName) navProfileName.textContent = this.currentUser.name;
      if (cardProfileName) cardProfileName.textContent = this.currentUser.name;
      if (cardProfileEmail) cardProfileEmail.textContent = this.currentUser.email;

      if (navProfileAvatar && this.currentUser.avatar) navProfileAvatar.src = this.currentUser.avatar;
      if (cardProfileAvatar && this.currentUser.avatar) cardProfileAvatar.src = this.currentUser.avatar;
    } else {
      // User is logged out
      if (this.authButtonsGroup) this.authButtonsGroup.style.display = 'flex';
      if (this.profileWrapper) this.profileWrapper.style.display = 'none';
    }
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

// Instantiate PreZify on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.prezify = new PreZifyApp();
});

