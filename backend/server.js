/**
 * PREZIFY – BACKEND REST API & AUDIO STREAMING SERVER
 * Architecture: Node.js Vanilla HTTP (Zero External Dependencies Required)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const httpClient = require('http');
const https = require('https');
// Simple .env loader (no external deps)
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  envLines.forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const ROOT_DIR = path.join(__dirname, '..');

// Helper: Read JSON Data File
function readJson(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return [];
  }
}

// Helper: Write JSON Data File
function writeJson(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

// Helper: Set Standard CORS Headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');
}

// Helper: Parse JSON Request Body
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function fetchJson(targetUrl) {
  return new Promise((resolve, reject) => {
    const client = targetUrl.startsWith('https:') ? https : httpClient;
    const request = client.get(targetUrl, {
      headers: { 'User-Agent': 'PreZifyMusic/2.0', Accept: 'application/json' }
    }, response => {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        response.resume();
        reject(new Error(`External music API returned ${response.statusCode}`));
        return;
      }
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
      });
    });
    request.setTimeout(10000, () => request.destroy(new Error('External music API timed out')));
    request.on('error', reject);
  });
}

// MIME Types Map
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav'
};

// Stream Audio with HTTP 206 Partial Content (Supports fast scrub & seek)
function streamAudio(req, res, audioRelativePath) {
  let audioPath = path.join(FRONTEND_DIR, audioRelativePath);
  if (!fs.existsSync(audioPath)) {
    audioPath = path.join(ROOT_DIR, audioRelativePath);
  }

  if (!fs.existsSync(audioPath)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Audio file not found on server' }));
    return;
  }

  const stat = fs.statSync(audioPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // Parse Range header e.g. "bytes=0-1024"
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(audioPath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mpeg'
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes'
    });
    fs.createReadStream(audioPath).pipe(res);
  }
}

// Server Request Handler
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle pre-flight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`[${new Date().toISOString().substring(11, 19)}] ${req.method} ${pathname}`);

  // ==========================================
  // API ROUTE 1: GET /api/songs
  // ==========================================
  if (req.method === 'GET' && pathname === '/api/songs') {
    const songs = readJson('songs.json');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: songs.length, data: songs }));
    return;
  }

  // ==========================================
  // API ROUTE 2: GET /api/songs/:id
  // ==========================================
  const songMatch = pathname.match(/^\/api\/songs\/([a-zA-Z0-9_\-]+)$/);
  if (req.method === 'GET' && songMatch) {
    const songId = songMatch[1];
    const songs = readJson('songs.json');
    const song = songs.find(s => s.id === songId);
    if (song) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: song }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Song not found' }));
    }
    return;
  }

  // ==========================================
  // API ROUTE 3: GET /api/songs/:id/stream (206 Audio Streaming)
  // ==========================================
  const streamMatch = pathname.match(/^\/api\/songs\/([a-zA-Z0-9_\-]+)\/stream$/);
  if (req.method === 'GET' && streamMatch) {
    const songId = streamMatch[1];
    const songs = readJson('songs.json');
    const song = songs.find(s => s.id === songId);
    if (song && song.audioSrc) {
      streamAudio(req, res, song.audioSrc);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Song track stream not found' }));
    }
    return;
  }

  // ==========================================
  // API ROUTE 4: GET & POST /api/playlists
  // ==========================================
  if (pathname === '/api/playlists') {
    if (req.method === 'GET') {
      const playlists = readJson('playlists.json');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, count: playlists.length, data: playlists }));
      return;
    }

    if (req.method === 'POST') {
      try {
        const body = await parseRequestBody(req);
        if (!body.title) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Playlist title is required' }));
          return;
        }

        const playlists = readJson('playlists.json');
        const newPlaylist = {
          id: `pl-${Date.now()}`,
          title: body.title,
          desc: body.desc || 'Curated music playlist',
          cover: body.cover || 'images/cover1.jpg',
          creator: body.creator || 'PreZify User',
          trackIds: body.trackIds || []
        };

        playlists.push(newPlaylist);
        writeJson('playlists.json', playlists);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: newPlaylist }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
      return;
    }
  }

  // ==========================================
  // API ROUTE 5: POST /api/playlists/:id/tracks
  // ==========================================
  const addTrackMatch = pathname.match(/^\/api\/playlists\/([a-zA-Z0-9_\-]+)\/tracks$/);
  if (req.method === 'POST' && addTrackMatch) {
    const plId = addTrackMatch[1];
    const body = await parseRequestBody(req);
    const playlists = readJson('playlists.json');
    const playlist = playlists.find(p => p.id === plId);

    if (playlist && body.trackId) {
      if (!playlist.trackIds.includes(body.trackId)) {
        playlist.trackIds.push(body.trackId);
        writeJson('playlists.json', playlists);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: playlist }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Playlist or track not found' }));
    }
    return;
  }

  // ==========================================
  // API ROUTE 6: DELETE /api/playlists/:id
  // ==========================================
  const deletePlMatch = pathname.match(/^\/api\/playlists\/([a-zA-Z0-9_\-]+)$/);
  if (req.method === 'DELETE' && deletePlMatch) {
    const plId = deletePlMatch[1];
    let playlists = readJson('playlists.json');
    const initialLen = playlists.length;
    playlists = playlists.filter(p => p.id !== plId);

    if (playlists.length < initialLen) {
      writeJson('playlists.json', playlists);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Playlist deleted' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Playlist not found' }));
    }
    return;
  }

  // ==========================================
  // API ROUTE 7: GET /api/artists
  // ==========================================
  if (req.method === 'GET' && pathname === '/api/artists') {
    const artists = readJson('artists.json');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: artists.length, data: artists }));
    return;
  }

  // ==========================================
  // API ROUTE 8: GET /api/search?q=query
  // ==========================================
  if (req.method === 'GET' && pathname === '/api/search') {
    const q = (query.q || '').trim().toLowerCase();
    const songs = readJson('songs.json');
    const playlists = readJson('playlists.json');
    const artists = readJson('artists.json');

    if (!q) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, query: '', results: { songs: [], artists: [], playlists: [] } }));
      return;
    }

    const matchedSongs = songs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q)
    );

    const matchedArtists = artists.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.genre.toLowerCase().includes(q)
    );

    const matchedPlaylists = playlists.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      query: q,
      results: {
        songs: matchedSongs,
        artists: matchedArtists,
        playlists: matchedPlaylists
      }
    }));
    return;
  }

  // ==========================================
  // API ROUTE 9: GET /api/global/search?q=query
  // Live Apple Music catalog + 24/7 Radio Browser stations
  // ==========================================
  if (req.method === 'GET' && pathname === '/api/global/search') {
    const q = (query.q || 'top hits').trim();
    const limit = Math.max(1, Math.min(parseInt(query.limit, 10) || 24, 50));

    try {
      const [itunesJson, radioStations] = await Promise.allSettled([
        fetchJson(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=${limit}`),
        fetchJson(`https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(q)}&limit=10`)
      ]);

      const results = [];
      if (itunesJson.status === 'fulfilled' && Array.isArray(itunesJson.value.results)) {
        results.push(...itunesJson.value.results);
      }
      if (radioStations.status === 'fulfilled' && Array.isArray(radioStations.value)) {
        radioStations.value.forEach(station => {
          const streamUrl = station.url_resolved || station.url;
          if (!streamUrl) return;
          results.push({
            trackId: station.stationuuid,
            trackName: station.name || `${q} Live Radio`,
            artistName: `24/7 Live Radio (${station.country || 'Global'})`,
            collectionName: station.tags ? station.tags.split(',').slice(0, 3).join(', ') : 'Live Broadcast',
            primaryGenreName: 'LIVE RADIO',
            artworkUrl100: station.favicon || '',
            previewUrl: streamUrl,
            trackTimeMillis: 0,
            isLive: true,
            releaseDate: new Date().toISOString()
          });
        });
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, query: q, count: results.length, results }));
    } catch (err) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Global music providers are unavailable' }));
    }
    return;
  }

  // ==========================================
  // STATIC FILE SERVING (Serves Frontend)
  // ==========================================
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  let filePath = path.join(FRONTEND_DIR, reqPath);

  // Fallback to project root if file doesn't exist in frontend/
  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT_DIR, reqPath);
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Audio stream through static
    if (ext === '.mp3') {
      streamAudio(req, res, path.relative(FRONTEND_DIR, filePath));
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found - PreZify Music Server');
  }
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    PREZIFY MUSIC BACKEND                     ║
║         "Feel Every Beat. Live Every Moment."                ║
╠══════════════════════════════════════════════════════════════╣
║  • Server Status  : Online & Ready                           ║
║  • Local URL      : http://localhost:${PORT}                   ║
║  • API Root       : http://localhost:${PORT}/api/songs         ║
║  • Audio Stream   : http://localhost:${PORT}/api/songs/:id/stream║
║  • Frontend Host  : http://localhost:${PORT}/index.html        ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

