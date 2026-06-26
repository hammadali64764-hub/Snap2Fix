import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const API = "http://localhost:5000";

export default function ProviderResolvedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResolved = async () => {
      const headers = { Authorization: `Bearer ${localStorage.getItem("providerToken")}` };
      try {
        const responses = await Promise.all([
          fetch(`${API}/api/household/provider-resolved`, { headers }),
          fetch(`${API}/api/society-complaints/provider-resolved`, { headers }),
        ]);
        const [household, society] = await Promise.all(responses.map((response) => response.json()));
        if (!responses[0].ok || !responses[1].ok) throw new Error(household.message || society.message);

        const combined = [
          ...(household.complaints || []).map((item) => ({ ...item, complaintKind: "Household" })),
          ...(society.complaints || []).map((item) => ({ ...item, complaintKind: "Society" })),
        ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setComplaints(combined);
      } catch (err) {
        setError(err.message || "Could not load resolved complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchResolved();
  }, []);

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Resolved Complaints</h2>
          <p>Your completed household work and society work approved by the society admin.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div><span>Work history</span><h3>Completed complaints</h3></div>
            <strong>{complaints.length}</strong>
          </div>

          {loading && <div className="s2f-empty">Loading resolved complaints...</div>}
          {!loading && error && <div className="s2f-alert danger">{error}</div>}
          {!loading && !error && !complaints.length && <div className="s2f-empty">No resolved complaints yet.</div>}

          <div className="s2f-accordion-list">
            {complaints.map((item) => {
              const isOpen = openId === item._id;
              const category = item.complaintType || item.serviceType;
              return (
                <article className={`s2f-accordion ${isOpen ? "open" : ""}`} key={`${item.complaintKind}-${item._id}`}>
                  <button className="s2f-accordion-toggle" onClick={() => setOpenId(isOpen ? null : item._id)}>
                    <div className="s2f-accordion-title">
                      <strong>{category}</strong>
                      <span>S2F-{item._id.slice(-4).toUpperCase()}</span>
                    </div>
                    <div className="s2f-accordion-meta">
                      <span className="s2f-kind-badge">{item.complaintKind}</span>
                      <span className="s2f-status-badge success">Resolved</span>
                      <FaChevronDown aria-hidden="true" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="s2f-accordion-body">
                      {item.imagePath && <img className="s2f-complaint-image" src={`${API}${item.imagePath}`} alt={`${category} complaint`} />}
                      <div className="s2f-detail-grid">
                        <Detail label="Description" value={item.description} />
                        <Detail label="Location" value={item.location} />
                        <Detail label="Resolved on" value={new Date(item.updatedAt).toLocaleDateString()} />
                        <Detail label="Admin feedback" value={item.adminFeedback || "No feedback added"} />
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
