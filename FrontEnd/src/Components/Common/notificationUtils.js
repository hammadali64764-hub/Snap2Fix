export function getNotificationRoute(notification, role) {
  const text = `${notification?.title || ""} ${notification?.message || ""} ${notification?.type || ""}`.toLowerCase();
  const type = `${notification?.type || ""}`.toLowerCase();

  if (role === "provider") {
    if (type.includes("available_complaint")) return "/provider-available-complaints";
    if (type.includes("rework")) return "/provider-unsatisfactory";
    if (type.includes("feedback")) return "/provider-feedback";
    if (type.includes("proof") || text.includes("approved") || text.includes("resolved") || text.includes("completed")) return "/provider-resolved-complaints";
    if (type.includes("counter") || type.includes("negotiation") || text.includes("counter-offer")) return "/provider-available-complaints";
    if (type.includes("assigned") && (text.includes("household") || text.includes("household service"))) return "/provider-household-complaints";
    if (type.includes("assigned") || text.includes("society complaint") || text.includes("security handling") || text.includes("violence")) return "/provider-society-complaints";
    return "/provider-dashboard";
  }

  if (role === "admin") {
    if (text.includes("violence") || text.includes("violance") || (type.includes("submitted") && text.includes("authority"))) return "/admin-authority-complaints";
    if (type.includes("resolved") || text.includes("resolved") || text.includes("approved")) return "/admin-resolved-complaints";
    if (type.includes("proof") || type.includes("rework")) return "/admin-verify-complaints";
    if (type.includes("feedback")) return "/admin-view-feedback";
    if (text.includes("bid") || text.includes("counter") || text.includes("negotiation")) return "/admin-bids";
    if (text.includes("payment")) return "/admin-payment-records";
    if (text.includes("provider")) return "/admin-providers";
    return "/admin-dashboard";
  }

  if (type.includes("bid") || type.includes("negotiation") || type.includes("counter") || type.includes("available_complaint") || text.includes("bidding")) return "/resident-bids";
  if (type.includes("feedback") || text.includes("resolved") || text.includes("completed")) return "/complaint-history";
  if (type.includes("proof") || type.includes("assigned") || type.includes("submitted") || type.includes("forwarded")) return "/track-complaint";
  return "/resident-dashboard";
}

export function getTokenForRole(role) {
  if (role === "provider") return localStorage.getItem("providerToken");
  if (role === "admin") return localStorage.getItem("societyToken");
  return localStorage.getItem("residentToken");
}

export async function markNotificationRead(notificationId, token) {
  if (!notificationId || !token) return;

  await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
