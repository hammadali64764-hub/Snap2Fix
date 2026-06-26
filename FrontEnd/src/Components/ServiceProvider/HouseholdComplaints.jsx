import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function HouseholdComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [openId, setOpenId] = useState(null);
  const token = localStorage.getItem("providerToken");

  const load = async () => {
    const res = await fetch("http://localhost:5000/api/household/assigned", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setComplaints(data.complaints);
  };

  useEffect(() => { load(); }, []);

  const markDone = async (id) => {
    const res = await fetch(`http://localhost:5000/api/household/complete/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      setOpenId(null);
      load();
    } else alert(data.message || "Could not complete complaint");
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Household Complaints</h2>
          <p>Complete assigned household service work. Proof verification is only used for society complaints.</p>
        </section>
        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div><span>Assigned work</span><h3>Household queue</h3></div>
            <strong>{complaints.length}</strong>
          </div>

          {!complaints.length && <div className="s2f-empty">No assigned household complaints.</div>}

          <div className="s2f-accordion-list">
            {complaints.map((item) => {
              const isOpen = openId === item._id;
              return (
                <article className={`s2f-accordion ${isOpen ? "open" : ""}`} key={item._id}>
                  <button className="s2f-accordion-toggle" onClick={() => setOpenId(isOpen ? null : item._id)}>
                    <div className="s2f-accordion-title">
                      <strong>{item.serviceType}</strong>
                      <span>S2F-{item._id.slice(-4).toUpperCase()}</span>
                    </div>
                    <div className="s2f-accordion-meta">
                      <span className="s2f-status-badge">{item.status.replaceAll("_", " ")}</span>
                      <span className="s2f-view-label">{isOpen ? "Hide details" : "Review"}</span>
                      <FaChevronDown aria-hidden="true" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="s2f-accordion-body">
                      <div className="s2f-detail-grid">
                        <Detail label="Description" value={item.description} />
                        <Detail label="Location" value={item.location} />
                        <Detail label="Status" value={item.status.replaceAll("_", " ")} />
                      </div>
                      <button className="s2f-btn primary" onClick={() => markDone(item._id)}>Mark as Done</button>
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
