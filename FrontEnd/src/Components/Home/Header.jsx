import { useNavigate } from "react-router-dom";

export default function HomeHeader() {
  const navigate = useNavigate();

  const headerStyle = {
    width: "100%",
    height: "60px",
    backgroundColor: "#0B1C2D",
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

  return (
    <header style={headerStyle}>
      <div style={logoStyle} onClick={() => navigate("/")}>
        Snap2Fix
      </div>
     
    </header>
  );
}
