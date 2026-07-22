import { DeviceEventEmitter } from 'react-native';
import AutomationJobRepository from '../../database/repositories/automation/AutomationJobRepository';
import AutomationHistoryRepository from '../../database/repositories/automation/AutomationHistoryRepository';
import AgentExecutionService from '../agent/AgentExecutionService';
import { Logger } from '../../utils/logger/Logger';

class AutomationHubService {
  constructor() {
    this.subscriptions = [];
    this.supportedEvents = [
      'DOCUMENT_IMPORTED',
      'OCR_COMPLETED',
      'AI_SUMMARY_CREATED',
      'EMBEDDINGS_GENERATED',
      'WORKFLOW_COMPLETED',
      'BACKUP_COMPLETED',
      'REMINDER_TRIGGERED'
    ];
  }

  initialize() {
    this.supportedEvents.forEach(eventName => {
      const sub = DeviceEventEmitter.addListener(eventName, (payload) => {
        this.handleEvent(eventName, payload);
      });
      this.subscriptions.push(sub);
    });
    Logger.info('AutomationHubService initialized');
  }

  teardown() {
    this.subscriptions.forEach(sub => sub.remove());
    this.subscriptions = [];
  }

  async handleEvent(eventName, payload) {
    try {
      const jobs = await AutomationJobRepository.getActiveJobsForTrigger(eventName);

      for (const job of jobs) {
        // Here we'd evaluate `job.conditions` (e.g. JSONLogic or simple rules)
        // For now, assume conditions pass if present

        await this.executeJob(job, payload);
      }
    } catch (error) {
      Logger.error(`Failed to handle automation event ${eventName}`, error);
    }
  }

  async executeJob(job, payload) {
    const history = await AutomationHistoryRepository.create({
      uuid: AutomationHistoryRepository.generateUUID(),
      automationJobId: job.id,
      triggerPayload: JSON.stringify(payload),
      status: 'RUNNING',
      startedAt: new Date().toISOString()
    });

    try {
      const actions = JSON.parse(job.actions);

      // Execute each action sequentially
      for (const action of actions) {
        if (action.type === 'EXECUTE_AGENT') {
           await AgentExecutionService.executeAgent(action.agentName, action.input || JSON.stringify(payload));
        }
        // Could support direct TOOL_EXECUTION or other primitive actions here
      }

      await AutomationHistoryRepository.update(history.id, {
        status: 'COMPLETED',
        completedAt: new Date().toISOString()
      });

    } catch (error) {
      await AutomationHistoryRepository.update(history.id, {
        status: 'FAILED',
        errorData: JSON.stringify({ message: error.message }),
        completedAt: new Date().toISOString()
      });
    }
  }
}

export default new AutomationHubService();
