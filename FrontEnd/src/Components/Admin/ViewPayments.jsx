import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { adminToken, fetchAdminData, shortId } from "./adminApi";

const API = "http://localhost:5000";

export default function ViewPayments() {
  const [payments, setPayments] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [edits, setEdits] = useState({});

  const load = () => {
    fetchAdminData("payments").then((data) => {
      if (data.success) setPayments(data.payments);
    });
  };

  useEffect(load, []);

  const updateStatus = async (id) => {
    const status = edits[id] || "PENDING";
    const res = await fetch(`${API}/api/admin-data/payments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) load();
    else alert(data.message || "Could not update payment");
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Payment Records</h2>
          <p>Review accepted repair complaint payments and edit payment status.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div><span>Payment list</span><h3>Records</h3></div>
            <strong>{payments.length}</strong>
          </div>

          {!payments.length && <div className="s2f-empty">No payment records yet.</div>}

          <div className="s2f-accordion-list">
            {payments.map((item) => {
              const isOpen = openId === item._id;
              return (
                <article className={`s2f-accordion ${isOpen ? "open" : ""}`} key={item._id}>
                  <button className="s2f-accordion-toggle" onClick={() => setOpenId(isOpen ? null : item._id)}>
                    <div className="s2f-accordion-title">
                      <strong>{shortId(item._id)}</strong>
                      <span>{item.complaintType}</span>
                    </div>
                    <div className="s2f-accordion-meta">
                      <span className={`s2f-status-badge ${item.paymentStatus === "PAID" ? "success" : ""}`}>
                        {item.paymentStatus || "PENDING"}
                      </span>
                      <span className="s2f-view-label">{isOpen ? "Hide details" : "Edit record"}</span>
                      <FaChevronDown aria-hidden="true" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="s2f-accordion-body">
                      {(item.beforeImage || item.imagePath) && (
                        <img className="s2f-complaint-image" src={`${API}${item.beforeImage || item.imagePath}`} alt="Complaint before work" />
                      )}
                      <div className="s2f-detail-grid">
                        <Detail label="Provider" value={item.assignedProvider?.company || item.assignedProvider?.name || "Provider"} />
                        <Detail label="Accepted cost" value={`Rs ${item.acceptedAmount || "-"}`} />
                        <Detail label="Completion time" value={item.acceptedTimeEstimate || "-"} />
                        <Detail label="Location" value={item.location} />
                      </div>

                      <div className="s2f-action-box">
                        <h4>Edit Payment Status</h4>
                        <div className="s2f-form-row compact">
                          <select
                            className="s2f-input"
                            value={edits[item._id] || item.paymentStatus || "PENDING"}
                            onChange={(e) => setEdits((prev) => ({ ...prev, [item._id]: e.target.value }))}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                          </select>
                          <button className="s2f-btn primary" onClick={() => updateStatus(item._id)}>
                            Save
                          </button>
                        </div>
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
