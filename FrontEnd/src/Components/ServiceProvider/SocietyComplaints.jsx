import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const isViolenceComplaint = (item = {}) =>
  /violence|violance|fight|assault|weapon|crime/i.test(
    `${item.complaintType || ""} ${item.departmentType || ""} ${item.description || ""}`
  );

export default function SocietyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [proof, setProof] = useState({});
  const [uploadingId, setUploadingId] = useState("");
  const [openId, setOpenId] = useState(null);
  const token = localStorage.getItem("providerToken");

  const load = async () => {
    const res = await fetch("http://localhost:5000/api/society-complaints/provider", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      setComplaints(
        data.complaints.filter(
          (item) =>
            (item.assignedProvider ||
              isViolenceComplaint(item) ||
              (item.flowType === "DEPARTMENT" && item.departmentType === "SECURITY")) &&
            ["SUBMITTED", "AI_CLASSIFIED", "FORWARDED", "BIDDING", "NEGOTIATION", "ASSIGNED", "UNSATISFACTORY", "WORK_SUBMITTED"].includes(item.status)
        )
      );
    }
  };

  useEffect(() => { load(); }, []);

  const change = (id, field, value) => setProof((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const needsProofImage = (item) =>
    !(item.flowType === "DEPARTMENT" && item.departmentType === "SECURITY") &&
    !isViolenceComplaint(item);

  const uploadProof = async (item) => {
    if (uploadingId) return;
    if (needsProofImage(item) && !proof[item._id]?.file) return alert("Select a proof image");

    setUploadingId(item._id);
    const formData = new FormData();
    if (proof[item._id]?.file) formData.append("proofImage", proof[item._id].file);
    formData.append("proofNotes", proof[item._id]?.notes || "");
    try {
      const res = await fetch(`http://localhost:5000/api/society-complaints/proof/${item._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProof((prev) => ({ ...prev, [item._id]: {} }));
        setOpenId(null);
        await load();
      } else {
        alert(data.message || "Could not upload proof");
      }
    } catch {
      alert("Could not connect to backend");
    } finally {
      setUploadingId("");
    }
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero"><h2>Society Complaints</h2><p>Assigned society work appears here. Departments handle authority complaints, while selected providers handle finalized bid work.</p></section>
        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div><span>Assigned work</span><h3>Society complaint queue</h3></div>
            <strong>{complaints.length}</strong>
          </div>

          {!complaints.length && <div className="s2f-empty">No finalized society complaint is assigned to you.</div>}

          <div className="s2f-accordion-list">
            {complaints.map((item) => {
              const isOpen = openId === item._id;
              const securityWork = isViolenceComplaint(item) || (item.flowType === "DEPARTMENT" && item.departmentType === "SECURITY");
              return (
                <article className={`s2f-accordion ${isOpen ? "open" : ""}`} key={item._id}>
                  <button className="s2f-accordion-toggle" onClick={() => setOpenId(isOpen ? null : item._id)}>
                    <div className="s2f-accordion-title">
                      <strong>{item.complaintType}</strong>
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
                      {securityWork && <p className="s2f-note">Security service complaint. Mark done and send it for admin verification.</p>}
                      {item.imagePath && <img className="s2f-complaint-image" src={`http://localhost:5000${item.imagePath}`} alt="Before complaint" />}
                      <div className="s2f-detail-grid">
                        <Detail label="Description" value={item.description} />
                        <Detail label="Location" value={item.location} />
                        <Detail label="Status" value={item.status.replaceAll("_", " ")} />
                      </div>
                      {item.adminFeedback && <p className="s2f-alert danger"><b>Admin feedback:</b> {item.adminFeedback}</p>}

                      {needsProofImage(item) ? (
                        <>
                          <div className="s2f-actions aligned">
                            <label className="s2f-btn outline" style={{ display: "inline-flex", justifyContent: "center" }}>
                              Upload After Image
                              <input type="file" accept="image/*" hidden onChange={(e) => change(item._id, "file", e.target.files[0])} />
                            </label>
                            <button className="s2f-btn outline" onClick={() => change(item._id, "file", undefined)}>Clear Image</button>
                          </div>
                          {proof[item._id]?.file && <p className="s2f-note">Selected file: {proof[item._id].file.name}</p>}
                        </>
                      ) : (
                        <p className="s2f-note">This complaint is done-only. Add a completion note and send it for admin viewing.</p>
                      )}

                      <textarea className="s2f-input" placeholder={needsProofImage(item) ? "Work completed and proof notes" : "Completion notes"} value={proof[item._id]?.notes || ""} onChange={(e) => change(item._id, "notes", e.target.value)} />
                      <button className="s2f-btn primary" disabled={uploadingId === item._id} onClick={() => uploadProof(item)}>
                        {uploadingId === item._id ? "Submitting..." : needsProofImage(item) ? "Upload Proof" : "Mark Done"}
                      </button>
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
