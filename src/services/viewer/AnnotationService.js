import { AnnotationRepository } from '../../database/repositories/AnnotationRepository';

export class AnnotationService {
  constructor() {
    this.annotationRepo = new AnnotationRepository();
  }

  async getAnnotations(documentId) {
    return await this.annotationRepo.getAnnotationsForDocument(documentId);
  }

  async createAnnotation(annotationData) {
    if (!annotationData.id) {
      annotationData.id = this.annotationRepo.generateUUID();
    }
    return await this.annotationRepo.create(annotationData);
  }

  async updateAnnotation(id, data) {
    return await this.annotationRepo.update(id, data);
  }

  async deleteAnnotation(id) {
    return await this.annotationRepo.delete(id, true);
  }
}

export default new AnnotationService();
