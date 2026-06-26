import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function ViewProviderFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      const res = await fetch("http://localhost:5000/api/feedback/provider", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("providerToken")}`,
        },
      });
      const data = await res.json();
      if (data.success) setFeedback(data.feedback);
    };

    fetchFeedback();
  }, []);

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>My Feedback</h2>
          <p>Feedback given by residents for your household and society repair services.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div><span>Resident responses</span><h3>Feedback records</h3></div>
            <strong>{feedback.length}</strong>
          </div>

          {!feedback.length && <div className="s2f-empty">No feedback submitted yet.</div>}

          <div className="s2f-accordion-list">
            {feedback.map((item) => {
              const isOpen = openId === item._id;
              const category = item.complaintId?.serviceType || item.complaintId?.complaintType || "Complaint";
              return (
                <article className={`s2f-accordion ${isOpen ? "open" : ""}`} key={item._id}>
                  <button className="s2f-accordion-toggle" onClick={() => setOpenId(isOpen ? null : item._id)}>
                    <div className="s2f-accordion-title">
                      <strong>{category}</strong>
                      <span>{item.residentId?.name || "Resident"}</span>
                    </div>
                    <div className="s2f-accordion-meta">
                      <span className="s2f-status-badge success">{item.rating}/5</span>
                      <span className="s2f-view-label">{isOpen ? "Hide details" : "View details"}</span>
                      <FaChevronDown aria-hidden="true" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="s2f-accordion-body">
                      <div className="s2f-detail-grid">
                        <Detail label="Resident" value={item.residentId?.name} />
                        <Detail label="Email" value={item.residentId?.email} />
                        <Detail label="Date" value={new Date(item.createdAt).toLocaleDateString()} />
                        <Detail label="Rating" value={`${item.rating}/5`} />
                      </div>
                      <div className="s2f-action-box">
                        <h4>Message</h4>
                        <p>{item.message}</p>
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
