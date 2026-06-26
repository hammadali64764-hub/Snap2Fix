import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { fetchAdminData } from "./adminApi";

export default function ListOfProviders() {
  const [providers, setProviders] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetchAdminData("providers").then((data) => {
      if (data.success) setProviders(data.providers);
    });
  }, []);

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Service Providers</h2>
          <p>Registered providers associated with your society.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div><span>Provider directory</span><h3>Registered providers</h3></div>
            <strong>{providers.length}</strong>
          </div>

          {!providers.length && <div className="s2f-empty">No providers registered yet.</div>}

          <div className="s2f-accordion-list">
            {providers.map((provider) => {
              const isOpen = openId === provider._id;
              return (
                <article className={`s2f-accordion ${isOpen ? "open" : ""}`} key={provider._id}>
                  <button className="s2f-accordion-toggle" onClick={() => setOpenId(isOpen ? null : provider._id)}>
                    <div className="s2f-accordion-title">
                      <strong>{provider.company || provider.name}</strong>
                      <span>{provider.services?.join(", ") || "Service provider"}</span>
                    </div>
                    <div className="s2f-accordion-meta">
                      <span className="s2f-kind-badge">Provider</span>
                      <span className="s2f-view-label">{isOpen ? "Hide details" : "View details"}</span>
                      <FaChevronDown aria-hidden="true" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="s2f-accordion-body">
                      <div className="s2f-detail-grid">
                        <Detail label="Name" value={provider.name} />
                        <Detail label="Phone" value={provider.phone} />
                        <Detail label="Email" value={provider.email} />
                        <Detail label="Services" value={provider.services?.join(", ")} />
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
