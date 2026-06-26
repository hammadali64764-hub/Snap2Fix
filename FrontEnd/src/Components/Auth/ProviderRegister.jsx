import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProviderRegister() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("register");
  const [services, setServices] = useState([]);
  const [societies, setSocieties] = useState([]);

  const [registerData, setRegisterData] = useState({
    company: "",
    name: "",
    cnic: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    society: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const serviceList = [
    "Electric Services",
    "Road Repair Services",
    "Garbage Management Services",
    "Security Services",
    "Gardening",
  ];

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

  const toggleService = (service) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const validateForm = () => {
  if (!registerData.company.trim()) {
    alert("Company name is required");
    return false;
  }

  if (!registerData.name.trim()) {
    alert("Provider name is required");
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

  if (services.length === 0) {
    alert("Please select at least one service");
    return false;
  }

  return true;
};

  const handleRegister = async () => {

    if (!validateForm()) return;

    

    const payload = { ...registerData, services };

    try {
      const res = await fetch("http://localhost:5000/api/provider/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("OTP sent to your email");

      navigate("/verify-otp", {
        state: {
          role: "serviceProvider",
          formData: payload,
        },
      });
    } catch {
      alert("Server error");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/provider/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("providerToken", data.token);
      localStorage.setItem("providerId", data.providerId);

      navigate("/provider-dashboard");
    } catch {
      alert("Server error");
    }
  };

  return (
    <div style={styles.pageWrapper} className="auth-shell provider-auth-shell">
      <div style={styles.imageSection} className="auth-art-panel auth-art-provider">
        <div className="auth-art-content">
          <span className="auth-art-badge">Provider Workspace</span>
          <h1>Service work with a sharper workflow.</h1>
          <p>A focused provider portal for clear opportunities, smooth coordination, and trusted completion records.</p>
          <div className="auth-art-card">
            <span>Bid pipeline</span>
            <strong>Cleaner service coordination</strong>
          </div>
        </div>
      </div>

      <div style={styles.page}>
        <div style={styles.container}>
          <h2 style={styles.pageTitle}>Service Provider</h2>

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
                <h3 style={styles.formTitle}>Register Provider</h3>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Company Name</label>
                  <input
                    name="company"
                    placeholder="Enter company name"
                    style={styles.input}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Provider Name</label>
                  <input
                    name="name"
                    placeholder="Enter provider name"
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
                  <label style={styles.label}>Society</label>
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

                <div style={styles.formGroup}>
                  <label style={styles.label}>Services</label>
                  <div style={styles.checkboxBox}>
                    {serviceList.map((s) => (
                      <label key={s} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          onChange={() => toggleService(s)}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

                <button style={styles.submitBtn} onClick={handleRegister}>
                  Register & Get OTP
                </button>
              </>
            ) : (
              <>
                <h3 style={styles.formTitle}>Provider Login</h3>

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
    height: "100vh",
    overflow: "hidden",
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
    height: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "18px 34px",
    boxSizing: "border-box",
    overflowY: "auto",
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
    borderRadius: "6px",
    border: "1px solid #c9a24d",
    fontSize: "13px",
    backgroundColor: "#ffffff",
    color: "#0b1c2d",
    boxSizing: "border-box",
  },

  checkboxBox: {
    border: "1px solid #c9a24d",
    padding: "8px",
    borderRadius: "6px",
    maxHeight: "120px",
    overflowY: "auto",
    backgroundColor: "#fff",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#0b1c2d",
    fontSize: "12px",
    marginBottom: "5px",
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