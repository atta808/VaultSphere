import BaseRepository from '../../database/repositories/BaseRepository';

class NotificationRepository extends BaseRepository {
  constructor() {
    super('notifications');
  }
}

class NotificationService {
  constructor() {
    this.repository = new NotificationRepository();
  }

  async createNotification(title, body, type) {
    const timestamp = new Date().toISOString();
    return this.repository.create({
      title,
      body,
      type,
      isRead: 0,
      createdAt: timestamp,
    });
  }

  async notifyCollaborationEvent(action, _payload) {
    let title = 'Collaboration Update';
    let body = 'A collaboration event occurred.';

    if (action === 'SHARE_INVITATION') {
      title = 'New Share Invitation';
      body = 'You have been invited to collaborate on a document.';
    } else if (action === 'COMMENT_ADDED') {
      title = 'New Comment';
      body = 'Someone commented on your shared document.';
    }

    return this.createNotification(title, body, 'collaboration');
  }

  async getUnreadNotifications() {
    return this.repository.findBy({ isRead: 0 });
  }
}

export default new NotificationService();
