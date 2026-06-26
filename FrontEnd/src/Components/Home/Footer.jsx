import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={styles.footer}>
      <div>© {new Date().getFullYear()} Snap2Fix. All rights reserved.</div>

      <div style={styles.links}>
        <span onClick={() => navigate("/about")}>About</span>
        <span onClick={() => navigate("/privacy-policy")}>Privacy Policy</span>
        <span onClick={() => navigate("/terms")}>Terms & Conditions</span>
      </div>

      <div>Version 1.0</div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "linear-gradient(90deg, #020617, #0f172a)",
    color: "#cbd5f5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 40px",
    fontSize: "13px",
  },
  links: {
    display: "flex",
    gap: "20px",
    cursor: "pointer",
    color: "#c9a24d",
  },
};
