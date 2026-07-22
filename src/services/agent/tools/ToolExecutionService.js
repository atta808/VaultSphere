import ToolRegistry from './ToolRegistry';
import PermissionService from '../../collaboration/PermissionService';
import AuditTrailService from '../../collaboration/AuditTrailService';
import { DeviceEventEmitter } from 'react-native';

class ToolExecutionService {
  constructor() {
    this.pendingApprovals = new Map();
  }

  async executeTool(toolName, inputs, userContext = {}) {
    const tool = ToolRegistry.getTool(toolName);

    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }

    // 1. Validate Permissions
    if (tool.permissionRequirements) {
      const hasPermission = await PermissionService.checkPermission(
        userContext.userId,
        tool.permissionRequirements.resource,
        tool.permissionRequirements.action
      );
      if (!hasPermission) {
         throw new Error(`Permission denied for tool ${toolName}`);
      }
    }

    // 2. Check Human-in-the-Loop
    if (tool.requiresApproval) {
      return this._requestApproval(tool, inputs, userContext);
    }

    // 3. Execute
    return this._runTool(tool, inputs, userContext);
  }

  async _requestApproval(tool, inputs, userContext) {
    return new Promise((resolve, reject) => {
      const approvalId = Date.now().toString();

      this.pendingApprovals.set(approvalId, {
        tool,
        inputs,
        userContext,
        resolve,
        reject
      });

      // Emit event for UI to pick up
      DeviceEventEmitter.emit('AGENT_APPROVAL_REQUIRED', {
        approvalId,
        toolName: tool.name,
        description: tool.description,
        inputs
      });
    });
  }

  async approveExecution(approvalId) {
    const pending = this.pendingApprovals.get(approvalId);
    if (!pending) throw new Error('Invalid or expired approval request');

    this.pendingApprovals.delete(approvalId);

    try {
      const result = await this._runTool(pending.tool, pending.inputs, pending.userContext);
      pending.resolve(result);
      return result;
    } catch (error) {
      pending.reject(error);
      throw error;
    }
  }

  async rejectExecution(approvalId, reason = 'User rejected') {
    const pending = this.pendingApprovals.get(approvalId);
    if (!pending) throw new Error('Invalid or expired approval request');

    this.pendingApprovals.delete(approvalId);
    pending.reject(new Error(reason));
  }

  async _runTool(tool, inputs, userContext) {
    try {
      const result = await tool.handler(inputs, userContext);

      // Audit successful execution
      await AuditTrailService.logEvent({
        action: 'TOOL_EXECUTION',
        resourceType: 'TOOL',
        resourceId: tool.name,
        userId: userContext.userId || 'system',
        details: JSON.stringify({ inputs, status: 'SUCCESS' })
      });

      return result;
    } catch (error) {
      // Audit failed execution
      await AuditTrailService.logEvent({
        action: 'TOOL_EXECUTION',
        resourceType: 'TOOL',
        resourceId: tool.name,
        userId: userContext.userId || 'system',
        details: JSON.stringify({ inputs, status: 'FAILED', error: error.message })
      });
      throw error;
    }
  }
}

export default new ToolExecutionService();
