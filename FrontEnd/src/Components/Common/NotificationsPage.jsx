import { useEffect, useState } from "react";
import { FaBell, FaCheckCircle, FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getNotificationRoute, getTokenForRole, markNotificationRead } from "./notificationUtils";

export default function NotificationsPage({
  role = "resident",
  title = "Notifications",
  subtitle = "Stay updated on complaint activity and assignments.",
}) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getTokenForRole(role);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setNotifications(data.notifications);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  const openNotification = async (notification) => {
    await markNotificationRead(notification._id, token);
    navigate(getNotificationRoute(notification, role));
  };

  const canWriteFeedback = (notification) => {
    const text = `${notification.title} ${notification.message}`.toLowerCase();
    return role === "resident" && (text.includes("resolved") || text.includes("completed"));
  };

  return (
    <div className="snap-page">
      <section className="snap-hero compact">
        <span className="snap-kicker">Notification center</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </section>

      <div className="snap-panel notification-list-panel">
        {loading ? (
          <div className="snap-empty">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="snap-empty">No notifications yet.</div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification._id}
              className={`notification-card ${notification.read ? "" : "unread"}`}
              onClick={() => openNotification(notification)}
            >
              <span className="notification-icon">
                {notification.read ? <FaCheckCircle /> : <FaBell />}
              </span>
              <span className="notification-copy">
                <strong>{notification.title}</strong>
                <span>{notification.message}</span>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
                {canWriteFeedback(notification) && (
                  <span className="notification-action">
                    <FaCommentDots /> Write feedback
                  </span>
                )}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
