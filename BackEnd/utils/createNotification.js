const Notification = require("../models/Notification");

const createNotification = async ({
  recipientRole,
  recipientId,
  title,
  message,
  type = "info",
  complaintId = null,
}) => {
  if (!recipientRole || !recipientId || !title || !message) {
    return null;
  }

  return Notification.create({
    recipientRole,
    recipientId,
    title,
    message,
    type,
    complaintId,
  });
};

module.exports = createNotification;
