import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { fetchAdminData, shortId } from "./adminApi";

const API = "http://localhost:5000";

export default function TotalComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetchAdminData("complaints").then((data) => {
      if (data.success) {
        setComplaints(
          data.complaints.filter(
            (item) =>
              item.workflowType !== "AUTHORITY" &&
              /street light|light|road/i.test(item.complaintType || "")
          )
        );
      }
    });
  }, []);

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Repair Complaints</h2>
          <p>Street light and road damage complaints that follow the bidding workflow.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div><span>Bidding workflow</span><h3>Repair complaint records</h3></div>
            <strong>{complaints.length}</strong>
          </div>

          {!complaints.length && <div className="s2f-empty">No repair complaints found.</div>}

          <div className="s2f-accordion-list">
            {complaints.map((item) => {
              const isOpen = openId === item._id;
              return (
                <article className={`s2f-accordion ${isOpen ? "open" : ""}`} key={item._id}>
                  <button className="s2f-accordion-toggle" onClick={() => setOpenId(isOpen ? null : item._id)}>
                    <div className="s2f-accordion-title">
                      <strong>{item.complaintType}</strong>
                      <span>{shortId(item._id)}</span>
                    </div>
                    <div className="s2f-accordion-meta">
                      <span className="s2f-status-badge">{item.status.replaceAll("_", " ")}</span>
                      <span className="s2f-view-label">{isOpen ? "Hide details" : "View details"}</span>
                      <FaChevronDown aria-hidden="true" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="s2f-accordion-body">
                      {(item.beforeImage || item.imagePath) && <img className="s2f-complaint-image" src={`${API}${item.beforeImage || item.imagePath}`} alt="Resident complaint before work" />}
                      <div className="s2f-detail-grid">
                        <Detail label="Resident" value={item.residentId?.name || "Resident"} />
                        <Detail label="Provider" value={item.assignedProvider?.company || "Not assigned"} />
                        <Detail label="Workflow" value="Bidding" />
                        <Detail label="Location" value={item.location} />
                        <Detail label="Description" value={item.description} />
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
