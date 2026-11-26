const BaseMusicProvider = require('./baseProvider');

class AudiusProvider extends BaseMusicProvider {
  constructor(options = {}) {
    super('audius', options);
    this.apiBase = options.apiBase || 'https://api.audius.co';
    this.appName = options.appName || 'PREZIFY';
    this.cache = new Map();
    this.cacheTtlMs = 60 * 1000;
  }

  async fetchEndpoint(resource, query, limit = 15) {
    const targetUrl = new URL(`/v1/${resource}`, this.apiBase);
    targetUrl.searchParams.set('query', query);
    targetUrl.searchParams.set('limit', String(limit));
    targetUrl.searchParams.set('app_name', this.appName);

    const response = await fetch(targetUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(6000)
    });

    if (!response.ok) {
      throw new Error(`Audius ${resource} returned HTTP ${response.status}`);
    }

    const payload = await response.json();
    if (!payload || !Array.isArray(payload.data)) {
      throw new Error(`Audius ${resource} returned invalid response`);
    }
    return payload.data;
  }

  mapTrack(track) {
    const isStreamable = track.is_streamable === true && track.is_stream_gated !== true &&
      typeof track.id === 'string' && track.id.length > 0;
    const audioSrc = isStreamable
      ? `/api/audius/tracks/${encodeURIComponent(track.id)}/stream`
      : '';
    const license = typeof track.license === 'string' && track.license.trim()
      ? `License: ${track.license.trim()}`
      : 'Open Creator Protocol';
    const artwork = track.artwork && (
      track.artwork['480x480'] || track.artwork['1000x1000'] || track.artwork['150x150']
    );

    return this.normalizeTrack({
      id: `audius-${track.id}`,
      type: 'track',
      title: track.title || 'Untitled',
      artist: track.user && (track.user.name || track.user.handle) ? (track.user.name || track.user.handle) : 'Unknown Artist',
      album: track.album || 'Single',
      genre: track.genre || 'Electronic',
      duration: Number.isFinite(track.duration) && track.duration > 0 ? track.duration : null,
      artworkUrl: artwork || 'images/default-cover.jpg',
      audioSrc,
      playbackAvailable: Boolean(audioSrc),
      fullTrack: Boolean(audioSrc),
      rightsStatus: `${license}; authorized via Audius protocol`,
      statusText: audioSrc ? 'Full Song (Authorized)' : 'Metadata only'
    });
  }

  async search(query, limit = 15) {
    const term = (query || '').trim();
    if (!term) return { results: [], warnings: [] };

    const cacheKey = `audius:${term.toLowerCase()}:${limit}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    try {
      const tracks = await this.fetchEndpoint('tracks/search', term, limit);
      const results = tracks
        .filter(t => t && t.id && (t.title || t.name))
        .map(t => this.mapTrack(t));

      const response = { results, warnings: [] };
      if (this.cache.size >= 100) {
        this.cache.delete(this.cache.keys().next().value);
      }
      this.cache.set(cacheKey, { data: response, expiresAt: Date.now() + this.cacheTtlMs });
      return response;
    } catch (err) {
      console.warn('[AudiusProvider] Search notice:', err.message);
      return {
        results: [],
        warnings: [`Audius provider temporarily unreachable: ${err.message}`]
      };
    }
  }
}

module.exports = AudiusProvider;
