import {
  FaClipboardList,
  FaTasks,
  FaCheckCircle,
  FaThumbsDown,
  FaUserEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProviderDashboard() {
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
          <span style={styles.heroChip}>Provider workspace</span>
          <h2 style={styles.heroTitle}>Find the right jobs and move them forward.</h2>
          <p style={styles.heroText}>
            A practical view for available work, assignments, proof uploads, rework, and resident feedback.
          </p>
        </section>

        <div style={styles.grid}>

          <div
            style={getCardStyle("available")}
            onMouseEnter={() => setHovered("available")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/provider-available-complaints")}
          >
            <FaClipboardList style={getIconStyle("available")} />
            <p>Available Complaints</p>
          </div>

          <div
            style={getCardStyle("society")}
            onMouseEnter={() => setHovered("society")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/provider-society-complaints")}
          >
            <FaTasks style={getIconStyle("society")} />
            <p>Society Complaints</p>
          </div>

          <div
            style={getCardStyle("household")}
            onMouseEnter={() => setHovered("household")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/provider-household-complaints")}
          >
            <FaTasks style={getIconStyle("household")} />
            <p>Household Complaints</p>
          </div>

          <div
            style={getCardStyle("resolved")}
            onMouseEnter={() => setHovered("resolved")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/provider-resolved-complaints")}
          >
            <FaCheckCircle style={getIconStyle("resolved")} />
            <p>Resolved Complaints</p>
          </div>

          <div
            style={getCardStyle("unsatisfactory")}
            onMouseEnter={() => setHovered("unsatisfactory")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/provider-unsatisfactory")}
          >
            <FaThumbsDown style={getIconStyle("unsatisfactory")} />
            <p>Unsatisfactory Complaints</p>
          </div>

          <div
            style={getCardStyle("feedback")}
            onMouseEnter={() => setHovered("feedback")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/provider-feedback")}
          >
            <FaTasks style={getIconStyle("feedback")} />
            <p>View Feedback</p>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    minHeight: "calc(100vh - 120px)",
    display: "flex",
    justifyContent: "center",
    background: "radial-gradient(circle at 12% 0%, rgba(201, 162, 77, 0.18), transparent 24rem), linear-gradient(180deg, #edf3f8 0%, #f8fafc 100%)",
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
      'linear-gradient(90deg, rgba(7, 20, 35, 0.92), rgba(7, 20, 35, 0.42)), url("https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80")',
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
    maxWidth: "620px",
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
    backgroundColor: "#ffffff",
  },

  icon: {
    fontSize: "26px",
    marginBottom: "10px",
  },
};
