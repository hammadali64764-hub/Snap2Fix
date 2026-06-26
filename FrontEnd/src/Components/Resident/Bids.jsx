import { useEffect, useState } from "react";

export default function Bids() {
  const [open, setOpen] = useState(true);
  const [bids, setBids] = useState([]);
  const [counterForms, setCounterForms] = useState({});

  const fetchBids = async () => {
    const res = await fetch(
      "http://localhost:5000/api/household-bids/resident-bids",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("residentToken")}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setBids(data.bids);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const updateCounter = (bidId, field, value) => {
    setCounterForms((prev) => ({
      ...prev,
      [bidId]: {
        ...prev[bidId],
        [field]: value,
      },
    }));
  };

  const submitCounter = async (bidId) => {
    const form = counterForms[bidId];

    if (!form?.amount || !form?.days) {
      alert("Enter counter amount and completion days");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/household-bids/counter/${bidId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("residentToken")}`,
        },
        body: JSON.stringify({
          amount: Number(form.amount),
          timeEstimate: `${form.days} days`,
          message: form.message || "Resident counter-offer",
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Counter-offer sent");
      setCounterForms((prev) => ({ ...prev, [bidId]: {} }));
      fetchBids();
    } else {
      alert(data.message || "Could not send counter-offer");
    }
  };

  const acceptBid = async (bidId, complaintId) => {
    const res = await fetch(
      `http://localhost:5000/api/household-bids/accept/${bidId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("residentToken")}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Bid finalized and complaint assigned");
      setBids((prev) =>
        prev.filter((bid) => bid.complaintId?._id !== complaintId)
      );
    } else {
      alert(data.message || "Could not accept bid");
    }
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container">

        {/* HERO */}
        <section className="s2f-hero">
          <h2>Household Bids & Negotiation</h2>
          <p>Review provider offers, counter bids, and finalize work assignments.</p>
        </section>

        {/* PANEL */}
        <section className="s2f-section-panel">

          <div className="s2f-section-heading clickable" onClick={() => setOpen(!open)}>
            <div>
              <span>Bid Management</span>
              <h3>My Active Bids</h3>
            </div>
            <strong>{bids.length}</strong>
          </div>

          {open && (
            <>
              {bids.length === 0 && (
                <div className="s2f-card">No active bids yet.</div>
              )}

              {bids.map((bid) => {
                const form = counterForms[bid._id] || {};
                const shortId = bid.complaintId?._id?.slice(-4).toUpperCase();

                return (
                  <article className="s2f-accordion open" key={bid._id}>
                    <div className="s2f-accordion-body">

                      {/* DETAILS GRID */}
                      <div className="s2f-detail-grid">

                        <div className="s2f-detail">
                          <span>Complaint ID</span>
                          <p>S2F-{shortId}</p>
                        </div>

                        <div className="s2f-detail">
                          <span>Service</span>
                          <p>{bid.complaintId?.serviceType}</p>
                        </div>

                        <div className="s2f-detail">
                          <span>Status</span>
                          <p>{(bid.status || "PENDING").replaceAll("_", " ")}</p>
                        </div>

                        <div className="s2f-detail">
                          <span>Location</span>
                          <p>{bid.complaintId?.location}</p>
                        </div>

                        <div className="s2f-detail">
                          <span>Provider</span>
                          <p>{bid.providerId?.company || bid.providerId?.name}</p>
                        </div>

                        <div className="s2f-detail">
                          <span>Offer</span>
                          <p>
                            Rs {bid.finalAmount || bid.amount} /{" "}
                            {bid.finalTimeEstimate || bid.timeEstimate}
                          </p>
                        </div>

                      </div>

                      {/* HISTORY */}
                      <div className="s2f-action-box">
                        <h4>Negotiation History</h4>

                        {(bid.negotiationHistory || []).slice(-3).map((item, i) => (
                          <p key={i}>
                            <b>{item.sender}:</b>{" "}
                            Rs {item.amount || "-"} / {item.timeEstimate || "-"}
                          </p>
                        ))}
                      </div>

                      {/* ACTIONS */}
                      <div className="s2f-action-box">

                        <h4>Take Action</h4>

                        <div className="s2f-form-row negotiation">
                          <input
                            type="number"
                            placeholder="Counter Amount (Rs)"
                            value={form.amount || ""}
                            onChange={(e) =>
                              updateCounter(bid._id, "amount", e.target.value)
                            }
                          />

                          <input
                            type="number"
                            placeholder="Days"
                            value={form.days || ""}
                            onChange={(e) =>
                              updateCounter(bid._id, "days", e.target.value)
                            }
                          />

                          <input
                            placeholder="Message"
                            value={form.message || ""}
                            onChange={(e) =>
                              updateCounter(bid._id, "message", e.target.value)
                            }
                          />
                        </div>

                        <div className="s2f-actions aligned">
                          <button
                            className="s2f-btn outline"
                            onClick={() => submitCounter(bid._id)}
                          >
                            Send Counter
                          </button>

                          <button
                            className="s2f-btn primary"
                            onClick={() =>
                              acceptBid(bid._id, bid.complaintId?._id)
                            }
                          >
                            Finalize
                          </button>
                        </div>

                      </div>

                    </div>
                  </article>
                );
              })}
            </>
          )}

        </section>

      </div>
    </div>
  );
}