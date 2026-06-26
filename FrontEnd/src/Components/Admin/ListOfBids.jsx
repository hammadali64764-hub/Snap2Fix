import { useEffect, useState } from "react";

export default function ListOfBids() {
  const [bids, setBids] = useState([]);
  const [forms, setForms] = useState({});
  const token = localStorage.getItem("societyToken");

  const visibleBids = bids.filter(
    (bid) => !["ASSIGNED", "ACCEPTED", "REJECTED"].includes(bid.status)
  );

  const load = async () => {
    const res = await fetch("http://localhost:5000/api/society-bids/admin", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setBids(data.bids);
  };

  useEffect(() => {
    load();
  }, []);

  const change = (id, field, value) =>
    setForms((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));

  const counter = async (bidId) => {
    const form = forms[bidId] || {};
    if (!form.amount || !form.days)
      return alert("Enter counter cost and completion days");

    const res = await fetch(
      `http://localhost:5000/api/society-bids/${bidId}/admin-counter`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(form.amount),
          timeEstimate: `${form.days} days`,
          message: form.message,
        }),
      }
    );

    const data = await res.json();
    if (data.success) load();
    else alert(data.message || "Could not send counter-offer");
  };

  const finalize = async (bidId) => {
    const res = await fetch(
      `http://localhost:5000/api/society-bids/${bidId}/finalize`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    if (data.success) {
      alert("Bid finalized and complaint assigned");
      load();
    } else {
      alert(data.message || "Could not finalize bid");
    }
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Society Bids & Negotiation</h2>
          <p>
            Compare provider offers, send counter-offers, review negotiation
            history, and finalize bids.
          </p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div>
              <span>Bid Management</span>
              <h3>Active Bids</h3>
            </div>
            <strong>{visibleBids.length}</strong>
          </div>

          {visibleBids.length === 0 && (
            <div className="s2f-card">No active bids available.</div>
          )}

          {visibleBids.map((bid) => {
            const closed = ["ACCEPTED", "REJECTED", "ASSIGNED"].includes(
              bid.status
            );

            return (
              <article className="s2f-accordion open" key={bid._id}>
                <div className="s2f-accordion-body">
                  <div className="s2f-detail-grid">
                    <div className="s2f-detail">
                      <span>Complaint ID</span>
                      <p>
                        S2F-
                        {bid.complaintId?._id?.slice(-4).toUpperCase()}
                      </p>
                    </div>

                    <div className="s2f-detail">
                      <span>Status</span>
                      <p>{bid.status.replaceAll("_", " ")}</p>
                    </div>

                    <div className="s2f-detail">
                      <span>Complaint</span>
                      <p>{bid.complaintId?.complaintType}</p>
                    </div>

                    <div className="s2f-detail">
                      <span>Provider</span>
                      <p>{bid.providerId?.company || bid.providerId?.name}</p>
                    </div>

                    <div className="s2f-detail">
                      <span>Current Offer</span>
                      <p>
                        Rs {bid.finalAmount || bid.amount} /{" "}
                        {bid.finalTimeEstimate || bid.timeEstimate}
                      </p>
                    </div>
                  </div>

                  {bid.complaintId?.beforeImage && (
                    <img
                      className="s2f-complaint-image"
                      src={`http://localhost:5000${bid.complaintId.beforeImage}`}
                      alt="Resident complaint before work"
                    />
                  )}

                  <div className="s2f-action-box">
                    <h4>Negotiation History</h4>

                    {(bid.negotiationHistory || []).map((entry, index) => (
                      <p key={index}>
                        <b>{entry.sender}:</b> {entry.action}
                        {entry.amount && ` - Rs ${entry.amount}`}
                        {entry.timeEstimate && ` - ${entry.timeEstimate}`}
                        {entry.message && ` - ${entry.message}`}
                      </p>
                    ))}
                  </div>

                  {!closed && (
                    <div className="s2f-action-box">
                      <h4>Send Counter Offer</h4>

                      <div className="s2f-form-row negotiation">
                        <input
                          type="number"
                          placeholder="Counter Cost (Rs)"
                          value={forms[bid._id]?.amount || ""}
                          onChange={(e) =>
                            change(bid._id, "amount", e.target.value)
                          }
                        />

                        <input
                          type="number"
                          placeholder="Completion Days"
                          value={forms[bid._id]?.days || ""}
                          onChange={(e) =>
                            change(bid._id, "days", e.target.value)
                          }
                        />

                        <input
                          placeholder="Message"
                          value={forms[bid._id]?.message || ""}
                          onChange={(e) =>
                            change(bid._id, "message", e.target.value)
                          }
                        />
                      </div>

                      <div className="s2f-actions aligned">
                        <button
                          className="s2f-btn outline"
                          onClick={() => counter(bid._id)}
                        >
                          Send Counter
                        </button>

                        <button
                          className="s2f-btn primary"
                          onClick={() => finalize(bid._id)}
                        >
                          Finalize Bid
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
