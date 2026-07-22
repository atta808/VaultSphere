import DocumentLifecycleRepository from '../../database/repositories/workflow/DocumentLifecycleRepository';

class DocumentLifecycleService {
  async transitionState(documentId, newState, user, notes = '') {
    // const currentState = await DocumentLifecycleRepository.getLatestState(documentId);

    // validate transition, assuming valid for now

    return DocumentLifecycleRepository.create({
      documentId,
      state: newState,
      changedBy: user.id,
      changedAt: new Date().toISOString(),
      notes
    });
  }
}

export default new DocumentLifecycleService();
