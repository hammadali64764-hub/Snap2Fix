import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { isAdminLoggedIn } from "../../utils/adminAuth";

export default function ViewSocieties() {
  const navigate = useNavigate();
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/administrator-login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/administrator/societies"
        );
        const data = await res.json();
        setSocieties(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
  <h2 style={styles.title}>Registered Societies</h2>
  <p style={styles.subtitle}>
    List of all registered societies
  </p>
</div>

        {loading && <p>Loading...</p>}

        {!loading && societies.length === 0 && (
          <p style={styles.empty}>No societies found</p>
        )}

        {societies.map((soc) => (
          <div key={soc._id} style={styles.card}>
            <div
              style={styles.header}
              onClick={() => toggle(soc._id)}
            >
              <h3 style={styles.name}>{soc.societyName}</h3>
              <FaChevronDown
                style={{
                  ...styles.icon,
                  transform:
                    openId === soc._id ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>

            {openId === soc._id && (
              <div style={styles.details}>
                <p><b>Admin:</b> {soc.adminName}</p>
                <p><b>Email:</b> {soc.email}</p>
                <p><b>Phone:</b> {soc.phone}</p>
                <p><b>CNIC:</b> {soc.cnic}</p>
                <p><b>Status:</b> Approved</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    minHeight: "calc(100vh - 120px)",
    background: "linear-gradient(180deg, #edf3f8 0%, #f8fafc 100%)",
    padding: "34px 20px 54px",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1120px",
    margin: "0 auto",
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
  },

  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#ffffff",
    margin: 0,
  },

  subtitle: {
    fontSize: "14px",
    color: "#cbd5e1",
    marginTop: "8px",
    marginBottom: 0,
  },

  hero: {
    background: "#071423",
    color: "#fff",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "20px",
  },

  empty: {
    background: "#fff",
    padding: "18px",
    borderRadius: "16px",
    border: "1px solid #dbe4ee",
    color: "#64748b",
  },

  card: {
    background: "#fff",
    border: "1px solid #dbe4ee",
    borderRadius: "16px",
    marginBottom: "14px",
    boxShadow: "0 14px 32px rgba(7, 20, 35, 0.08)",
    overflow: "hidden",
  },

  header: {
    padding: "18px 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },

  name: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#071423",
    margin: 0,
    textAlign: "left", // left aligned
  },

  icon: {
    fontSize: "14px",
    color: "#071423",
    transition: "0.3s",
  },

  details: {
  padding: "16px 22px",
  borderTop: "1px solid #dbe4ee",
  background: "#c7c5c5", // light gray-blue highlight
  color: "#334155",
  lineHeight: "1.8",
  fontSize: "13px",
  textAlign: "left",
},

detailRow: {
  marginBottom: "8px",
  fontSize: "13px",
},
};