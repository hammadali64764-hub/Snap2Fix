import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function SocietyRegister() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("register");

  const [registerData, setRegisterData] = useState({
    societyName: "",
    adminName: "",
    cnic: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: name === "email" ? value.trim() : value,
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
  if (!registerData.societyName.trim()) {
    alert("Society name is required");
    return false;
  }

  if (!registerData.adminName.trim()) {
    alert("Admin name is required");
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

  return true;
};

  const handleRegister = async () => {
   if (!validateForm()) return;


    try {
      const res = await fetch("http://localhost:5000/api/society/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("OTP sent to your email");

      localStorage.setItem(
        "societyOtpData",
        JSON.stringify(registerData)
      );

      navigate("/verify-otp", {
        state: {
          role: "societyAdmin",
          formData: registerData,
        },
      });
    } catch {
      alert("Server error");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/society/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("societyToken", data.token);
      localStorage.setItem("societyId", data.societyId);

      alert("Society Login Successful");
      navigate("/admin-dashboard");
    } catch {
      alert("Server error");
    }
  };


return (
  <div style={styles.pageWrapper} className="auth-shell">

    <div style={styles.imageSection} className="auth-art-panel auth-art-admin">
      <div className="auth-art-content">
        <span className="auth-art-badge">Society Admin</span>
        <h1>A refined control room for society operations.</h1>
        <p>Bring residents, providers, approvals, and field updates into a single professional workspace.</p>
        <div className="auth-art-card">
          <span>Operations view</span>
          <strong>Organized decisions, faster action</strong>
        </div>
      </div>
    </div>

    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.pageTitle}>Society Admin</h2>

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
              {/* 🔥 YOUR ORIGINAL REGISTER FORM (NO CHANGE) */}
              <h3 style={styles.formTitle}>Register Society</h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>Society Name</label>
                <input
                  name="societyName"
                  placeholder="Enter society name"
                  style={styles.input}
                  onChange={handleRegisterChange}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Admin Name</label>
                <input
                  name="adminName"
                  placeholder="Enter admin name"
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
              <h3 style={styles.formTitle}>Society Login</h3>

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
  page: {
    flex: 1,
    height: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "18px 34px",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  container: {
    width: "100%",
    maxWidth: "430px",
    textAlign: "center",
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
  },
  pageTitle: {
    marginBottom: "10px",
    color: "#0b1c2d",
    fontSize: "20px",
  },
  tabs: {
    display: "flex",
    width: "100%",
    margin: "0 auto 10px",
    border: "1px solid #c9a24d",
    borderRadius: "8px",
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    padding: "8px",
    cursor: "pointer",
    fontWeight: 600,
    backgroundColor: "#f6f7f9",
    color: "#0b1c2d",
    fontSize: "13px",
  },
  activeTab: {
    backgroundColor: "#0b1c2d",
    color: "#c9a24d",
  },
  formBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #eef1f5",
    boxSizing: "border-box",
    boxShadow: "0 18px 40px rgba(11, 28, 45, 0.12)",
  },
  formTitle: {
    marginBottom: "8px",
    color: "#0b1c2d",
    fontSize: "16px",
  },
  formGroup: {
    marginBottom: "7px",
    textAlign: "left",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#0b1c2d",
    marginBottom: "3px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    color: "#0b1c2d",
    borderRadius: "6px",
    border: "1px solid #c9a24d",
    backgroundColor: "#ffffff",
    fontSize: "13px",
    boxSizing: "border-box",
  },
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(16, 17, 17, 0.35)",
  },
  submitBtn: {
    width: "100%",
    marginTop: "8px",
    padding: "9px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#0b1c2d",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "13px",
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

