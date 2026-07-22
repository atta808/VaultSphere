import BaseRepository from '../BaseRepository';

export class SignatureHistoryRepository extends BaseRepository {
  constructor() {
    super('signature_history');
  }

  async findBySignatureId(signatureId) {
    return this.db.getAllAsync('SELECT * FROM signature_history WHERE signatureId = ? ORDER BY timestamp DESC', [signatureId]);
  }
}

export default new SignatureHistoryRepository();
