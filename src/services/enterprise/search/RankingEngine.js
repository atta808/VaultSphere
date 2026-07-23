import { Logger } from '../../../utils/logger/Logger';

/**
 * Ranking Engine
 * Applies configurable weighting to normalized results.
 */
class Engine {
  async rankResults(results, query) {
    Logger.info('Ranking search results...');

    // Sort descending by a computed score
    return results.sort((a, b) => {
      const scoreA = this._computeScore(a, query);
      const scoreB = this._computeScore(b, query);
      return scoreB - scoreA;
    });
  }

  _computeScore(result, query) {
    let score = 0;

    // Keyword match
    if (result.title?.toLowerCase().includes(query.toLowerCase())) {
      score += 10;
    }

    // Freshness (mocked logic)
    if (result.lastModified) {
      const ageMs = Date.now() - new Date(result.lastModified).getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      if (ageDays < 7) score += 5;
    }

    return score;
  }
}

export const RankingEngine = new Engine();
