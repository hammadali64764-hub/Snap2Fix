export const adminToken = () => localStorage.getItem("societyToken");

export const shortId = (id) => `S2F-${String(id || "").slice(-4).toUpperCase()}`;

export const fetchAdminData = async (path) => {
  const res = await fetch(`http://localhost:5000/api/admin-data/${path}`, {
    headers: { Authorization: `Bearer ${adminToken()}` },
  });
  return res.json();
};

export const isAuthorityComplaint = (item = {}) =>
  item.flowType === "DEPARTMENT" || /garbage|waste|trash|security|guard|theft|safety|violence|violance|fight|assault|weapon|crime/i.test(`${item.complaintType || ""} ${item.departmentType || ""} ${item.description || ""}`);

export const isViolenceComplaint = (item = {}) =>
  /violence|violance|fight|assault|weapon|crime/i.test(`${item.complaintType || ""} ${item.departmentType || ""} ${item.description || ""}`);

export const canForwardDepartment = (item = {}) =>
  isAuthorityComplaint(item) && !isViolenceComplaint(item) && !["WORK_SUBMITTED", "COMPLETED"].includes(item.status);

export const departmentTypeFor = (item = {}) => {
  const type = `${item.departmentType || item.complaintType || ""}`.toLowerCase();
  if (/garbage|waste|trash/.test(type)) return "GARBAGE";
  if (/security|guard|theft|safety|violence|violance|fight|assault|weapon|crime/.test(type)) return "SECURITY";
  return "";
};

export const departmentOptionsFor = (item = {}, providers = []) => {
  const departmentType = departmentTypeFor(item);
  return providers.filter((provider) => {
    const services = (provider.services || []).join(" ").toLowerCase();
    if (departmentType === "GARBAGE") return /garbage|waste|clean/.test(services);
    if (departmentType === "SECURITY") return /security|guard|safety|crime|violence|violance/.test(services);
    return false;
  });
};

export const adminPageStyles = {
  page: {
    width: "100vw",
    minHeight: "calc(100vh - 120px)",
    background: "linear-gradient(180deg, #edf3f8 0%, #f8fafc 100%)",
    padding: "34px 20px 54px",
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
  },
  hero: {
    background: "#071423",
    color: "#fff",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "18px",
    boxShadow: "0 18px 44px rgba(7, 20, 35, 0.18)",
  },
  title: {
    margin: "0 0 6px",
    fontSize: "24px",
  },
  subtitle: {
    margin: 0,
    color: "#dbe7f0",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
  },
  card: {
    background: "#fff",
    border: "1px solid #dbe4ee",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 14px 32px rgba(7, 20, 35, 0.08)",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  badge: {
    borderRadius: "999px",
    padding: "6px 10px",
    background: "#eef3f8",
    color: "#071423",
    fontSize: "12px",
    fontWeight: 800,
  },
  button: {
    border: "none",
    borderRadius: "10px",
    padding: "9px 12px",
    background: "#071423",
    color: "#f3c969",
    fontWeight: 800,
    cursor: "pointer",
  },
  outlineButton: {
    border: "1px solid #22364c",
    borderRadius: "10px",
    padding: "9px 12px",
    background: "#0b1c2d",
    color: "#f3c969",
    fontWeight: 800,
    cursor: "pointer",
  },
  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "12px",
    alignItems: "center",
  },
  input: {
    width: "100%",
    minHeight: "42px",
    padding: "11px 12px",
    border: "1px solid #dbe4ee",
    borderRadius: "10px",
    color: "#071423",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    minHeight: "42px",
    padding: "10px 12px",
    border: "1px solid #dbe4ee",
    borderRadius: "10px",
    color: "#071423",
    background: "#fff",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "96px",
    padding: "11px 12px",
    border: "1px solid #dbe4ee",
    borderRadius: "10px",
    color: "#071423",
    resize: "vertical",
    boxSizing: "border-box",
  },
};
