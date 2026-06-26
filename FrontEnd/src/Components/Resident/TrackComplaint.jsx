import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const statusSteps = [
  "BIDDING",
  "NEGOTIATION",
  "ASSIGNED",
  "WORK_SUBMITTED",
  "COMPLETED",
];

const societyStatusSteps = [
  "SUBMITTED",
  "AI_CLASSIFIED",
  "FORWARDED",
  "BIDDING",
  "NEGOTIATION",
  "ASSIGNED",
  "WORK_SUBMITTED",
  "COMPLETED",
];

const authorityStatusSteps = [
  "SUBMITTED",
  "AI_CLASSIFIED",
  "ADMIN_REVIEW",
  "FORWARDED_AUTHORITY",
  "WORK_SUBMITTED",
  "COMPLETED",
];

export default function TrackComplaint() {
  const location = useLocation();
  const [complaintId, setComplaintId] = useState(
    location.state?.complaintId || ""
  );
  const [complaint, setComplaint] = useState(null);
  const [complaintType, setComplaintType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!complaintId.trim()) {
      alert("Please enter a complaint ID first");
      return;
    }

    setLoading(true);
    setComplaint(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/tracking/${complaintId.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("residentToken")}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Complaint not found");
        return;
      }

      setComplaint(data.complaint);
      setComplaintType(data.complaintType);
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.complaintId) {
      handleTrack();
    }
  }, []);

  const steps =
    complaintType === "society"
      ? complaint?.workflowType === "AUTHORITY"
        ? authorityStatusSteps
        : societyStatusSteps
      : statusSteps;

  const currentStep = complaint
    ? steps.indexOf(complaint.status)
    : -1;

  function formatStatus(status) {
    return (status || "").replaceAll("_", " ");
  }

  return (
    <div className="s2f-page">
      <div className="s2f-container">

        {/* HERO */}
        <section className="s2f-hero">
          <h2>Track Complaint</h2>
          <p>Check the live status and progress of your complaint</p>
        </section>

        {/* SEARCH BOX */}
        <section className="s2f-card">
          <h3>Enter Complaint ID</h3>

          <div className="s2f-form-row">
            <input
              type="text"
              placeholder="e.g. S2F-12AB"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
            />

            <button className="s2f-btn primary" onClick={handleTrack}>
              {loading ? "Tracking..." : "Track"}
            </button>
          </div>
        </section>

        {/* RESULTS */}
        {complaint && (
          <>
            {/* TIMELINE */}
<section className="s2f-section-panel">
  <div className="s2f-section-heading">
    <div>
      <span>Status Tracking</span>
      <h3>Complaint Progress</h3>
    </div>

    <strong>{currentStep + 1}</strong>
  </div>

  <div className="s2f-timeline">
    {steps.map((step, index) => {
      const active = index <= currentStep;

      return (
        <div
          key={step}
          className="s2f-timeline-step"
        >
          <span
            className={`s2f-dot ${
              active ? "active" : ""
            }`}
          />

          <p>{formatStatus(step)}</p>
        </div>
      );
    })}
  </div>
</section>

            {/* PROVIDER */}
            <section className="s2f-card">
              <h3>Assigned Service Provider</h3>

              <p className="s2f-note">
                {complaintType === "society"
                  ? complaint.workflowType === "AUTHORITY"
                    ? complaint.authorityName || "Society admin will forward this complaint to the concerned authority."
                    : "Society admin will forward this complaint to the relevant provider."
                  : complaint.assignedProvider
                  ? complaint.assignedProvider.company ||
                    complaint.assignedProvider.name
                  : "Not assigned yet"}
              </p>
            </section>

            {/* SUMMARY */}
<section className="s2f-card">
  <div className="s2f-section-heading">
    <div>
      <span>Complaint Details</span>
      <h3>Complaint Summary</h3>
    </div>

    <strong>📋</strong>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(220px,1fr))",
      gap: "12px",
    }}
  >
    <div className="s2f-detail">
      <span>Complaint Type</span>
      <p>
        {complaint.serviceType ||
          complaint.complaintType}
      </p>
    </div>

    <div className="s2f-detail">
      <span>Current Status</span>
      <p>{formatStatus(complaint.status)}</p>
    </div>

    <div className="s2f-detail">
      <span>Location</span>
      <p>{complaint.location}</p>
    </div>

    <div className="s2f-detail">
      <span>Workflow</span>
      <p>{complaint.workflowType === "AUTHORITY" ? "Authority Based" : "Bidding Based"}</p>
    </div>

    <div className="s2f-detail">
      <span>Complaint ID</span>
      <p>{complaintId}</p>
    </div>
  </div>

  <div
    style={{
      marginTop: "16px",
      padding: "16px",
      background: "#f8fafc",
      border: "1px solid #dbe4ee",
      borderRadius: "12px",
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
        color: "#334155",
        lineHeight: "1.7",
      }}
    >
      {complaint.description}
    </p>
  </div>
</section>
          </>
        )}

      </div>
    </div>
  );
}
