import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdministratorLogin() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/administrator/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("administratorLoggedIn", "true");
      localStorage.setItem("administratorId", data.adminId);

      alert("Administrator Login Successful");
      navigate("/sadmin-dashboard");
    } catch (error) {
      alert("Server error. Try again.");
    }
  };

  return (
    <div style={styles.pageWrapper} className="auth-shell">
      <div style={styles.imageSection} className="auth-art-panel auth-art-super">
        <div className="auth-art-content">
          <span className="auth-art-badge">Administrator</span>
          <h1>Platform oversight with a quieter interface.</h1>
          <p>Designed for clean approvals, reliable visibility, and confident administration.</p>
          <div className="auth-art-card">
            <span>Platform control</span>
            <strong>Structured platform management</strong>
          </div>
        </div>
      </div>

      <div style={styles.page}>
        <div style={styles.container}>
          <h2 style={styles.pageTitle}>Snap2Fix Administrator</h2>

          <div style={styles.formBox}>
            <h3 style={styles.formTitle}>Administrator Login</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Username</label>
              <input
                name="username"
                placeholder="Enter your username"
                style={styles.input}
                onChange={handleChange}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                style={styles.input}
                onChange={handleChange}
              />
            </div>

            <button style={styles.submitBtn} onClick={handleLogin}>
              Login
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: "flex",
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: "#eef1f5",
  },
  imageSection: {
    flex: "0 0 42%",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#0b1c2d",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(0.55) saturate(0.9)",
  },
  page: {
    flex: 1,
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
  },
  pageTitle: {
    marginBottom: "16px",
    color: "#0b1c2d",
    fontSize: "20px",
  },
  formBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #eef1f5",
    boxSizing: "border-box",
    boxShadow: "0 18px 40px rgba(11, 28, 45, 0.12)",
  },
  formTitle: {
    marginBottom: "15px",
    color: "#0b1c2d",
  },
  formGroup: {
    marginBottom: "12px",
    textAlign: "left",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#0b1c2d",
    marginBottom: "4px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "9px 10px",
    borderRadius: "6px",
    border: "1px solid #c9a24d",
    fontSize: "13px",
    backgroundColor: "#ffffff",
    color: "#0b1c2d",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#0b1c2d",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  forgotBtn: {
    width: "100%",
    marginTop: "10px",
    border: "none",
    backgroundColor: "transparent",
    color: "#0b1c2d",
    fontWeight: "600",
    cursor: "pointer",
  },
};

