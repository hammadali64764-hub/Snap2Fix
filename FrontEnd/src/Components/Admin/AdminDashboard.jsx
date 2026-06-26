import {
  FaClipboardList,
  FaCheckCircle,
  FaHourglassHalf,
  FaUserPlus,
  FaUsers,
  FaGavel,
  FaFileInvoice,
  FaShieldAlt,
  FaTools,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const getCardStyle = (name) => ({
    ...styles.card,
    backgroundColor: hovered === name ? "#0B1C2D" : "#ffffff",
    color: hovered === name ? "#c9a24d" : "#c9a24d",
    transform: hovered === name ? "translateY(-6px)" : "translateY(0)",
    boxShadow:
      hovered === name
        ? "0 24px 46px rgba(11, 28, 45, 0.2)"
        : "0 18px 38px rgba(11, 28, 45, 0.09)",
    transition: "all 0.22s ease",
  });

  const getIconStyle = (name) => ({
    ...styles.icon,
    color: hovered === name ? "#c9a24d" : "#c9a24d",
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.visual}>
          <span style={styles.heroChip}>Society command center</span>
          <h2 style={styles.heroTitle}>Manage complaints, bids, providers, and payments with clarity.</h2>
          <p style={styles.heroText}>
            A professional control view for approvals, negotiations, resolution checks, and resident feedback.
          </p>
        </section>

        <div style={styles.grid}>

          <div
            style={getCardStyle("total")}
            onMouseEnter={() => setHovered("total")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin-total-complaints")}
          >
            <FaTools style={getIconStyle("total")} />
            <p>Repair Complaints</p>
          </div>

          <div
            style={getCardStyle("resolved")}
            onMouseEnter={() => setHovered("resolved")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin-resolved-complaints")}
          >
            <FaCheckCircle style={getIconStyle("resolved")} />
            <p>Resolved Complaints</p>
          </div>

          <div
            style={getCardStyle("pending")}
            onMouseEnter={() => setHovered("pending")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin-pending-complaints")}
          >
            <FaHourglassHalf style={getIconStyle("pending")} />
            <p>Pending Complaints</p>
          </div>

          <div
            style={getCardStyle("providerReq")}
            onMouseEnter={() => setHovered("providerReq")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin-provider-requests")}
          >
            <FaUserPlus style={getIconStyle("providerReq")} />
            <p>Service Provider Registration Requests</p>
          </div>

          <div
            style={getCardStyle("providers")}
            onMouseEnter={() => setHovered("providers")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin-providers")}
          >
            <FaUsers style={getIconStyle("providers")} />
            <p>View List of Service Providers</p>
          </div>

          <div
            style={getCardStyle("bids")}
            onMouseEnter={() => setHovered("bids")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin-bids")}
          >
            <FaGavel style={getIconStyle("bids")} />
            <p>List of Bids</p>
          </div>

          <div
            style={getCardStyle("authority")}
            onMouseEnter={() => setHovered("authority")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin-authority-complaints")}
          >
            <FaShieldAlt style={getIconStyle("authority")} />
            <p>Authority Complaints</p>
          </div>

          <div
            style={getCardStyle("verify")}
            onMouseEnter={() => setHovered("verify")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin-verify-complaints")}
          >
            <FaClipboardList style={getIconStyle("verify")} />
            <p>Verify Complaints</p>
          </div>

          <div
            style={getCardStyle("payments")}
            onMouseEnter={() => setHovered("payments")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin-payment-records")}
          >
            <FaFileInvoice style={getIconStyle("payments")} />
            <p>View Payment Records</p>
          </div>

          <div
            style={getCardStyle("residentReq")}
            onMouseEnter={() => setHovered("residentReq")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin-resident-requests")}
          >
            <FaFileInvoice style={getIconStyle("residentReq")} />
            <p>Resident Requests</p>
          </div>

         
        </div>
      </div>
    </div>
  );
}

const styles = { 
  page: { 
    width: "100vw", 
    background: "radial-gradient(circle at 12% 0%, rgba(201, 162, 77, 0.18), transparent 24rem), linear-gradient(180deg, #edf3f8 0%, #f8fafc 100%)", 
    display: "flex", 
    justifyContent: "center", 
    padding: "42px 20px 60px", 
    boxSizing: "border-box", 
  }, 
  container: { 
    width: "100%", 
    maxWidth: "1200px", 
    textAlign: "center", 
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif', 
  }, 
  title: { 
    fontSize: "26px", 
    fontWeight: 800,
    color: "#0b1c2d", 
    margin: "0 0 34px", 
  }, 
  visual: {
    minHeight: "260px",
    borderRadius: "24px",
    marginBottom: "24px",
    padding: "34px",
    textAlign: "left",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    background:
      'linear-gradient(90deg, rgba(7, 20, 35, 0.92), rgba(7, 20, 35, 0.42)), url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 28px 70px rgba(7, 20, 35, 0.24)",
  },
  heroChip: {
    width: "fit-content",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.13)",
    color: "#f3c969",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  heroTitle: {
    maxWidth: "700px",
    margin: "16px 0 10px",
    fontSize: "34px",
    lineHeight: 1.08,
  },
  heroText: {
    maxWidth: "560px",
    margin: 0,
    color: "#dbe7f0",
    fontSize: "14px",
    lineHeight: 1.7,
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
    gap: "18px", 
    justifyItems: "center", 
  },
  card: { 
    width: "100%", 
    minHeight: "132px", 
    border: "1px solid #dbe4ee", 
    borderRadius: "18px", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    cursor: "pointer", 
    textAlign: "center", 
    padding: "0 10px",
  },
  icon: { 
    fontSize: "26px", 
    marginBottom: "8px",
  }, 
};
