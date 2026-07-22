import { registerBuiltInAgentsAndTools } from './builtin/Config';
import AgentService from './AgentService';
import AgentExecutionService from './AgentExecutionService';

// Export everything and provide an initialization hook
export {
  AgentService,
  AgentExecutionService,
  registerBuiltInAgentsAndTools
};
