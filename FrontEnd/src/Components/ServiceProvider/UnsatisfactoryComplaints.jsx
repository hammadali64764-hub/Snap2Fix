import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const API = "http://localhost:5000";

export default function UnsatisfactoryComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [proof, setProof] = useState({});
  const [openId, setOpenId] = useState(null);
  const token = localStorage.getItem("providerToken");

  const load = async () => {
    const res = await fetch(`${API}/api/society-complaints/provider?status=UNSATISFACTORY`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setComplaints(data.complaints);
  };

  useEffect(() => {
    load();
  }, []);

  const updateProof = (id, field, value) => {
    setProof((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const submitRework = async (id) => {
    if (!proof[id]?.file) return alert("Select an after image");
    const formData = new FormData();
    formData.append("afterImage", proof[id].file);
    formData.append("proofNotes", proof[id]?.proofNotes || "");
    const res = await fetch(`${API}/api/society-complaints/proof/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (data.success) load();
    else alert(data.message || "Could not submit rework");
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Unsatisfactory Society Complaints</h2>
          <p>Open rework records, review admin feedback, and upload a fresh after image.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div><span>Rework queue</span><h3>Unsatisfactory complaints</h3></div>
            <strong>{complaints.length}</strong>
          </div>

          {!complaints.length && <div className="s2f-empty">No unsatisfactory society complaints.</div>}

          <div className="s2f-accordion-list">
            {complaints.map((complaint) => {
              const isOpen = openId === complaint._id;
              return (
                <article className={`s2f-accordion ${isOpen ? "open" : ""}`} key={complaint._id}>
                  <button className="s2f-accordion-toggle" onClick={() => setOpenId(isOpen ? null : complaint._id)}>
                    <div className="s2f-accordion-title">
                      <strong>{complaint.complaintType}</strong>
                      <span>S2F-{complaint._id.slice(-4).toUpperCase()}</span>
                    </div>
                    <div className="s2f-accordion-meta">
                      <span className="s2f-status-badge">Rework</span>
                      <span className="s2f-view-label">{isOpen ? "Hide details" : "View details"}</span>
                      <FaChevronDown aria-hidden="true" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="s2f-accordion-body">
                      {(complaint.beforeImage || complaint.imagePath) && (
                        <img className="s2f-complaint-image" src={`${API}${complaint.beforeImage || complaint.imagePath}`} alt="Before work uploaded by resident" />
                      )}
                      <div className="s2f-detail-grid">
                        <Detail label="Location" value={complaint.location} />
                        <Detail label="Admin feedback" value={complaint.adminFeedback || "Please rework and upload an after image again."} />
                        <Detail label="Description" value={complaint.description} />
                      </div>
                      <div className="s2f-action-box">
                        <h4>Submit Rework After Image</h4>
                        <div className="s2f-form-row negotiation">
                          <input type="file" accept="image/*" onChange={(e) => updateProof(complaint._id, "file", e.target.files[0])} />
                          <input
                            placeholder="Rework notes"
                            value={proof[complaint._id]?.proofNotes || ""}
                            onChange={(e) => updateProof(complaint._id, "proofNotes", e.target.value)}
                          />
                          <button className="s2f-btn primary" onClick={() => submitRework(complaint._id)}>
                            Submit
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
