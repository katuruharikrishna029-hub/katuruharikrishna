const path = require('path');
const fs = require('fs');
const BaseMusicProvider = require('./baseProvider');

class LocalProvider extends BaseMusicProvider {
  constructor(dataDir) {
    super('local');
    this.dataDir = dataDir || path.join(__dirname, '..', 'data');
  }

  readSongs() {
    try {
      const filePath = path.join(this.dataDir, 'songs.json');
      if (!fs.existsSync(filePath)) return [];
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('[LocalProvider] Error reading songs.json:', err.message);
      return [];
    }
  }

  async search(query, limit = 15) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return { results: [], warnings: [] };

    const songs = this.readSongs();
    const matched = songs
      .filter(s =>
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.artist && s.artist.toLowerCase().includes(q)) ||
        (s.album && s.album.toLowerCase().includes(q)) ||
        (s.genre && s.genre.toLowerCase().includes(q))
      )
      .slice(0, limit)
      .map(s => this.normalizeTrack({
        id: s.id,
        type: 'track',
        title: s.title,
        artist: s.artist,
        album: s.album || 'PreZify Master',
        genre: s.genre || 'Melody',
        duration: Number.isFinite(s.duration) && s.duration > 0 ? s.duration : null,
        artworkUrl: s.cover || 'images/cover1.jpg',
        audioSrc: `/api/songs/${s.id}/stream`,
        playbackAvailable: true,
        fullTrack: true,
        rightsStatus: 'PreZify local master library',
        statusText: 'Local Full Song (Authorized)'
      }));

    return { results: matched, warnings: [] };
  }
}

module.exports = LocalProvider;
