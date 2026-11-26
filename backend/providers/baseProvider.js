/**
 * PreZify Music Engine – Base Provider Interface
 * All music catalog & streaming providers inherit from this class.
 */

class BaseMusicProvider {
  constructor(name, options = {}) {
    this.name = name;
    this.options = options;
  }

  /**
   * Search provider catalog
   * @param {string} query - Search term
   * @param {number} limit - Maximum results
   * @returns {Promise<{ results: Array, warnings: Array }>}
   */
  async search(query, limit = 15) {
    throw new Error(`search() not implemented in ${this.name}`);
  }

  /**
   * Normalize raw track metadata into PreZify Standard Track Schema
   * @param {Object} rawTrack
   * @returns {Object} PreZify Standard Track
   */
  normalizeTrack(rawTrack) {
    return {
      id: rawTrack.id || `track-${Date.now()}`,
      type: rawTrack.type || 'track',
      title: rawTrack.title || 'Untitled Track',
      artist: rawTrack.artist || 'Unknown Artist',
      album: rawTrack.album || 'Single',
      genre: rawTrack.genre || 'Music',
      duration: Number.isFinite(rawTrack.duration) && rawTrack.duration > 0 ? Math.round(rawTrack.duration) : null,
      artworkUrl: rawTrack.artworkUrl || 'images/default-cover.jpg',
      audioSrc: rawTrack.audioSrc || '',
      playbackAvailable: Boolean(rawTrack.audioSrc),
      fullTrack: Boolean(rawTrack.fullTrack),
      rightsStatus: rawTrack.rightsStatus || 'Standard playback',
      source: this.name,
      statusText: rawTrack.statusText || (rawTrack.fullTrack ? 'Full Song (Authorized)' : 'Catalog Metadata')
    };
  }

  /**
   * Stream track or return streamable URL / proxy details
   * @param {string} trackId
   * @returns {Promise<Object>}
   */
  async getStreamInfo(trackId) {
    throw new Error(`getStreamInfo() not implemented in ${this.name}`);
  }
}

module.exports = BaseMusicProvider;
