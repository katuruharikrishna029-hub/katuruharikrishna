/**
 * PREZIFY – BACKEND REST API & AUDIO STREAMING SERVER
 * Architecture: Node.js Vanilla HTTP (Zero External Dependencies Required)
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
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
const GLOBAL_SEARCH_CACHE_TTL_MS = 60 * 1000;
const globalSearchCache = new Map();
const AUDIUS_API_BASE = 'https://api.audius.co';

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

async function fetchAudiusData(resource, query, limit) {
  const targetUrl = new URL(`/v1/${resource}`, AUDIUS_API_BASE);
  targetUrl.searchParams.set('query', query);
  targetUrl.searchParams.set('limit', String(limit));
  targetUrl.searchParams.set('app_name', 'PREZIFY');

  const response = await fetch(targetUrl, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(7000)
  });
  if (!response.ok) {
    throw new Error(`Audius ${resource} returned HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (!payload || !Array.isArray(payload.data)) {
    throw new Error(`Audius ${resource} returned an invalid response`);
  }
  return payload.data;
}

function mapAudiusTrack(track) {
  const streamable = track.is_streamable === true && track.is_stream_gated !== true &&
    typeof track.id === 'string' && track.id.length > 0;
  const audioSrc = streamable
    ? `/api/audius/tracks/${encodeURIComponent(track.id)}/stream`
    : '';
  const license = typeof track.license === 'string' && track.license.trim()
    ? `Uploader-reported license: ${track.license.trim()}`
    : 'Rights information not provided by Audius';
  const artwork = track.artwork && (
    track.artwork['480x480'] || track.artwork['1000x1000'] || track.artwork['150x150']
  );
  const duration = Number.isFinite(track.duration) && track.duration > 0 ? track.duration : null;

  return {
    id: `audius-${track.id}`,
    type: 'track',
    title: track.title || 'Untitled',
    artist: track.user && track.user.name ? track.user.name : 'Unknown Artist',
    album: track.album || 'Single',
    genre: track.genre || '',
    duration,
    artworkUrl: artwork || 'images/default-cover.jpg',
    audioSrc,
    playbackAvailable: Boolean(audioSrc),
    fullTrack: Boolean(audioSrc),
    rightsStatus: `${license}; not independently verified by PreZify`,
    source: 'audius'
  };
}

function mapAudiusArtist(artist) {
  return {
    id: `audius-artist-${artist.id}`,
    type: 'artist',
    title: artist.name || artist.handle || 'Unknown Artist',
    artist: artist.name || artist.handle || 'Unknown Artist',
    album: '',
    genre: artist.genre || '',
    duration: null,
    artworkUrl: artist.profile_picture && (
      artist.profile_picture['480x480'] || artist.profile_picture['1000x1000'] ||
      artist.profile_picture['150x150']
    ) || 'images/default-cover.jpg',
    playbackAvailable: false,
    source: 'audius'
  };
}

function mapAudiusAlbum(album) {
  return {
    id: `audius-${album.is_album ? 'album' : 'playlist'}-${album.id}`,
    type: album.is_album ? 'album' : 'playlist',
    title: album.playlist_name || 'Untitled Album',
    artist: album.user && (album.user.name || album.user.handle)
      ? album.user.name || album.user.handle
      : 'Unknown Artist',
    album: `${album.track_count || 0} tracks`,
    genre: '',
    duration: null,
    artworkUrl: album.artwork && (
      album.artwork['480x480'] || album.artwork['1000x1000'] || album.artwork['150x150']
    ) || 'images/default-cover.jpg',
    playbackAvailable: false,
    source: 'audius'
  };
}

async function fetchAudiusSearch(query, limit = 15) {
  const searchTerm = query.trim();
  const resultLimit = Math.max(1, Math.min(20, Number(limit) || 15));
  const cacheKey = `${searchTerm.toLowerCase()}:${resultLimit}`;
  const cached = globalSearchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached;
  if (cached) globalSearchCache.delete(cacheKey);

  const categories = [
    { resource: 'tracks/search', map: mapAudiusTrack },
    { resource: 'users/search', map: mapAudiusArtist },
    { resource: 'playlists/search', map: mapAudiusAlbum }
  ];
  const settled = await Promise.allSettled(
    categories.map(category => fetchAudiusData(category.resource, searchTerm, resultLimit))
  );
  const results = [];
  const warnings = [];

  settled.forEach((result, index) => {
    const category = categories[index];
    if (result.status === 'rejected') {
      console.error(`[Audius Search] ${category.resource} failed:`, result.reason.message);
      warnings.push(category.resource);
      return;
    }

    for (const item of result.value) {
      if (item && item.id && (item.title || item.name || item.playlist_name)) {
        results.push(category.map(item));
      }
    }
  });

  if (warnings.length === categories.length) {
    throw new Error('Audius search is temporarily unavailable.');
  }

  const uniqueResults = [...new Map(
    results.map(result => [`${result.type}:${result.id}`, result])
  ).values()];
  const searchResult = {
    results: uniqueResults,
    warnings: warnings.length
      ? ['Some Audius result types are temporarily unavailable.']
      : [],
    expiresAt: Date.now() + GLOBAL_SEARCH_CACHE_TTL_MS
  };

  if (globalSearchCache.size >= 100) {
    globalSearchCache.delete(globalSearchCache.keys().next().value);
  }
  globalSearchCache.set(cacheKey, searchResult);
  return searchResult;
}

function searchLocalSongs(query) {
  const songs = readJson('songs.json');
  const q = query.toLowerCase();
  return songs
    .filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      (s.album && s.album.toLowerCase().includes(q)) ||
      (s.genre && s.genre.toLowerCase().includes(q))
    )
    .map(s => ({
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
      rightsStatus: 'PreZify local library',
      source: 'local',
      statusText: 'Local full-length file'
    }));
}

function isAllowedAudiusStreamHost(hostname) {
  return hostname === 'audius.co' || hostname.endsWith('.audius.co') ||
    hostname === 'r2.cloudflarestorage.com' || hostname.endsWith('.r2.cloudflarestorage.com');
}

function streamAudiusTrack(req, res, trackId, targetUrl, redirectCount = 0) {
  const streamUrl = targetUrl || new URL(
    `/v1/tracks/${encodeURIComponent(trackId)}/stream?app_name=PREZIFY`,
    AUDIUS_API_BASE
  );
  if (streamUrl.protocol !== 'https:' || !isAllowedAudiusStreamHost(streamUrl.hostname)) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Audius returned an unsupported audio host.' }));
    return;
  }

  const headers = { 'User-Agent': 'PreZifyMusic/1.0' };
  if (req.headers.range) headers.Range = req.headers.range;

  const upstreamReq = https.get(streamUrl, { headers }, upstreamRes => {
    const statusCode = upstreamRes.statusCode || 502;
    if (statusCode >= 300 && statusCode < 400 && upstreamRes.headers.location) {
      upstreamRes.resume();
      if (redirectCount >= 4) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Audius audio redirect limit exceeded.' }));
        return;
      }

      let redirectUrl;
      try {
        redirectUrl = new URL(upstreamRes.headers.location, streamUrl);
      } catch {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Audius returned an invalid audio redirect.' }));
        return;
      }
      streamAudiusTrack(req, res, trackId, redirectUrl, redirectCount + 1);
      return;
    }

    if (statusCode !== 200 && statusCode !== 206) {
      upstreamRes.resume();
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Audius audio stream is unavailable.' }));
      return;
    }

    const responseHeaders = {
      'Content-Type': upstreamRes.headers['content-type'] || 'audio/mpeg',
      'Accept-Ranges': upstreamRes.headers['accept-ranges'] || 'bytes',
      'Access-Control-Allow-Origin': '*'
    };
    if (upstreamRes.headers['content-length']) {
      responseHeaders['Content-Length'] = upstreamRes.headers['content-length'];
    }
    if (upstreamRes.headers['content-range']) {
      responseHeaders['Content-Range'] = upstreamRes.headers['content-range'];
    }
    res.writeHead(statusCode, responseHeaders);
    upstreamRes.pipe(res);
    res.on('close', () => {
      if (!res.writableFinished) upstreamReq.destroy();
    });
  });

  upstreamReq.setTimeout(15000, () => {
    upstreamReq.destroy(new Error('Audius audio request timed out'));
  });
  upstreamReq.on('error', error => {
    console.error('[Audius Stream] Request failed:', error.message);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Audius audio stream is unavailable.' }));
    }
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
  // API ROUTE 8: GET /api/itunes/search?q=query
  // ==========================================
  if (req.method === 'GET' && pathname === '/api/itunes/search') {
    const term = String(query.q || '').trim();
    const country = String(query.country || 'US').toUpperCase();
    const requestedLimit = Number.parseInt(String(query.limit || '25'), 10);
    const limit = Math.min(50, Math.max(1, Number.isNaN(requestedLimit) ? 25 : requestedLimit));

    if (!term || term.length > 100 || !/^[A-Z]{2}$/.test(country)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Provide a search term (up to 100 characters) and a two-letter country code.' }));
      return;
    }

    const cacheKey = `${country}:${limit}:${term.toLowerCase()}`;
    const cached = itunesSearchCache.get(cacheKey);
    try {
      let results;
      if (cached && cached.expiresAt > Date.now()) {
        results = cached.results;
      } else {
        if (cached) itunesSearchCache.delete(cacheKey);
        const apiResults = await fetchItunesSearch(term, country, limit);
        results = apiResults
          .filter(item => item && item.wrapperType === 'track' && item.kind === 'song')
          .map(item => ({
            trackId: item.trackId,
            title: item.trackName || '',
            artist: item.artistName || 'Unknown Artist',
            album: item.collectionName || 'Single',
            artworkUrl: normalizeAppleUrl(item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '300x300bb') : ''),
            previewUrl: normalizeAppleUrl(item.previewUrl),
            trackViewUrl: normalizeAppleUrl(item.trackViewUrl),
            trackTimeMillis: Number.isFinite(item.trackTimeMillis) ? item.trackTimeMillis : null
          }))
          .filter(item => item.trackId && item.title);

        if (itunesSearchCache.size >= 100) {
          itunesSearchCache.delete(itunesSearchCache.keys().next().value);
        }
        itunesSearchCache.set(cacheKey, {
          results,
          expiresAt: Date.now() + ITUNES_CACHE_TTL_MS
        });
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      });
      res.end(JSON.stringify({ success: true, query: term, count: results.length, results }));
    } catch (error) {
      console.error('[iTunes Search API] Request failed:', error.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'The iTunes catalog is temporarily unavailable. Please try again.' }));
    }
    return;
  }

  // ==========================================
  // API ROUTE: GET /api/itunes/preview?url=...
  // Stream authorized 30s audio previews with CORS and HTTP 206 Partial Content
  // ==========================================
  if (req.method === 'GET' && pathname === '/api/itunes/preview') {
    const rawUrl = String(query.url || '').trim();
    const validatedUrl = normalizeAppleUrl(rawUrl);
    if (!validatedUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Invalid or unauthorized preview URL.' }));
      return;
    }

    try {
      const headers = {
        'User-Agent': 'PreZifyMusic/2.0 (Windows NT 10.0; Win64; x64)'
      };
      if (req.headers.range) {
        headers['Range'] = req.headers.range;
      }

      const upstreamReq = https.get(validatedUrl, { headers }, (upstreamRes) => {
        const statusCode = upstreamRes.statusCode || 200;
        const resHeaders = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Range, Content-Type',
          'Content-Type': upstreamRes.headers['content-type'] || 'audio/mp4',
          'Accept-Ranges': 'bytes'
        };

        if (upstreamRes.headers['content-length']) {
          resHeaders['Content-Length'] = upstreamRes.headers['content-length'];
        }
        if (upstreamRes.headers['content-range']) {
          resHeaders['Content-Range'] = upstreamRes.headers['content-range'];
        }

        res.writeHead(statusCode, resHeaders);
        upstreamRes.pipe(res);
      });

      upstreamReq.on('error', (err) => {
        console.error('[Preview Proxy] Stream error:', err.message);
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Audio preview stream unavailable.' }));
        }
      });
      upstreamReq.setTimeout(12000, () => {
        upstreamReq.destroy(new Error('Preview request timed out'));
      });
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Internal preview proxy error.' }));
      }
    }
    return;
  }

  // ==========================================
  // API ROUTE: GET /api/global/search?q=query
  // Unified Global Music Search across Audius Full-Tracks, PreZify Local, and Global Catalog
  // ==========================================
  if (req.method === 'GET' && pathname === '/api/global/search') {
    const term = String(query.q || '').trim();
    if (!term) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, count: 0, fullTrackCount: 0, warnings: [], results: [] }));
      return;
    }
    if (term.length > 100) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Search terms must be 100 characters or fewer.' }));
      return;
    }

    try {
      const localResults = searchLocalSongs(term);
      let audiusSearch = { results: [], warnings: [] };
      try {
        audiusSearch = await fetchAudiusSearch(term, 15);
      } catch (error) {
        console.error('[Global Search] Audius unavailable:', error.message);
        audiusSearch.warnings = ['Audius search is temporarily unavailable; local results are shown.'];
      }

      const seen = new Set();
      const combined = [];

      for (const track of [...localResults, ...audiusSearch.results]) {
        const key = track.type === 'track'
          ? `track:${track.title.toLowerCase()}:${track.artist.toLowerCase()}`
          : `${track.type}:${track.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          combined.push(track);
        }
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      });
      res.end(JSON.stringify({
        success: true,
        query: term,
        count: combined.length,
        fullTrackCount: combined.filter(t => t.type === 'track' && t.playbackAvailable && t.fullTrack).length,
        warnings: audiusSearch.warnings,
        results: combined
      }));
    } catch (error) {
      console.error('[Global Search] Error:', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Global music search encountered an internal error.' }));
    }
    return;
  }

  const audiusStreamMatch = pathname.match(/^\/api\/audius\/tracks\/([a-zA-Z0-9_-]+)\/stream$/);
  if (req.method === 'GET' && audiusStreamMatch) {
    streamAudiusTrack(req, res, audiusStreamMatch[1]);
    return;
  }

  // ==========================================
  // API ROUTE: GET /api/stream/proxy?url=...
  // Universal audio proxy with HTTP 206 Partial Content (Supports fast scrub & seek)
  // ==========================================
  if (req.method === 'GET' && pathname === '/api/stream/proxy') {
    const rawUrl = String(query.url || '').trim();
    if (!rawUrl || !/^https?:\/\//i.test(rawUrl)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Invalid or missing audio stream URL.' }));
      return;
    }

    try {
      const parsedStreamUrl = new URL(rawUrl);
      const allowedHosts = [
        'audius.co',
        'audiusindex.org',
        'open-audio-validator.com',
        'figment.io',
        'monophonic.digital',
        'apple.com',
        'itunes.apple.com',
        'mzstatic.com',
        'radio-browser.info'
      ];
      const isAllowed = parsedStreamUrl.hostname.includes('audius') || allowedHosts.some(h => parsedStreamUrl.hostname === h || parsedStreamUrl.hostname.endsWith('.' + h));
      if (!isAllowed) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Host not permitted for proxy streaming.' }));
        return;
      }

      const client = parsedStreamUrl.protocol === 'https:' ? https : http;
      const headers = {
        'User-Agent': 'PreZifyMusic/2.0 (Windows NT 10.0; Win64; x64)'
      };
      if (req.headers.range) {
        headers['Range'] = req.headers.range;
      }

      const upstreamReq = client.get(rawUrl, { headers }, (upstreamRes) => {
        if (upstreamRes.statusCode >= 300 && upstreamRes.statusCode < 400 && upstreamRes.headers.location) {
          const redirectUrl = upstreamRes.headers.location;
          res.writeHead(302, { 'Location': `/api/stream/proxy?url=${encodeURIComponent(redirectUrl)}` });
          res.end();
          return;
        }

        const statusCode = upstreamRes.statusCode || 200;
        const resHeaders = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Range, Content-Type',
          'Content-Type': upstreamRes.headers['content-type'] || 'audio/mpeg',
          'Accept-Ranges': 'bytes'
        };

        if (upstreamRes.headers['content-length']) {
          resHeaders['Content-Length'] = upstreamRes.headers['content-length'];
        }
        if (upstreamRes.headers['content-range']) {
          resHeaders['Content-Range'] = upstreamRes.headers['content-range'];
        }

        res.writeHead(statusCode, resHeaders);
        upstreamRes.pipe(res);
      });

      upstreamReq.on('error', (err) => {
        console.error('[Stream Proxy] Error:', err.message);
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Audio stream unavailable.' }));
        }
      });
      upstreamReq.setTimeout(15000, () => {
        upstreamReq.destroy(new Error('Stream request timed out'));
      });
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Internal streaming proxy error.' }));
      }
    }
    return;
  }

  // ==========================================
  // API ROUTE: GET /api/spotify/config
  // Returns status of Spotify Web Playback SDK credentials from .env
  // ==========================================
  if (req.method === 'GET' && pathname === '/api/spotify/config') {
    const configured = Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      configured,
      clientId: configured ? process.env.SPOTIFY_CLIENT_ID : null,
      message: configured
        ? 'Spotify Web Playback SDK integration is configured.'
        : 'Spotify Developer credentials not found in .env. Authorized full-track streaming via Audius & PreZify Master is active.'
    }));
    return;
  }

  // ==========================================
  // API ROUTE 9: GET /api/search?q=query
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

