import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import {
  adminToken,
  departmentOptionsFor,
  fetchAdminData,
  isAuthorityComplaint,
  shortId,
} from "./adminApi";

const API = "http://localhost:5000";

const complaintText = (item = "") =>
  `${item.complaintType || ""} ${item.departmentType || ""} ${item.description || ""}`;

const isLegacyAuthorityComplaint = (item = {}) =>
  item.workflowType === "AUTHORITY" ||
  item.flowType === "DEPARTMENT" ||
  isAuthorityComplaint(item) ||
  /violence|violance|fight|assault|weapon|crime/i.test(complaintText(item));

const isSecurityComplaint = (item = {}) =>
  item.departmentType === "SECURITY" || /security|guard|theft|safety/i.test(complaintText(item));

const isViolenceComplaint = (item = {}) =>
  /violence|violance|fight|assault|weapon|crime/i.test(complaintText(item));

export default function AuthorityComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState({});
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [complaintData, providerData] = await Promise.all([
      fetchAdminData("authority-complaints"),
      fetchAdminData("providers"),
    ]);

    if (complaintData.success) {
      setComplaints(complaintData.complaints || []);
    }

    if (providerData.success) {
      setProviders(providerData.providers || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const forwardDepartment = async (complaint) => {
    const departmentId = selectedDepartments[complaint._id];
    if (!departmentId) return alert("Please select a registered department first");

    try {
      const res = await fetch(`${API}/api/society-complaints/forward-department/${complaint._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
        body: JSON.stringify({ departmentId }),
      });

      const data = await res.json();

      if (data.success) {
        setSelectedDepartments((prev) => ({ ...prev, [complaint._id]: "" }));
        load();
      } else {
        alert(data.message || "Could not forward complaint");
      }
    } catch (err) {
      alert("Could not connect to backend. Please make sure port 5000 is running.");
    }
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Authority Complaints</h2>
          <p>Forward garbage and security complaints to registered departments. Admin does not upload resolution proof here.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div>
              <span>Authority queue</span>
              <h3>Open authority records</h3>
            </div>
            <strong>{complaints.length}</strong>
          </div>

          {loading && <div className="s2f-empty">Loading authority complaints...</div>}
          {!loading && !complaints.length && <div className="s2f-empty">No authority complaints need review.</div>}

          <div className="s2f-accordion-list">
            {complaints.map((item) => {
              const isOpen = openId === item._id;
              const options = departmentOptionsFor(item, providers);
              const imagePath = item.imagePath || item.beforeImage;
              const security = isSecurityComplaint(item);
              const violence = isViolenceComplaint(item);

              return (
                <article className={`s2f-accordion ${isOpen ? "open" : ""}`} key={item._id}>
                  <button className="s2f-accordion-toggle" onClick={() => setOpenId(isOpen ? null : item._id)}>
                    <div className="s2f-accordion-title">
                      <strong>{item.complaintType}</strong>
                      <span>{shortId(item._id)}</span>
                    </div>
                    <div className="s2f-accordion-meta">
                      <span className="s2f-status-badge">{item.status.replaceAll("_", " ")}</span>
                      <span className="s2f-view-label">{isOpen ? "Hide details" : "Review"}</span>
                      <FaChevronDown aria-hidden="true" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="s2f-accordion-body">
                      {imagePath && (
                        <img
                          className="s2f-complaint-image"
                          src={`${API}${imagePath}`}
                          alt={`${item.complaintType} complaint`}
                        />
                      )}

                      <div className="s2f-detail-grid">
                        <Detail label="Resident" value={item.residentId?.name || "Resident"} />
                        <Detail label="Current Department" value={item.assignedProvider?.company || item.assignedProvider?.name || item.authorityName || "Not forwarded yet"} />
                        <Detail label="Location" value={item.location} />
                        <Detail label="Description" value={item.description} />
                        <Detail
                          label="Proof Rule"
                          value={
                            violence
                              ? "Violence complaints are view only and assigned directly to a provider for done-only handling"
                              : security
                                ? "Security department marks done with notes only"
                                : "Garbage department uploads proof image"
                          }
                        />
                      </div>

                      {!violence && !["WORK_SUBMITTED", "COMPLETED"].includes(item.status) && (
                        <div className="s2f-action-box">
                          <h4>Forward to Registered Department</h4>
                          <div className="s2f-form-row compact">
                            <select
                              value={selectedDepartments[item._id] || ""}
                              onChange={(e) =>
                                setSelectedDepartments((prev) => ({ ...prev, [item._id]: e.target.value }))
                              }
                            >
                              <option value="">Select registered department</option>
                              {options.map((provider) => (
                                <option value={provider._id} key={provider._id}>
                                  {provider.company || provider.name} - {(provider.services || []).join(", ")}
                                </option>
                              ))}
                            </select>

                            <button className="s2f-btn primary" onClick={() => forwardDepartment(item)}>
                              Forward / Update
                            </button>
                          </div>

                          {options.length === 0 && (
                            <p className="s2f-alert danger">No matching registered department found for this complaint type.</p>
                          )}
                        </div>
                      )}
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
  return (
    <div className="s2f-detail">
      <span>{label}</span>
      <p>{value || "Not provided"}</p>
    </div>
  );
}
