const LocalProvider = require('./localProvider');
const AudiusProvider = require('./audiusProvider');
const JamendoProvider = require('./jamendoProvider');
const CommercialProvider = require('./commercialProvider');

class MusicProviderManager {
  constructor() {
    this.providers = {
      local: new LocalProvider(),
      audius: new AudiusProvider({ appName: process.env.AUDIUS_APP_NAME || 'PREZIFY' }),
      jamendo: new JamendoProvider({ clientId: process.env.JAMENDO_CLIENT_ID || '' }),
      commercial: new CommercialProvider({
        providerType: process.env.COMMERCIAL_PROVIDER || 'none',
        apiKey: process.env.COMMERCIAL_API_KEY || ''
      })
    };
  }

  /**
   * Global Search across all registered providers with full error isolation.
   * If any provider fails or times out, the other providers still succeed.
   * Eliminates HTTP 500 error scenarios.
   */
  async globalSearch(query, limit = 15) {
    const term = (query || '').trim();
    if (!term) {
      return { results: [], fullTrackCount: 0, warnings: [] };
    }

    const activeProviders = Object.values(this.providers);
    const searchPromises = activeProviders.map(p =>
      p.search(term, limit).catch(err => ({
        results: [],
        warnings: [`[${p.name}] ${err.message}`]
      }))
    );

    const settled = await Promise.all(searchPromises);

    const mergedResults = [];
    const allWarnings = [];
    const seen = new Set();

    settled.forEach(outcome => {
      if (Array.isArray(outcome.warnings) && outcome.warnings.length > 0) {
        allWarnings.push(...outcome.warnings);
      }

      if (Array.isArray(outcome.results)) {
        outcome.results.forEach(track => {
          const dedupeKey = track.type === 'track'
            ? `track:${(track.title || '').toLowerCase()}:${(track.artist || '').toLowerCase()}`
            : `${track.type}:${track.id}`;

          if (!seen.has(dedupeKey)) {
            seen.add(dedupeKey);
            mergedResults.push(track);
          }
        });
      }
    });

    const fullTrackCount = mergedResults.filter(t => t.type === 'track' && t.playbackAvailable && t.fullTrack).length;

    return {
      results: mergedResults,
      fullTrackCount,
      warnings: allWarnings
    };
  }
}

module.exports = new MusicProviderManager();
