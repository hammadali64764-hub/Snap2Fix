import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { adminPageStyles as styles, adminToken, canForwardDepartment, departmentOptionsFor, fetchAdminData, isAuthorityComplaint, shortId } from "./adminApi";

export default function PendingComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState({});
  const [openId, setOpenId] = useState(null);

  const load = () => {
    fetchAdminData("complaints?status=pending").then((data) => {
      if (data.success) setComplaints(data.complaints);
    });
    fetchAdminData("providers").then((data) => {
      if (data.success) setProviders(data.providers || []);
    });
  };

  useEffect(load, []);

  const forwardDepartment = async (id) => {
    const departmentId = selectedDepartments[id];
    if (!departmentId) return alert("Please select a department first");

    const res = await fetch(`http://localhost:5000/api/society-complaints/forward-department/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken()}` },
      body: JSON.stringify({ departmentId }),
    });
    const data = await res.json();
    if (data.success) {
      setSelectedDepartments((prev) => ({ ...prev, [id]: "" }));
      load();
    }
    else alert(data.message || "Could not forward complaint");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <h2 style={styles.title}>Pending Complaints</h2>
          <p style={styles.subtitle}>Complaints still in bidding, negotiation, assignment, or review.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading"><div><span>Pending queue</span><h3>Open complaint records</h3></div><strong>{complaints.length}</strong></div>
          {complaints.length === 0 && <div className="s2f-empty">No pending complaints.</div>}
          <div className="s2f-accordion-list">
            {complaints.map((item) => {
              const isOpen = openId === item._id;
              return (
                <article className={`s2f-accordion ${isOpen ? "open" : ""}`} key={item._id}>
                  <button className="s2f-accordion-toggle" onClick={() => setOpenId(isOpen ? null : item._id)}>
                    <div className="s2f-accordion-title"><strong>{item.complaintType}</strong><span>{shortId(item._id)}</span></div>
                    <div className="s2f-accordion-meta"><span className="s2f-status-badge">{item.status.replaceAll("_", " ")}</span><span className="s2f-view-label">{isOpen ? "Hide details" : "Review"}</span><FaChevronDown /></div>
                  </button>
                  {isOpen && (
                    <div className="s2f-accordion-body">
                      <div className="s2f-detail-grid">
                        <Detail label={isAuthorityComplaint(item) ? "Department" : "Provider"} value={item.assignedProvider?.company || item.assignedProvider?.name || "Waiting for assignment"} />
                        <Detail label="Created" value={new Date(item.createdAt).toLocaleString()} />
                        <Detail label="Description" value={item.description} />
                      </div>
                      {canForwardDepartment(item) && (
                        <div className="s2f-action-box">
                          <h4>Forward to registered department</h4>
                          <div className="s2f-form-row compact">
                            <select value={selectedDepartments[item._id] || ""} onChange={(e) => setSelectedDepartments((prev) => ({ ...prev, [item._id]: e.target.value }))}>
                              <option value="">Select registered department</option>
                              {departmentOptionsFor(item, providers).map((provider) => (
                                <option value={provider._id} key={provider._id}>{provider.company || provider.name} - {(provider.services || []).join(", ")}</option>
                              ))}
                            </select>
                            <button className="s2f-btn primary" onClick={() => forwardDepartment(item._id)}>{item.assignedProvider ? "Forward to Selected Department" : "Forward to Department"}</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return <div className="s2f-detail"><span>{label}</span><p>{value || "Not provided"}</p></div>;
}
