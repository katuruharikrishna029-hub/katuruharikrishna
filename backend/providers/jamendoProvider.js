const BaseMusicProvider = require('./baseProvider');

class JamendoProvider extends BaseMusicProvider {
  constructor(options = {}) {
    super('jamendo', options);
    this.clientId = options.clientId || process.env.JAMENDO_CLIENT_ID || '';
    this.apiBase = 'https://api.jamendo.com/v3.0';
    this.cache = new Map();
    this.cacheTtlMs = 60 * 1000;
  }

  isConfigured() {
    return Boolean(this.clientId && this.clientId.trim().length > 0);
  }

  async search(query, limit = 15) {
    const term = (query || '').trim();
    if (!term) return { results: [], warnings: [] };

    if (!this.isConfigured()) {
      // Graceful pass: when not configured, provider returns clean empty result without throwing HTTP 500
      return {
        results: [],
        warnings: ['Jamendo provider is ready in modular slot (requires JAMENDO_CLIENT_ID in .env).']
      };
    }

    const cacheKey = `jamendo:${term.toLowerCase()}:${limit}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    try {
      const targetUrl = new URL('/v3.0/tracks', this.apiBase);
      targetUrl.searchParams.set('client_id', this.clientId);
      targetUrl.searchParams.set('format', 'json');
      targetUrl.searchParams.set('limit', String(limit));
      targetUrl.searchParams.set('search', term);
      targetUrl.searchParams.set('include', 'musicinfo');

      const response = await fetch(targetUrl, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(6000)
      });

      if (!response.ok) {
        throw new Error(`Jamendo API responded with HTTP ${response.status}`);
      }

      const payload = await response.json();
      if (!payload || !Array.isArray(payload.results)) {
        throw new Error('Invalid response structure from Jamendo');
      }

      const results = payload.results.map(t => {
        const streamUrl = t.audio || '';
        return this.normalizeTrack({
          id: `jamendo-${t.id}`,
          type: 'track',
          title: t.name || 'Untitled',
          artist: t.artist_name || 'Unknown Artist',
          album: t.album_name || 'Single',
          genre: (t.musicinfo && t.musicinfo.tags && t.musicinfo.tags.genres && t.musicinfo.tags.genres[0]) || 'Creative Commons',
          duration: Number.isFinite(t.duration) ? t.duration : null,
          artworkUrl: t.image || t.album_image || 'images/default-cover.jpg',
          audioSrc: streamUrl ? `/api/stream/proxy?url=${encodeURIComponent(streamUrl)}` : '',
          playbackAvailable: Boolean(streamUrl),
          fullTrack: Boolean(streamUrl),
          rightsStatus: `Creative Commons (${t.license_ccurl || 'CC-BY'})`,
          statusText: 'Creative Commons Full Song'
        });
      });

      const responseData = { results, warnings: [] };
      if (this.cache.size >= 100) {
        this.cache.delete(this.cache.keys().next().value);
      }
      this.cache.set(cacheKey, { data: responseData, expiresAt: Date.now() + this.cacheTtlMs });
      return responseData;
    } catch (err) {
      console.warn('[JamendoProvider] Notice:', err.message);
      return {
        results: [],
        warnings: [`Jamendo search note: ${err.message}`]
      };
    }
  }
}

module.exports = JamendoProvider;
