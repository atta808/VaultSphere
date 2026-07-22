import AgentRegistry from '../AgentRegistry';
import ToolRegistry from '../tools/ToolRegistry';
import { DeviceEventEmitter } from 'react-native';

export function registerBuiltInAgentsAndTools() {
  // === Register Tools ===

  ToolRegistry.registerTool({
    name: 'OCR_TOOL',
    description: 'Extracts text from an image or PDF document.',
    inputSchema: JSON.stringify({ type: 'object', properties: { documentUri: { type: 'string' } }, required: ['documentUri'] }),
    outputSchema: JSON.stringify({ type: 'object', properties: { text: { type: 'string' } } }),
    permissionRequirements: { resource: 'DOCUMENT', action: 'READ' },
    requiresApproval: false,
    handler: async (inputs) => ({ text: "Simulated OCR Text Result" })
  });

  ToolRegistry.registerTool({
    name: 'SEARCH_TOOL',
    description: 'Searches the vault for documents matching a query.',
    inputSchema: JSON.stringify({ type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }),
    outputSchema: JSON.stringify({ type: 'object', properties: { results: { type: 'array', items: { type: 'object' } } } }),
    permissionRequirements: null,
    requiresApproval: false,
    handler: async (inputs) => ({ results: [{ id: 1, title: 'Found Doc' }] })
  });

  ToolRegistry.registerTool({
    name: 'SEMANTIC_SEARCH_TOOL',
    description: 'Performs semantic vector search on embeddings.',
    inputSchema: JSON.stringify({ type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }),
    outputSchema: JSON.stringify({ type: 'object', properties: { results: { type: 'array', items: { type: 'object' } } } }),
    permissionRequirements: null,
    requiresApproval: false,
    handler: async (inputs) => ({ results: [{ id: 1, title: 'Semantic Doc Result' }] })
  });

  ToolRegistry.registerTool({
    name: 'KNOWLEDGE_GRAPH_TOOL',
    description: 'Queries the knowledge graph for relationships.',
    inputSchema: JSON.stringify({ type: 'object', properties: { entity: { type: 'string' } }, required: ['entity'] }),
    outputSchema: JSON.stringify({ type: 'object', properties: { edges: { type: 'array', items: { type: 'object' } } } }),
    permissionRequirements: null,
    requiresApproval: false,
    handler: async (inputs) => ({ edges: [] })
  });

  ToolRegistry.registerTool({
    name: 'WORKFLOW_TOOL',
    description: 'Executes workflow actions.',
    inputSchema: JSON.stringify({ type: 'object', properties: { workflowId: { type: 'string' }, action: { type: 'string' } }, required: ['workflowId', 'action'] }),
    outputSchema: JSON.stringify({ type: 'object', properties: { success: { type: 'boolean' } } }),
    permissionRequirements: { resource: 'WORKFLOW', action: 'EXECUTE' },
    requiresApproval: true,
    handler: async (inputs) => ({ success: true })
  });

  ToolRegistry.registerTool({
    name: 'DOCUMENT_VIEWER_TOOL',
    description: 'Retrieves document content for viewing.',
    inputSchema: JSON.stringify({ type: 'object', properties: { documentId: { type: 'number' } }, required: ['documentId'] }),
    outputSchema: JSON.stringify({ type: 'object', properties: { content: { type: 'string' } } }),
    permissionRequirements: { resource: 'DOCUMENT', action: 'READ' },
    requiresApproval: false,
    handler: async (inputs) => ({ content: "Document content..." })
  });

  ToolRegistry.registerTool({
    name: 'ANNOTATION_TOOL',
    description: 'Adds annotations to a document.',
    inputSchema: JSON.stringify({ type: 'object', properties: { documentId: { type: 'number' }, text: { type: 'string' } }, required: ['documentId', 'text'] }),
    outputSchema: JSON.stringify({ type: 'object', properties: { success: { type: 'boolean' } } }),
    permissionRequirements: { resource: 'DOCUMENT', action: 'WRITE' },
    requiresApproval: false,
    handler: async (inputs) => ({ success: true })
  });

  ToolRegistry.registerTool({
    name: 'AI_WORKSPACE_TOOL',
    description: 'Executes tasks in the AI workspace.',
    inputSchema: JSON.stringify({ type: 'object', properties: { task: { type: 'string' } }, required: ['task'] }),
    outputSchema: JSON.stringify({ type: 'object', properties: { result: { type: 'string' } } }),
    permissionRequirements: null,
    requiresApproval: false,
    handler: async (inputs) => ({ result: "Task complete" })
  });

  ToolRegistry.registerTool({
    name: 'BACKUP_TOOL',
    description: 'Triggers a vault backup.',
    inputSchema: JSON.stringify({ type: 'object', properties: { type: { type: 'string' } }, required: ['type'] }),
    outputSchema: JSON.stringify({ type: 'object', properties: { success: { type: 'boolean' } } }),
    permissionRequirements: { resource: 'SYSTEM', action: 'BACKUP' },
    requiresApproval: true,
    handler: async (inputs) => ({ success: true })
  });

  ToolRegistry.registerTool({
    name: 'COLLABORATION_TOOL',
    description: 'Shares a document or updates permissions.',
    inputSchema: JSON.stringify({ type: 'object', properties: { documentId: { type: 'number' }, action: { type: 'string' } }, required: ['documentId', 'action'] }),
    outputSchema: JSON.stringify({ type: 'object', properties: { success: { type: 'boolean' } } }),
    permissionRequirements: { resource: 'DOCUMENT', action: 'SHARE' },
    requiresApproval: true,
    handler: async (inputs) => ({ success: true })
  });

  ToolRegistry.registerTool({
    name: 'NOTIFICATION_TOOL',
    description: 'Sends an in-app notification to the user.',
    inputSchema: JSON.stringify({ type: 'object', properties: { title: { type: 'string' }, message: { type: 'string' } }, required: ['title', 'message'] }),
    outputSchema: JSON.stringify({ type: 'object', properties: { success: { type: 'boolean' } } }),
    permissionRequirements: null,
    requiresApproval: false,
    handler: async (inputs) => {
       DeviceEventEmitter.emit('IN_APP_NOTIFICATION', { title: inputs.title, message: inputs.message });
       return { success: true };
    }
  });

  // === Register Agents ===

  AgentRegistry.registerAgent({
    name: 'Document Analyst',
    description: 'Specializes in reading and extracting information from documents.',
    systemPrompt: 'You are a meticulous Document Analyst. You use OCR and search tools to understand documents and extract facts.',
    type: 'ANALYST',
    capabilities: JSON.stringify(['OCR', 'EXTRACTION', 'SUMMARIZATION'])
  });

  AgentRegistry.registerAgent({
    name: 'Legal Research Assistant',
    description: 'Assists with legal document review and case law search.',
    systemPrompt: 'You are a Legal Research Assistant. Use semantic search and knowledge graph to find precedents and analyze contracts.',
    type: 'LEGAL',
    capabilities: JSON.stringify(['SEMANTIC_SEARCH', 'CONTRACT_ANALYSIS'])
  });

  AgentRegistry.registerAgent({
    name: 'Knowledge Assistant',
    description: 'Helps navigate the knowledge graph and discover connections.',
    systemPrompt: 'You are a Knowledge Assistant. Use the knowledge graph tool to answer queries about entity relationships.',
    type: 'KNOWLEDGE',
    capabilities: JSON.stringify(['GRAPH_TRAVERSAL', 'ENTITY_RESOLUTION'])
  });

  AgentRegistry.registerAgent({
    name: 'Workflow Assistant',
    description: 'Helps manage and automate document workflows.',
    systemPrompt: 'You are a Workflow Assistant. You help users manage approvals, reviews, and document routing.',
    type: 'WORKFLOW',
    capabilities: JSON.stringify(['WORKFLOW_MANAGEMENT', 'NOTIFICATIONS'])
  });

  AgentRegistry.registerAgent({
    name: 'Collaboration Assistant',
    description: 'Manages sharing and team interactions.',
    systemPrompt: 'You are a Collaboration Assistant. You help manage document access and notify team members.',
    type: 'COLLABORATION',
    capabilities: JSON.stringify(['PERMISSION_MANAGEMENT', 'SHARING'])
  });

  AgentRegistry.registerAgent({
    name: 'Search Assistant',
    description: 'Optimizes and executes complex vault searches.',
    systemPrompt: 'You are a Search Assistant. Use search tools to find exact documents for users.',
    type: 'SEARCH',
    capabilities: JSON.stringify(['FULL_TEXT_SEARCH', 'FILTERING'])
  });

  AgentRegistry.registerAgent({
    name: 'Security Assistant',
    description: 'Monitors vault security and handles sensitive operations safely.',
    systemPrompt: 'You are a Security Assistant. You evaluate permissions and ask for user approval before sensitive actions.',
    type: 'SECURITY',
    capabilities: JSON.stringify(['PERMISSION_AUDIT', 'DELETION_MANAGEMENT'])
  });

  AgentRegistry.registerAgent({
    name: 'Productivity Assistant',
    description: 'Automates daily tasks and generates insights.',
    systemPrompt: 'You are a Productivity Assistant. Create summaries, set reminders, and use AI workspace tools to save the user time.',
    type: 'PRODUCTIVITY',
    capabilities: JSON.stringify(['TASK_AUTOMATION', 'INSIGHT_GENERATION'])
  });
}
