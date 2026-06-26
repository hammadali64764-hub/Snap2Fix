import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  const role = state?.role;

  const formData =
    role === "societyAdmin"
      ? state?.formData ||
        JSON.parse(localStorage.getItem("societyOtpData"))
      : state?.formData;

  useEffect(() => {
    if (!role || !formData) {
      navigate("/");
    }
  }, [role, formData, navigate]);

  if (!role || !formData) return null;

  const getHeading = () => {
    if (role === "societyAdmin") return "Society Admin OTP Verification";
    if (role === "serviceProvider") return "Service Provider OTP Verification";
    if (role === "resident") return "Resident OTP Verification";
    return "OTP Verification";
  };

  const getSubText = () => {
    if (role === "societyAdmin")
      return "OTP has been sent to Society Admin email";
    if (role === "serviceProvider")
      return "OTP has been sent to Service Provider email";
    if (role === "resident")
      return "OTP has been sent to resident email";
    return "OTP has been sent to your email";
  };


  const getVerifyUrl = () => {
  if (role === "societyAdmin")
    return "http://localhost:5000/api/society/verify-otp";

  if (role === "serviceProvider")
    return "http://localhost:5000/api/provider/verify-otp";

  if (role === "resident")
    return "http://localhost:5000/api/resident/verify-otp";
};
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    setLoading(true);

    try {
      
const url = getVerifyUrl();

      const payload = {
        otp,
        ...formData,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "OTP verification failed");
        return;
      }

      if (role === "societyAdmin") {
        localStorage.removeItem("societyOtpData");
      }

      alert("OTP verified successfully");

      navigate("/pending-approval", {
        state: { role },
      });
    } catch {
      alert("Server error during OTP verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.pageTitle}>{getHeading()}</h2>

        <div style={styles.formBox}>
          <h3 style={styles.formTitle}>Verify OTP</h3>

          <p style={{ fontSize: "13px", color: "#0b1c2d" }}>
            {getSubText()}
          </p>

          <div style={styles.formGroup}>
            <label style={styles.label}>Enter OTP</label>
            <input
              style={styles.input}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
            />
          </div>

          <button
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
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
    alignItems: "center",
    backgroundColor: "#f6f7f9",
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
    margin: "0 auto",
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #d8dee8",
    boxSizing: "border-box",
    boxShadow: "0 10px 24px rgba(11, 28, 45, 0.08)",
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
    color: "#0b1c2d",
    backgroundColor: "#ffffff",
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
};
