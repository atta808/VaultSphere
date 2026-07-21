import BaseRepository from '../BaseRepository';

class AuditTrailRepository extends BaseRepository {
  constructor() {
    super('audit_trail');
    this.hasSoftDeletes = false; // Audit logs are immutable and generally not deleted
  }
}

export default new AuditTrailRepository();
