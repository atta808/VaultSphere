import { RecentPageRepository } from '../../database/repositories/RecentPageRepository';

export class RecentPageService {
  constructor() {
    this.repo = new RecentPageRepository();
  }

  async logPageAccess(documentId, pageNumber) {
    if (!documentId || !pageNumber) return;
    return await this.repo.logAccess(documentId, pageNumber);
  }

  async getRecentPages(limit = 10) {
    return await this.repo.getRecentPages(limit);
  }
}

export default new RecentPageService();
