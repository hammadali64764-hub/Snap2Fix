import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { adminPageStyles as styles, fetchAdminData, shortId } from "./adminApi";

export default function ResolvedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetchAdminData("complaints?status=resolved").then((data) => {
      if (data.success) setComplaints(data.complaints);
    });
    fetchAdminData("feedback").then((data) => {
      if (data.success) setFeedback(data.feedback);
    });
  }, []);

  const feedbackFor = (id) => feedback.find((item) => item.complaintId?._id === id);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <h2 style={styles.title}>Resolved Complaints</h2>
          <p style={styles.subtitle}>Completed complaints with resident feedback where available.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading"><div><span>Resolved queue</span><h3>Completed complaint records</h3></div><strong>{complaints.length}</strong></div>
          {complaints.length === 0 && <div className="s2f-empty">No resolved complaints.</div>}
          <div className="s2f-accordion-list">
            {complaints.map((item) => {
              const itemFeedback = feedbackFor(item._id);
              const isOpen = openId === item._id;
              return (
                <article className={`s2f-accordion ${isOpen ? "open" : ""}`} key={item._id}>
                  <button className="s2f-accordion-toggle" onClick={() => setOpenId(isOpen ? null : item._id)}>
                    <div className="s2f-accordion-title"><strong>{item.complaintType}</strong><span>{shortId(item._id)}</span></div>
                    <div className="s2f-accordion-meta"><span className="s2f-status-badge">{item.paymentStatus || "PENDING"}</span><span className="s2f-view-label">{isOpen ? "Hide details" : "Review"}</span><FaChevronDown /></div>
                  </button>
                  {isOpen && (
                    <div className="s2f-accordion-body">
                      <div className="s2f-detail-grid">
                        <Detail label="Provider" value={item.assignedProvider?.company || item.assignedProvider?.name || "Provider"} />
                        <Detail label="Accepted Cost" value={`Rs ${item.acceptedAmount || "-"}`} />
                        <Detail label="Payment" value={item.paymentStatus || "PENDING"} />
                        <Detail label="Feedback" value={itemFeedback ? `${itemFeedback.rating}/5 - ${itemFeedback.message}` : "No feedback yet"} />
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
