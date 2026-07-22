# Phase 19 - AI Agent Platform & Automation Hub

## Overview
Phase 19 transforms VaultSphere into an enterprise AI agent platform by introducing intelligent agents, automation orchestration, tool execution, scheduled jobs, proactive insights, and enterprise assistant capabilities. The implementation strictly adheres to the offline-first and human-in-the-loop architectures.

## Architecture
- **Agents:** Configured in `AgentRegistry` and executed via `AgentExecutionService` (built on `AIAssistantService`).
- **Tools:** Defined in `ToolRegistry` with schemas and permissions. Executed via `ToolExecutionService`.
- **Automation Hub:** Subscribes to application events via `DeviceEventEmitter` and conditionally triggers actions.
- **Scheduler:** Manages periodic jobs. Uses a hybrid approach, supporting in-app background timers.
- **Insights:** Proactive insights generator with an `InsightService`.
- **Persistence:** SQLite remains the source of truth, extended via `010_phase19_agent_platform.js` migration.

## Important Design Decisions
- Agents communicate with external models solely through `AIAssistantService`.
- `ToolExecutionService` handles permissions and queues pending approvals for human-in-the-loop validation.
- All actions are auditable.
