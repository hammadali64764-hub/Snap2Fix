import { useLocation, useNavigate } from "react-router-dom";

export default function PendingApproval() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const role = state?.role;

  const getMessage = () => {
    if (role === "societyAdmin") {
      return "Your society registration is pending Super Admin approval.";
    }
    if (role === "resident") {
      return "Your registration is pending Society Admin approval.";
    }
    if (role === "serviceProvider") {
      return "Your registration is pending Society Admin approval.";
    }
    return "Your registration is pending approval.";
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.pageTitle}>Pending Approval</h2>

        <div style={styles.formBox}>
          <p style={styles.message}>
            {getMessage()}
          </p>

          <p style={styles.subText}>
            You will be able to login once your request is approved.
          </p>

          <button
            style={styles.submitBtn}
            onClick={() => navigate("/")}
          >
            Go to Home
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
    maxWidth: "1200px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  pageTitle: {
    marginBottom: "20px",
    color: "#0b1c2d",
    fontSize: "22px",
  },
  formBox: {
    width: "360px",
    margin: "0 auto",
    backgroundColor: "#f6f7f9",
    padding: "24px",
    borderRadius: "10px",
    border: "1px solid #c9a24d",
  },
  message: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0b1c2d",
    marginBottom: "10px",
  },
  subText: {
    fontSize: "13px",
    color: "#555",
    marginBottom: "20px",
  },
  submitBtn: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#c9a24d",
    color: "#f6f7f9",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
