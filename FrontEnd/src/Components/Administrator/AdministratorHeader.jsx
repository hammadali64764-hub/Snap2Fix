import { useNavigate } from "react-router-dom";

export default function AdministratorHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("administratorLoggedIn");
    localStorage.removeItem("administratorId");
    navigate("/administrator-login");
  };

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

  const logoutBtnStyle = {
    backgroundColor: "#0B1C2D",
    color: "#C9A24D",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  };

  return (
    <>
    <header style={headerStyle}>
      <div style={logoStyle} onClick={() => navigate("/sadmin-dashboard")}>
        Snap2Fix
      </div>

     
      <button style={logoutBtnStyle} onClick={handleLogout}>
        Logout
      </button>
    </header>
    </>
  );
}
