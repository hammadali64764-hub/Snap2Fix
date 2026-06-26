import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaClipboardList } from "react-icons/fa";
import { isAdminLoggedIn, logoutAdmin } from "../../utils/adminAuth";

export default function AdministratorDashboard() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/administrator-login");
    }
  }, [navigate]);

  const getCardStyle = (name) => ({
    ...styles.card,
    backgroundColor: hovered === name ? "#071423" : "#ffffff",
    color: hovered === name ? "#c9a24d" : "#c9a24d",
    transform: hovered === name ? "translateY(-6px)" : "translateY(0)",
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
          <span style={styles.heroChip}>Platform administrator</span>
          <h2 style={styles.heroTitle}>Keep society onboarding clean and controlled.</h2>
          <p style={styles.heroText}>
            Review society requests, approve access, and maintain a polished operating layer for Snap2Fix.
          </p>
        </section>

        <div style={styles.cardGrid}>
          
          <div
            style={getCardStyle("societies")}
            onMouseEnter={() => setHovered("societies")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/sadmin-societies")}
          >
            <FaBuilding size={36} style={getIconStyle("societies")} />
            <h3>View Societies</h3>
            <p>See all registered societies</p>
          </div>

          <div
            style={getCardStyle("requests")}
            onMouseEnter={() => setHovered("requests")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/sadmin-requests")}
          >
            <FaClipboardList size={36} style={getIconStyle("requests")} />
            <h3>Society Requests</h3>
            <p>Approve or reject society registrations</p>
          </div>

        </div>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    width: "100vw",
    minHeight: "calc(100vh - 120px)",
    display: "flex",
    justifyContent: "center",
    background: "radial-gradient(circle at 12% 0%, rgba(201, 162, 77, 0.14), transparent 24rem), linear-gradient(180deg, #e9eef4 0%, #f8fafc 100%)",
    padding: "42px 20px 60px",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "1000px",
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
    textAlign: "center",
  },

  title: {
    fontSize: "24px",
    color: "#0b1c2d",
    marginBottom: "5px",
  },

  subtitle: {
    fontSize: "13px",
    color: "#555",
    marginBottom: "25px",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },

  card: {
    border: "1px solid #dbe4ee",
    borderRadius: "18px",
    backgroundColor: "#ffffff",
    boxShadow: "0 18px 38px rgba(11, 28, 45, 0.09)",
    padding: "24px 15px",
    cursor: "pointer",
  },

  icon: {
    marginBottom: "8px",
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
      'linear-gradient(90deg, rgba(7, 20, 35, 0.92), rgba(7, 20, 35, 0.42)), url("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80")',
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
};
