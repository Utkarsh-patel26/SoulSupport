const Notification = require("../models/Notification.model");
const logger = require("../config/logger");

/**
 * Notification Service
 * Handles creation and management of user notifications
 */

const notificationService = {
  /**
   * Create a notification
   */
  create: async (userId, type, title, message, data = {}) => {
    try {
      const notification = new Notification({
        user: userId,
        type, // 'session_reminder', 'review', 'message', 'booking_confirmed', etc.
        title,
        message,
        data,
        read: false,
      });

      await notification.save();
      logger.info(`Notification created for user ${userId}`);

      return notification;
    } catch (error) {
      logger.error("Failed to create notification:", error);
      throw error;
    }
  },

  /**
   * Create multiple notifications (bulk)
   */
  createBulk: async (userIds, type, title, message, data = {}) => {
    try {
      const notifications = await Notification.insertMany(
        userIds.map((userId) => ({
          user: userId,
          type,
          title,
          message,
          data,
          read: false,
        }))
      );

      logger.info(`${userIds.length} notifications created`);

      return notifications;
    } catch (error) {
      logger.error("Failed to create bulk notifications:", error);
      throw error;
    }
  },

  /**
   * Get user notifications
   */
  getUserNotifications: async (userId, { page = 1, limit = 10, unreadOnly = false } = {}) => {
    try {
      const query = { user: userId };
      if (unreadOnly) {
        query.read = false;
      }

      const total = await Notification.countDocuments(query);
      const skip = (page - 1) * limit;

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return {
        data: notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Failed to get user notifications:", error);
      throw error;
    }
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read: true, readAt: new Date() },
        { new: true }
      );

      return notification;
    } catch (error) {
      logger.error("Failed to mark notification as read:", error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead: async (userId) => {
    try {
      await Notification.updateMany(
        { user: userId, read: false },
        { read: true, readAt: new Date() }
      );

      logger.info(`All notifications marked as read for user ${userId}`);
    } catch (error) {
      logger.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  },

  /**
   * Delete notification
   */
  delete: async (notificationId) => {
    try {
      await Notification.findByIdAndDelete(notificationId);
      logger.info(`Notification ${notificationId} deleted`);
    } catch (error) {
      logger.error("Failed to delete notification:", error);
      throw error;
    }
  },

  /**
   * Get unread count for user
   */
  getUnreadCount: async (userId) => {
    try {
      const count = await Notification.countDocuments({
        user: userId,
        read: false,
      });

      return count;
    } catch (error) {
      logger.error("Failed to get unread count:", error);
      throw error;
    }
  },

  /**
   * Session reminder notification (called by scheduler)
   */
  sendSessionReminder: async (session) => {
    try {
      const notification = await notificationService.create(
        session.client,
        "session_reminder",
        "Upcoming Therapy Session",
        `Your session with ${session.therapist.user.fullName} is coming up soon`,
        {
          sessionId: session._id,
          therapistId: session.therapist._id,
          date: session.date,
        }
      );

      return notification;
    } catch (error) {
      logger.error("Failed to send session reminder:", error);
      throw error;
    }
  },

  /**
   * New review notification
   */
  notifyNewReview: async (therapistId, reviewerName) => {
    try {
      const notification = await notificationService.create(
        therapistId,
        "new_review",
        "New Review",
        `${reviewerName} left you a review`,
        { reviewerName }
      );

      return notification;
    } catch (error) {
      logger.error("Failed to notify new review:", error);
      throw error;
    }
  },

  /**
   * Booking confirmation notification
   */
  notifyBookingConfirmed: async (clientId, therapistName) => {
    try {
      const notification = await notificationService.create(
        clientId,
        "booking_confirmed",
        "Booking Confirmed",
        `Your session with ${therapistName} has been confirmed`,
        { therapistName }
      );

      return notification;
    } catch (error) {
      logger.error("Failed to notify booking confirmed:", error);
      throw error;
    }
  },
};

module.exports = notificationService;
