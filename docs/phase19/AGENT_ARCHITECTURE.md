# Agent Architecture

Agents are specialized personas capable of executing multi-step operations using registered tools.

## Components
- **AgentRegistry:** In-memory configuration registry of available agents.
- **AgentExecutionService:** Orchestrates the interaction between the LLM and the `ToolExecutionService`.
- **AgentMemoryService:** Maintains state and context for agents.

## Built-in Agents
1. **Document Analyst:** Analyzes and extracts facts.
2. **Workflow Assistant:** Automates routing.
3. **Security Assistant:** Validates permissions.
