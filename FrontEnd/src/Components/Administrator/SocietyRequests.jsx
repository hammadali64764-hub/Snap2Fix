import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminLoggedIn, logoutAdmin } from "../../utils/adminAuth";


export default function SocietyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/administrator-login");
    }
  }, [navigate]);

  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/administrator/requests"
        );
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        alert("Failed to fetch society requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this society?")) return;

    try {
      await fetch(
        `http://localhost:5000/api/administrator/approve/${id}`,
        { method: "POST" }
      );

    
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Approval failed");
    }
  };

  
  const handleReject = async (id) => {
    if (!window.confirm("Reject this society?")) return;

    try {
      await fetch(
        `http://localhost:5000/api/administrator/reject/${id}`,
        { method: "POST" }
      );

      
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Rejection failed");
    }
  };

  
  const handleLogout = () => {
    logoutAdmin();
    navigate("/administrator-login");
  };

  return (
    
    <div style={styles.page}>
      <div style={styles.container}>
       

        <div style={styles.hero}>
  <h2 style={styles.title}>Society Registration Requests</h2>
  <p style={styles.subtitle}>
    Review and approve society registration applications
  </p>
</div>
        

       
        {loading && (
          <p style={{ textAlign: "center", marginTop: "40px" }}>
            Loading requests...
          </p>
        )}

        
        {!loading && requests.length === 0 && (
          <div style={styles.emptyBox}>
            <h3>No Pending Requests</h3>
            <p>
              All society registration requests have been reviewed.
            </p>
          </div>
        )}

        
        {requests.map((req) => (
          <div style={styles.card} key={req._id}>
            <h3 style={styles.cardTitle}>Society Admin Details</h3>

            <div style={styles.details}>
              <p><b>Society Name:</b> {req.societyName}</p>
              <p><b>Admin Name:</b> {req.adminName}</p>
              <p><b>CNIC:</b> {req.cnic}</p>
              <p><b>Phone:</b> {req.phone}</p>
              <p><b>Email:</b> {req.email}</p>
            </div>

            <div style={styles.buttons}>
              <button
                style={styles.decline}
                onClick={() => handleReject(req._id)}
              >
                Decline
              </button>

              <button
                style={styles.approve}
                onClick={() => handleApprove(req._id)}
              >
                Approve
              </button>
            </div>
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

  hero: {
    background: "#071423",
    color: "#fff",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#cbd5e1",
    fontSize: "14px",
  },

  emptyBox: {
    background: "#fff",
    border: "1px solid #dbe4ee",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
    color: "#64748b",
    boxShadow: "0 14px 32px rgba(7, 20, 35, 0.08)",
  },

  card: {
    background: "#fff",
    border: "1px solid #dbe4ee",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 14px 32px rgba(7, 20, 35, 0.08)",
  },

  cardTitle: {
    marginTop: 0,
    marginBottom: "15px",
    fontSize: "16px",
    fontWeight: "700",
    color: "#071423",
    paddingBottom: "10px",
    borderBottom: "1px solid #e2e8f0",
  },

  details: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "14px 18px",
    fontSize: "13px",
    lineHeight: "1.9",
    color: "#334155",
  },

  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "18px",
  },

  approve: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    background: "#16a34a",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },

  decline: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    background: "#dc2626",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },

  logout: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    background: "#dc2626",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },
};