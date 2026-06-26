import {
  FaBell,
  FaBuilding,
  FaClipboardList,
  FaFileInvoice,
  FaGavel,
  FaHistory,
  FaHome,
  FaSearch,
  FaTasks,
  FaThumbsDown,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";

export const residentMenu = [
  { label: "Dashboard", path: "/resident-dashboard", icon: FaHome },
  { label: "Society Complaint", path: "/society-level-complaint", icon: FaBuilding },
  { label: "Household Complaint", path: "/household-complaint", icon: FaTasks },
  { label: "Complaint Bids", path: "/resident-bids", icon: FaGavel },
  { label: "Track Complaint", path: "/track-complaint", icon: FaSearch },
  { label: "Complaint History", path: "/complaint-history", icon: FaHistory },
  { label: "Notifications", path: "/notifications", icon: FaBell },
  { label: "Edit Profile", path: "/edit-profile", icon: FaUserCircle },
];

export const providerMenu = [
  { label: "Dashboard", path: "/provider-dashboard", icon: FaHome },
  { label: "Available Complaints", path: "/provider-available-complaints", icon: FaClipboardList },
  { label: "Society Complaints", path: "/provider-society-complaints", icon: FaBuilding },
  { label: "Household Complaints", path: "/provider-household-complaints", icon: FaTasks },
  { label: "Resolved Complaints", path: "/provider-resolved-complaints", icon: FaHistory },
  { label: "Unsatisfactory", path: "/provider-unsatisfactory", icon: FaThumbsDown },
  { label: "Feedback", path: "/provider-feedback", icon: FaFileInvoice },
  { label: "Notifications", path: "/provider-notifications", icon: FaBell },
  { label: "Edit Profile", path: "/provider/edit-profile", icon: FaUserCircle },
];

export const adminMenu = [
  { label: "Dashboard", path: "/admin-dashboard", icon: FaHome },
  { label: "All Complaints", path: "/admin-total-complaints", icon: FaClipboardList },
  { label: "Verify Complaints", path: "/admin-verify-complaints", icon: FaTasks },
  { label: "Bids", path: "/admin-bids", icon: FaGavel },
  { label: "Payments", path: "/admin-payment-records", icon: FaFileInvoice },
  { label: "Providers", path: "/admin-providers", icon: FaUsers },
  { label: "Resident Requests", path: "/admin-resident-requests", icon: FaUsers },
  { label: "Feedback", path: "/admin-view-feedback", icon: FaFileInvoice },
  { label: "Notifications", path: "/admin-notifications", icon: FaBell },
  { label: "Edit Profile", path: "/admin/edit-profile", icon: FaUserCircle },
];

export const administratorMenu = [
  { label: "Dashboard", path: "/sadmin-dashboard", icon: FaHome },
  { label: "Registered Societies", path: "/sadmin-societies", icon: FaBuilding },
  { label: "Society Requests", path: "/sadmin-requests", icon: FaClipboardList },
];
