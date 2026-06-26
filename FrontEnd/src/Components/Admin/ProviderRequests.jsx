import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProviderRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const societyId = localStorage.getItem("societyId");

  useEffect(() => {
    if (!societyId) navigate("/admin-register");
  }, [navigate, societyId]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/society/provider-requests/${societyId}`);
        const data = await res.json();
        setRequests(data);
      } catch {
        alert("Failed to fetch provider requests");
      } finally {
        setLoading(false);
      }
    };

    if (societyId) fetchRequests();
  }, [societyId]);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this service provider?")) return;
    try {
      await fetch(`http://localhost:5000/api/society/provider-approve/${id}`, { method: "POST" });
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Approval failed");
    }
  };

  const handleDecline = async (id) => {
    if (!window.confirm("Decline this service provider?")) return;
    try {
      await fetch(`http://localhost:5000/api/society/provider-decline/${id}`, { method: "POST" });
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Decline failed");
    }
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Service Provider Requests</h2>
          <p>Review and approve service provider registration requests.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div><span>Approval queue</span><h3>Provider requests</h3></div>
            <strong>{requests.length}</strong>
          </div>

          {loading && <div className="s2f-empty">Loading requests...</div>}
          {!loading && requests.length === 0 && <div className="s2f-empty">No pending provider requests.</div>}

          <div className="s2f-accordion-list">
            {requests.map((data) => {
              const isOpen = openId === data._id;
              return (
                <article className={`s2f-accordion ${isOpen ? "open" : ""}`} key={data._id}>
                  <button className="s2f-accordion-toggle" onClick={() => setOpenId(isOpen ? null : data._id)}>
                    <div className="s2f-accordion-title">
                      <strong>{data.company || data.name}</strong>
                      <span>{data.services?.join(", ") || "Service provider"}</span>
                    </div>
                    <div className="s2f-accordion-meta">
                      <span className="s2f-kind-badge">Request</span>
                      <span className="s2f-view-label">{isOpen ? "Hide details" : "Review"}</span>
                      <FaChevronDown aria-hidden="true" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="s2f-accordion-body">
                      <div className="s2f-detail-grid">
                        <Detail label="Company" value={data.company} />
                        <Detail label="Provider name" value={data.name} />
                        <Detail label="CNIC" value={data.cnic} />
                        <Detail label="Phone" value={data.phone} />
                        <Detail label="Email" value={data.email} />
                        <Detail label="Services" value={data.services?.join(", ")} />
                      </div>
                      <div className="s2f-actions aligned">
                        <button className="s2f-btn danger" onClick={() => handleDecline(data._id)}>Decline</button>
                        <button className="s2f-btn primary" onClick={() => handleApprove(data._id)}>Approve</button>
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
