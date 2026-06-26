import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("request");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role: "resident",
    identifier: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const requestOtp = async () => {
    if (!form.role || !form.identifier.trim()) {
      alert("Select role and enter email or username");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: form.role,
          email: form.identifier,
          username: form.identifier,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Could not send OTP");
        return;
      }

      alert("Password reset OTP sent");
      setStep("reset");
    } catch {
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!form.otp || !form.newPassword || !form.confirmPassword) {
      alert("Enter OTP and new password");
      return;
    }

    if (form.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: form.role,
          email: form.identifier,
          username: form.identifier,
          otp: form.otp,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Could not reset password");
        return;
      }

      alert("Password reset successfully");
      navigate("/");
    } catch {
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>

        <label style={styles.label}>Account Type</label>
        <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
          <option value="resident">Resident</option>
          <option value="provider">Service Provider</option>
          <option value="societyAdmin">Society Admin</option>
          <option value="administrator">Administrator</option>
        </select>

        <label style={styles.label}>
          {form.role === "administrator" ? "Email or Username" : "Email"}
        </label>
        <input
          name="identifier"
          value={form.identifier}
          onChange={handleChange}
          placeholder={form.role === "administrator" ? "Enter email or username" : "Enter email"}
          style={styles.input}
        />

        {step === "reset" && (
          <>
            <label style={styles.label}>OTP</label>
            <input
              name="otp"
              value={form.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              style={styles.input}
            />

            <label style={styles.label}>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Create new password"
              style={styles.input}
            />

            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              style={styles.input}
            />
          </>
        )}

        <button
          style={styles.submitBtn}
          onClick={step === "request" ? requestOtp : resetPassword}
          disabled={loading}
        >
          {loading ? "Please wait..." : step === "request" ? "Send OTP" : "Reset Password"}
        </button>

        {step === "reset" && (
          <button style={styles.linkBtn} onClick={requestOtp} disabled={loading}>
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f7f9",
    padding: "24px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    border: "1px solid #d8dee8",
    borderRadius: "8px",
    padding: "24px",
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
    boxShadow: "0 10px 24px rgba(11, 28, 45, 0.08)",
  },
  title: {
    color: "#0b1c2d",
    textAlign: "center",
    marginBottom: "18px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#0b1c2d",
    marginTop: "12px",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "9px 10px",
    borderRadius: "6px",
    border: "1px solid #c9a24d",
    boxSizing: "border-box",
    fontSize: "13px",
    color: "#0b1c2d",
    backgroundColor: "#ffffff",
  },
  submitBtn: {
    width: "100%",
    marginTop: "20px",
    padding: "11px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#0b1c2d",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },
  linkBtn: {
    width: "100%",
    marginTop: "10px",
    padding: "9px",
    border: "none",
    backgroundColor: "transparent",
    color: "#0b1c2d",
    fontWeight: "600",
    cursor: "pointer",
  },
};
