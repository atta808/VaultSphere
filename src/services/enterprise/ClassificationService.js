import { DocumentClassificationRepository } from '../../database/repositories/enterprise/DocumentClassificationRepository';
import { governanceEngine } from './GovernanceEngine';

export class ClassificationService {
  constructor() {
    this.classificationRepo = new DocumentClassificationRepository();
  }

  async assignClassification(entityType, entityId, classificationLevel) {
    return await this.classificationRepo.create({
      entityType,
      entityId,
      classificationLevel
    });
  }

  async resolveClassification(entityType, entityId) {
    return await governanceEngine.resolveClassification(entityType, entityId);
  }
}

export const classificationService = new ClassificationService();
