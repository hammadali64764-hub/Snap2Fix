import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../Common/NotificationBell";

export default function Header() {
  const navigate = useNavigate();

  const headerStyle = {
    width: "100%",
    height: "60px",
    backgroundColor: "#071423",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 25px",
    boxSizing: "border-box",   
  };

  const logoStyle = {
    color: "#C9A24D",
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "1px",
    cursor: "pointer",
  };

  const rightStyle = {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  };

  const iconWrapper = {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(201, 162, 77, 0.32)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  const iconStyle = {
    fontSize: "18px",
    color: "#C9A24D",
  };

  return (
    <>
      <header style={headerStyle}>
      <div style={logoStyle} onClick={() => navigate("/resident-dashboard")}>
        Snap2Fix
      </div>

      <div style={rightStyle}>
        <NotificationBell role="resident" listPath="/notifications" />

        <div
          style={iconWrapper}
          onClick={() => navigate("/edit-profile")}
          title="Profile"
        >
          <FaUserCircle style={iconStyle} />
        </div>
      </div>
      </header>
    </>
  );
}
