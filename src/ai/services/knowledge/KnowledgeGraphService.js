import KnowledgeNodeRepository from '../../../database/repositories/knowledge/KnowledgeNodeRepository';
import KnowledgeEdgeRepository from '../../../database/repositories/knowledge/KnowledgeEdgeRepository';
import { Logger } from '../../../utils/logger/Logger';

class KnowledgeGraphService {
  async createNode(nodeType, displayName, metadata = {}) {
    return KnowledgeNodeRepository.create({
      nodeType,
      displayName,
      metadata: JSON.stringify(metadata)
    });
  }

  async createRelationship(sourceNodeId, targetNodeId, relationshipType, confidenceScore = 1.0, metadata = {}) {
    return KnowledgeEdgeRepository.create({
      sourceNodeId,
      targetNodeId,
      relationshipType,
      confidenceScore,
      metadata: JSON.stringify(metadata)
    });
  }

  async getRelatedNodes(nodeId, maxDepth = 1) {
    try {
      // In a real graph DB this is a traversal. In SQLite we do simple joins.
      // Phase 18 limits to 1 level depth for performance.
      const outgoing = await KnowledgeEdgeRepository.findBySource(nodeId);
      const incoming = await KnowledgeEdgeRepository.findByTarget(nodeId);

      const relatedIds = new Set();
      outgoing.forEach(e => relatedIds.add(e.targetNodeId));
      incoming.forEach(e => relatedIds.add(e.sourceNodeId));

      const nodes = [];
      for (const id of relatedIds) {
        const node = await KnowledgeNodeRepository.findById(id);
        if (node) nodes.push(node);
      }

      return nodes;
    } catch (e) {
      Logger.error(`Error getting related nodes for ${nodeId}`, e);
      return [];
    }
  }
}

export default new KnowledgeGraphService();
