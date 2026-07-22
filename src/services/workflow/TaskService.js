import TaskRepository from '../../database/repositories/workflow/TaskRepository';
import AuditTrailService from '../collaboration/AuditTrailService';

class TaskService {
  async createTask(taskData, user) {
    if (!taskData.uuid) taskData.uuid = TaskRepository.generateUUID();
    const task = await TaskRepository.create(taskData);
    await AuditTrailService.logAction(user?.id || 'system', 'CREATE_TASK', 'task', task.id);
    return task;
  }

  async completeTask(taskId, user) {
    await TaskRepository.update(taskId, { status: 'completed', completedAt: new Date().toISOString() });
    await AuditTrailService.logAction(user.id, 'COMPLETE_TASK', 'task', taskId);
  }
}

export default new TaskService();
