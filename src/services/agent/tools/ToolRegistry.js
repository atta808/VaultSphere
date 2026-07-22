class ToolRegistry {
  constructor() {
    this.tools = new Map();
  }

  registerTool(toolDefinition) {
    if (!toolDefinition.name) {
      throw new Error('Tool must have a name');
    }
    this.tools.set(toolDefinition.name, toolDefinition);
  }

  getTool(name) {
    return this.tools.get(name);
  }

  getAllTools() {
    return Array.from(this.tools.values());
  }

  // Gets the schemas formatted for LLMs
  getToolSchemas() {
    return this.getAllTools().map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      outputSchema: tool.outputSchema
    }));
  }
}

export default new ToolRegistry();
