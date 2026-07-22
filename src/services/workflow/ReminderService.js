import ReminderRepository from '../../database/repositories/workflow/ReminderRepository';

class ReminderService {
  async scheduleReminder(reminderData) {
    if (!reminderData.uuid) reminderData.uuid = ReminderRepository.generateUUID();
    return ReminderRepository.create(reminderData);
  }

  async processPendingReminders() {
    const reminders = await ReminderRepository.findPendingReminders();
    for (const reminder of reminders) {
      // integrate with NotificationService
      await ReminderRepository.update(reminder.id, { isSent: 1 });
    }
  }
}

export default new ReminderService();
