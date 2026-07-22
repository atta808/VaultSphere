import { DatabaseProvider } from '../../database/DatabaseProvider';

/**
 * Centralized engine for governance resolution and validation.
 */
export class GovernanceEngine {
  /**
   * Resolves the effective classification level for an entity hierarchy.
   */
  async resolveClassification(entityType, entityId) {
    // Basic stub: In a real implementation this would query the DocumentClassificationRepository,
    // and if not found, walk up the hierarchy (e.g. Folder -> Workspace -> Organization)
    // based on business rules.
    const db = DatabaseProvider.getDb();
    const result = await db.getFirstAsync(
      `SELECT classificationLevel FROM document_classifications WHERE entityType = ? AND entityId = ? AND deletedAt IS NULL ORDER BY id DESC LIMIT 1`,
      [entityType, entityId]
    );
    return result ? result.classificationLevel : null;
  }

  /**
   * Resolves the effective retention policy for a document.
   */
  async resolveRetentionPolicy(documentId) {
    // Stub implementation. Priority logic would resolve polymorphic assignments.
    const db = DatabaseProvider.getDb();
    // This query is a simplification. The engine would check Document Type, Category, Folder, etc.
    const result = await db.getFirstAsync(
      `SELECT rp.* FROM retention_policies rp
       JOIN retention_policy_assignments rpa ON rpa.retentionPolicyId = rp.id
       WHERE rpa.entityType = 'Document' AND rpa.entityId = ? AND rp.deletedAt IS NULL AND rpa.deletedAt IS NULL
       ORDER BY rpa.priority DESC LIMIT 1`,
      [documentId]
    );
    return result || null;
  }

  /**
   * Validates if a document is under legal hold.
   */
  async isUnderLegalHold(documentId) {
    const db = DatabaseProvider.getDb();
    const result = await db.getFirstAsync(
      `SELECT COUNT(*) as count FROM legal_hold_documents lhd
       JOIN legal_holds lh ON lhd.legalHoldId = lh.id
       WHERE lhd.documentId = ? AND lh.status = 'Active' AND lh.deletedAt IS NULL AND lhd.deletedAt IS NULL`,
      [documentId]
    );
    return result && result.count > 0;
  }

  /**
   * Checks if a document can be deleted/disposed.
   */
  async canDispose(documentId) {
    const hasLegalHold = await this.isUnderLegalHold(documentId);
    if (hasLegalHold) {
      return false; // Cannot dispose if under legal hold
    }

    // Additional logic for retention policies (e.g., must be past duration) would go here.
    return true;
  }
}

export const governanceEngine = new GovernanceEngine();
