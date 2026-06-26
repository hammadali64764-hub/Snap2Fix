import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getNotificationRoute, getTokenForRole, markNotificationRead } from "./notificationUtils";

export default function NotificationBell({ role = "resident", listPath = "/notifications" }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const firstLoad = useRef(true);
  const latestId = useRef(null);
  const token = getTokenForRole(role);
  const seenKey = `snap2fix_latest_notification_${role}`;

  useEffect(() => {
    if (!token) return undefined;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!data.success) return;

        setNotifications(data.notifications);
        const newest = data.notifications[0];

        if (firstLoad.current) {
          latestId.current = newest?._id || null;
          firstLoad.current = false;
          if (newest && !newest.read && localStorage.getItem(seenKey) !== newest._id) {
            localStorage.setItem(seenKey, newest._id);
            setToast(newest);
            setTimeout(() => setToast(null), 4500);
          }
          return;
        }

        if (newest && newest._id !== latestId.current) {
          latestId.current = newest._id;
          localStorage.setItem(seenKey, newest._id);
          setToast(newest);
          setTimeout(() => setToast(null), 4500);
        }
      } catch {
        // Keep the header quiet if the API is temporarily unavailable.
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 12000);
    return () => clearInterval(interval);
  }, [token]);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const preview = notifications.slice(0, 4);

  const openNotification = async (notification) => {
    await markNotificationRead(notification._id, token);
    setOpen(false);
    navigate(getNotificationRoute(notification, role));
  };

  return (
    <div style={styles.wrap}>
      <button type="button" style={styles.iconButton} onClick={() => setOpen((value) => !value)} title="Notifications">
        <FaBell style={styles.icon} />
        {unreadCount > 0 && <span style={styles.badge}>{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <strong>Notifications</strong>
            <button type="button" className="notification-view-all" style={styles.viewAll} onClick={() => navigate(listPath)}>View all</button>
          </div>

          {preview.length === 0 ? (
            <div style={styles.empty}>No notifications yet</div>
          ) : (
            preview.map((item) => (
              <button
                type="button"
                key={item._id}
                className="notification-popup-item"
                style={{ ...styles.item, ...(item.read ? {} : styles.unreadItem) }}
                onClick={() => openNotification(item)}
              >
                <span style={styles.itemTitle}>{item.title}</span>
                <span style={styles.itemMessage}>{item.message}</span>
              </button>
            ))
          )}
        </div>
      )}

      {toast && (
        <button type="button" className="notification-toast-button" style={styles.toast} onClick={() => openNotification(toast)}>
          <span style={styles.toastDot} />
          <span>
            <strong>{toast.title}</strong>
            <small>{toast.message}</small>
          </span>
        </button>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    position: "relative",
  },
  iconButton: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    border: "1px solid rgba(201, 162, 77, 0.32)",
    background: "rgba(255, 255, 255, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "relative",
  },
  icon: {
    fontSize: "16px",
    color: "#f3c969",
  },
  badge: {
    position: "absolute",
    top: "-6px",
    right: "-7px",
    minWidth: "18px",
    height: "18px",
    padding: "0 5px",
    borderRadius: "999px",
    background: "#ef4444",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 16px rgba(239, 68, 68, 0.32)",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "48px",
    width: "320px",
    background: "#ffffff",
    color: "#0b1c2d",
    border: "1px solid #dbe2ec",
    borderRadius: "14px",
    boxShadow: "0 22px 45px rgba(11, 28, 45, 0.2)",
    padding: "10px",
    zIndex: 50,
    animation: "snapFadeUp 0.18s ease both",
  },
  dropdownHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 8px 10px",
    fontSize: "14px",
  },
  viewAll: {
    border: "none",
    background: "transparent",
    color: "#b4872c",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
  },
  empty: {
    padding: "18px 8px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "13px",
  },
  item: {
    width: "100%",
    border: "none",
    borderRadius: "10px",
    background: "#f7f9fc",
    padding: "10px",
    textAlign: "left",
    cursor: "pointer",
    display: "grid",
    gap: "4px",
    marginBottom: "8px",
  },
  unreadItem: {
    background: "#eef5ff",
    boxShadow: "inset 3px 0 0 #c9a24d",
  },
  itemTitle: {
    fontSize: "13px",
    fontWeight: 800,
    color: "#0b1c2d",
  },
  itemMessage: {
    fontSize: "12px",
    lineHeight: 1.45,
    color: "#4b5563",
  },
  toast: {
    position: "fixed",
    right: "22px",
    top: "82px",
    width: "320px",
    border: "1px solid rgba(201, 162, 77, 0.42)",
    borderRadius: "14px",
    background: "#ffffff",
    color: "#0b1c2d",
    boxShadow: "0 22px 50px rgba(11, 28, 45, 0.22)",
    padding: "13px",
    display: "flex",
    gap: "10px",
    textAlign: "left",
    cursor: "pointer",
    zIndex: 80,
    animation: "snapSlideIn 0.24s ease both",
  },
  toastDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#c9a24d",
    marginTop: "5px",
    flexShrink: 0,
  },
};
