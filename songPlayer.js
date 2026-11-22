// songPlayer.js – Simple wrapper for PreZify audio playback
// This file can be included in index.html after script.js

// Utility to fetch all songs from the backend
async function fetchAllSongs() {
  const response = await fetch('/api/songs');
  if (!response.ok) {
    console.error('Failed to fetch songs', response.status);
    return [];
  }
  const data = await response.json();
  return data.data || [];
}

// Populate a <select> element with song titles (provide element ID)
async function populateSongSelect(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;
  const songs = await fetchAllSongs();
  songs.forEach(song => {
    const opt = document.createElement('option');
    opt.value = song.id;
    opt.textContent = `${song.title} – ${song.artist}`;
    select.appendChild(opt);
  });
}

// Play a specific song by ID
function playSongById(songId) {
  fetch(`/api/songs/${songId}`)
    .then(r => r.json())
    .then(res => {
      if (!res.success) throw new Error('Song not found');
      const song = res.data;
      const audio = document.getElementById('audio-player');
      if (!audio) {
        console.error('No <audio id="audio-player"> element found');
        return;
      }
      audio.src = `/api/songs/${song.id}/stream`;
      audio.play();
      // update UI
      const titleEl = document.getElementById('now-playing-title');
      const artistEl = document.getElementById('now-playing-artist');
      if (titleEl) titleEl.textContent = song.title;
      if (artistEl) artistEl.textContent = song.artist;
    })
    .catch(err => console.error(err));
}

// Bind UI controls (call after DOMContentLoaded)
function initPlayerControls() {
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const select = document.getElementById('song-select');

  if (playBtn) playBtn.addEventListener('click', () => {
    const songId = select?.value;
    if (songId) playSongById(songId);
  });

  // Simple previous/next logic based on the current selection index
  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (!select) return;
    const idx = select.selectedIndex;
    if (idx > 0) select.selectedIndex = idx - 1;
    playSongById(select.value);
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (!select) return;
    const idx = select.selectedIndex;
    if (idx < select.options.length - 1) select.selectedIndex = idx + 1;
    playSongById(select.value);
  });
}

// Export for potential module use (optional)
export { fetchAllSongs, populateSongSelect, playSongById, initPlayerControls };

