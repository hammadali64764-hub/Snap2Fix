import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { adminPageStyles as styles, adminToken, fetchAdminData, shortId } from "./adminApi";

export default function VerifyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [openId, setOpenId] = useState(null);

  const load = () => {
    fetchAdminData("complaints").then((data) => {
      if (data.success) setComplaints(data.complaints.filter((item) => item.status === "WORK_SUBMITTED"));
    });
  };

  useEffect(load, []);

  const update = async (id, action) => {
    const res = await fetch(`http://localhost:5000/api/society-complaints/${action}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken()}` },
      body: JSON.stringify({ adminFeedback: feedback[id] || "" }),
    });
    const data = await res.json();
    if (data.success) {
      setFeedback((prev) => ({ ...prev, [id]: "" }));
      setOpenId(null);
      load();
    }
    else alert(data.message || "Could not update complaint");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <h2 style={styles.title}>Verify Complaints</h2>
          <p style={styles.subtitle}>Review department/provider proof of work and resolve or request rework.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading"><div><span>Verification queue</span><h3>Proof submitted for review</h3></div><strong>{complaints.length}</strong></div>
          {complaints.length === 0 && <div className="s2f-empty">No proof submitted for review.</div>}
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
                        <Detail label={item.flowType === "DEPARTMENT" ? "Department" : "Provider"} value={item.assignedProvider?.company || item.assignedProvider?.name || "Assigned team"} />
                        <Detail label="Before" value={item.description} />
                        <Detail label="After notes" value={item.proofNotes || "No notes"} />
                      </div>
                      <div className="s2f-grid two" style={{ marginTop: "12px" }}>
                        <div className="s2f-card" style={{ margin: 0, padding: "12px" }}>
                          <p style={{ margin: "0 0 8px", fontWeight: 700 }}>Before image</p>
                          {item.imagePath ? <img className="s2f-proof" src={`http://localhost:5000${item.imagePath}`} alt="Before complaint" /> : <div className="s2f-empty">No before image</div>}
                        </div>
                        <div className="s2f-card" style={{ margin: 0, padding: "12px" }}>
                          <p style={{ margin: "0 0 8px", fontWeight: 700 }}>After image</p>
                          {item.proofImage ? <img className="s2f-proof" src={`http://localhost:5000${item.proofImage}`} alt="Provider work proof" /> : <div className="s2f-empty">No after image yet</div>}
                        </div>
                      </div>
                      <textarea className="s2f-input" placeholder="Verification feedback or rework instructions" value={feedback[item._id] || ""} onChange={(e) => setFeedback((prev) => ({ ...prev, [item._id]: e.target.value }))} />
                      <div className="s2f-actions aligned">
                        <button className="s2f-btn primary" onClick={() => update(item._id, "complete")}>Mark Resolved</button>
                        <button className="s2f-btn primary" onClick={() => update(item._id, "unsatisfactory")}>Request Rework</button>
                      </div>
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
