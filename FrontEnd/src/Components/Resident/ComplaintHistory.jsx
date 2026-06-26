import { useEffect, useState } from "react";

export default function ComplaintHistory() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [feedbackForms, setFeedbackForms] = useState({});

  useEffect(() => {
    const fetchHistory = async () => {
      const householdRes = await fetch(
        "http://localhost:5000/api/household/resident-history",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("residentToken")}`,
          },
        }
      );
      const societyRes = await fetch(
        "http://localhost:5000/api/society-complaints/resident-history",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("residentToken")}`,
          },
        }
      );

      const householdData = await householdRes.json();
      const societyData = await societyRes.json();
      const combined = [
        ...((householdData.success && householdData.complaints) || []).map((item) => ({ ...item, complaintKind: "Household" })),
        ...((societyData.success && societyData.complaints) || []).map((item) => ({ ...item, complaintKind: "Society" })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComplaints(combined);
    };

    fetchHistory();
  }, []);

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter((c) =>
          filter === "Resolved"
            ? c.status === "COMPLETED"
            : filter === "Assigned"
            ? c.status === "ASSIGNED"
            : c.status === "BIDDING"
        );

  const updateFeedback = (id, field, value) => {
    setFeedbackForms((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const submitFeedback = async (complaintId) => {
    const form = feedbackForms[complaintId] || {};

    if (!form.rating || !form.message) {
      alert("Select rating and write feedback");
      return;
    }

    const res = await fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("residentToken")}`,
      },
      body: JSON.stringify({
        complaintId,
        rating: Number(form.rating),
        message: form.message,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Feedback submitted");
      setFeedbackForms((prev) => ({ ...prev, [complaintId]: {} }));
    } else {
      alert(data.message || "Could not submit feedback");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "ASSIGNED":
        return "warning";
      default:
        return "info";
    }
  };

 return (
  <div className="s2f-page">
    <div className="s2f-container">

      {/* HERO */}
      <div className="s2f-hero">
        <h2>Complaint History</h2>
        <p>
          Review all complaints submitted by you, track their status and
          provide feedback after completion.
        </p>
      </div>

      {/* FILTER */}
      <div className="s2f-card" style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h3 style={{ margin: 0 }}>My Complaints</h3>

          <select
            className="s2f-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ maxWidth: "220px" }}
          >
            <option>All</option>
            <option>Submitted</option>
            <option>Assigned</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="s2f-card">
          <div className="s2f-empty">
            No complaints found.
          </div>
        </div>
      ) : (
        filteredComplaints.map((c) => {
          const shortId = `S2F-${c._id.slice(-4).toUpperCase()}`;

          return (
            <div
              key={c._id}
              className="s2f-card"
              style={{
                marginBottom: "18px",
                transition: "0.25s",
              }}
            >
              {/* HEADER */}
              <div className="s2f-card-head">
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "22px",
                    }}
                  >
                    {shortId}
                  </h3>

                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    Complaint ID
                  </p>
                </div>

                <span
                  className={
                    c.status === "COMPLETED"
                      ? "s2f-status-badge success"
                      : "s2f-status-badge"
                  }
                  style={{
                    fontSize: "12px",
                    padding: "8px 12px",
                  }}
                >
                  {c.status.replaceAll("_", " ")}
                </span>
              </div>

              {/* DETAILS */}
              <div
                className="s2f-detail-grid"
                style={{ marginTop: "16px" }}
              >
                <div className="s2f-detail">
                  <span>{c.complaintKind === "Society" ? "Complaint Type" : "Service Type"}</span>
                  <p>{c.serviceType || c.complaintType}</p>
                </div>

                <div className="s2f-detail">
                  <span>Complaint Level</span>
                  <p>{c.complaintKind}</p>
                </div>

                <div className="s2f-detail">
                  <span>Location</span>
                  <p>{c.location}</p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div
                style={{
                  marginTop: "16px",
                  padding: "15px",
                  background: "#f8fafc",
                  border: "1px solid #dbe4ee",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    color: "#64748b",
                    fontSize: "11px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                  }}
                >
                  Description
                </span>

                <p
                  style={{
                    marginTop: "10px",
                    marginBottom: 0,
                    lineHeight: "1.7",
                    color: "#334155",
                  }}
                >
                  {c.description}
                </p>
              </div>

              {/* FEEDBACK */}
              {c.status === "COMPLETED" && (
                <div
                  className="s2f-action-box"
                  style={{
                    marginTop: "18px",
                  }}
                >
                  <h4
                    style={{
                      marginBottom: "14px",
                    }}
                  >
                    ⭐ Submit Feedback
                  </h4>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "120px 1fr 130px",
                      gap: "10px",
                    }}
                  >
                    <select
                      className="s2f-input"
                      value={
                        feedbackForms[c._id]?.rating || ""
                      }
                      onChange={(e) =>
                        updateFeedback(
                          c._id,
                          "rating",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Rating</option>
                      <option value="5">⭐⭐⭐⭐⭐</option>
                      <option value="4">⭐⭐⭐⭐</option>
                      <option value="3">⭐⭐⭐</option>
                      <option value="2">⭐⭐</option>
                      <option value="1">⭐</option>
                    </select>

                    <input
                      className="s2f-input"
                      placeholder="Write your feedback..."
                      value={
                        feedbackForms[c._id]?.message ||
                        ""
                      }
                      onChange={(e) =>
                        updateFeedback(
                          c._id,
                          "message",
                          e.target.value
                        )
                      }
                    />

                    <button
                      className="s2f-btn primary"
                      onClick={() =>
                        submitFeedback(c._id)
                      }
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  </div>
);
}
