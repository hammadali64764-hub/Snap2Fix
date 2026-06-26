import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResidentRegister() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("register");
  const [societies, setSocieties] = useState([]);

  const [registerData, setRegisterData] = useState({
    name: "",
    cnic: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    society: "",
    address: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/society/approved-societies")
      .then((res) => res.json())
      .then((data) => setSocieties(data.societies))
      .catch(() => alert("Failed to load societies"));
  }, []);

  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const validateForm = () => {
  if (!registerData.name.trim()) {
    alert("Name is required");
    return false;
  }

  if (!/^\d{13}$/.test(registerData.cnic)) {
    alert("CNIC must be exactly 13 digits");
    return false;
  }

  if (!/^\d{11}$/.test(registerData.phone)) {
    alert("Phone number must be exactly 11 digits");
    return false;
  }

  if (!/\S+@\S+\.\S+/.test(registerData.email)) {
    alert("Enter a valid email address");
    return false;
  }

  if (registerData.password.length < 6) {
    alert("Password must be at least 6 characters");
    return false;
  }

  if (registerData.password !== registerData.confirmPassword) {
    alert("Passwords do not match");
    return false;
  }

  if (!registerData.society) {
    alert("Please select a society");
    return false;
  }

  return true;
};

  const handleRegister = async () => {
    if (!validateForm()) 
      return; 
      
    

    try {
      const res = await fetch(
        "http://localhost:5000/api/resident/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("OTP sent to your email");

      navigate("/verify-otp", {
        state: {
          role: "resident",
          formData: registerData,
        },
      });
    } catch {
      alert("Server error");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/resident/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("residentToken", data.token);
      localStorage.setItem("residentId", data.residentId);

      navigate("/resident-dashboard");
    } catch {
      alert("Server error");
    }
  };

  return (
    <div style={styles.pageWrapper} className="auth-shell">
      <div style={styles.imageSection} className="auth-art-panel auth-art-resident">
        <div className="auth-art-content">
          <span className="auth-art-badge">Resident Portal</span>
          <h1>A calmer way to keep your home connected.</h1>
          <p>Snap2Fix brings requests, updates, and service conversations into one polished resident space.</p>
          <div className="auth-art-card">
            <span>Live tracking</span>
            <strong>Your society, organized clearly</strong>
          </div>
        </div>
      </div>

      <div style={styles.page}>
        <div style={styles.container}>
          <h2 style={styles.pageTitle}>Resident</h2>

          <div style={styles.tabs}>
            <div
              style={{
                ...styles.tab,
                ...(activeTab === "register" ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab("register")}
            >
              REGISTER
            </div>
            <div
              style={{
                ...styles.tab,
                ...(activeTab === "login" ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab("login")}
            >
              LOGIN
            </div>
          </div>

          <div style={styles.formBox}>
            {activeTab === "register" ? (
              <>
                <h3 style={styles.formTitle}>Register Resident</h3>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Resident Name</label>
                  <input
                    name="name"
                    placeholder="Enter resident name"
                    style={styles.input}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>CNIC</label>
                  <input
                    name="cnic"
                    placeholder="Enter 13-digit CNIC"
                    style={styles.input}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone</label>
                  <input
                    name="phone"
                    placeholder="Enter 11-digit phone number"
                    style={styles.input}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    style={styles.input}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Address</label>
                  <input
                    name="address"
                    placeholder="Enter your address"
                    style={styles.input}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Society</label>
                  <select
                    name="society"
                    style={styles.input}
                    onChange={handleRegisterChange}
                  >
                    <option value="">Select Society</option>
                    {societies.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.societyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create password (min 6 characters)"
                    style={styles.input}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    style={styles.input}
                    onChange={handleRegisterChange}
                  />
                </div>

                <button style={styles.submitBtn} onClick={handleRegister}>
                  Register & Get OTP
                </button>
              </>
            ) : (
              <>
                <h3 style={styles.formTitle}>Resident Login</h3>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    name="email"
                    placeholder="Enter email address"
                    style={styles.input}
                    onChange={handleLoginChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    style={styles.input}
                    onChange={handleLoginChange}
                  />
                </div>

                <button style={styles.submitBtn} onClick={handleLogin}>
                  Login
                </button>
                <button style={styles.forgotBtn} onClick={() => navigate("/forgot-password")}>
                  Forgot password?
                </button>
              </>
            )}
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
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "40px",
    paddingBottom: "40px",
  },
  container: {
    width: "100%",
    maxWidth: "460px",
    textAlign: "center",
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
  },
  pageTitle: {
    marginBottom: "16px",
    color: "#0b1c2d",
    fontSize: "20px",
  },
  tabs: {
    display: "flex",
    width: "100%",
    marginBottom: "15px",
    border: "1px solid #c9a24d",
    borderRadius: "6px",
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    padding: "10px",
    cursor: "pointer",
    fontWeight: 600,
    backgroundColor: "#f6f7f9",
    color: "#0b1c2d",
  },
  activeTab: {
    backgroundColor: "#0b1c2d",
    color: "#c9a24d",
  },
  formBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: "22px",
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

