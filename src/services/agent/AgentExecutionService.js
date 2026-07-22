import AIAssistantService from '../../ai/services/AIAssistantService';
import ToolExecutionService from './tools/ToolExecutionService';
import AgentRegistry from './AgentRegistry';
import ToolRegistry from './tools/ToolRegistry';
import AgentExecutionRepository from '../../database/repositories/agent/AgentExecutionRepository';
import PermissionService from '../security/PermissionService';

class AgentExecutionService {
  async executeAgent(agentName, input, userContext = {}) {
    const agent = AgentRegistry.getAgent(agentName);
    if (!agent) {
      throw new Error(`Agent ${agentName} not found`);
    }

    // 1. Record Execution Start
    const execution = await AgentExecutionRepository.create({
      uuid: AgentExecutionRepository.generateUUID(),
      agentId: agent.id || 0, // In reality, we'd lookup ID from DB if dynamic
      status: 'RUNNING',
      triggerSource: 'MANUAL',
      inputData: JSON.stringify(input)
    });

    try {
      // 2. Setup Context for AIAssistantService
      const toolSchemas = ToolRegistry.getToolSchemas();

      const systemPrompt = `
        You are ${agent.name}. ${agent.description}
        Your system instructions: ${agent.systemPrompt}

        Available tools:
        ${JSON.stringify(toolSchemas, null, 2)}

        If you need to use a tool, format your response as a JSON object:
        { "tool": "ToolName", "inputs": { ... } }
      `;

      // 3. Initial AI Call (Building on AIAssistantService)
      // Note: In a real implementation, we'd loop this if the tool returns data to the LLM.
      // For this phase, we'll demonstrate a simplified 1-turn tool execution.

      const conversationId = `agent_exec_${execution.uuid}`;
      const aiResponse = await AIAssistantService.chat(
        conversationId,
        input,
        systemPrompt
      );

      let finalResult = aiResponse.text;

      // 4. Parse for Tool Execution Request
      // This is a naive parser for the phase requirements. Real function calling
      // relies on the LLM provider's native tool calling format (which AIAssistantService would abstract).
      try {
        const potentialToolCall = JSON.parse(aiResponse.text);
        if (potentialToolCall.tool && potentialToolCall.inputs) {
           // 5. Execute Tool
           const toolResult = await ToolExecutionService.executeTool(
             potentialToolCall.tool,
             potentialToolCall.inputs,
             userContext
           );

           // Optionally feed result back to LLM here in a multi-turn setup.
           finalResult = `Tool executed successfully. Result: ${JSON.stringify(toolResult)}`;
        }
      } catch (e) {
        // Not a JSON tool call, just regular text response
      }

      // 6. Record Completion
      await AgentExecutionRepository.update(execution.id, {
        status: 'COMPLETED',
        outputData: JSON.stringify({ result: finalResult }),
        completedAt: new Date().toISOString()
      });

      return finalResult;

    } catch (error) {
       // 7. Record Failure
       await AgentExecutionRepository.update(execution.id, {
        status: 'FAILED',
        errorData: JSON.stringify({ message: error.message }),
        completedAt: new Date().toISOString()
      });
      throw error;
    }
  }
}

export default new AgentExecutionService();
