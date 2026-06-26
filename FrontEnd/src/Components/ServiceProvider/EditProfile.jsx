import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProviderEditProfile() {
  const navigate = useNavigate();
  const providerId = localStorage.getItem("providerId");
  const serviceList = ["Electric Services", "Road Repair Services", "Garbage Management Services", "Security Services", "Gardening"];

  const [provider, setProvider] = useState({
    company: "",
    name: "",
    phone: "",
    services: [],
    societyName: "",
  });

  useEffect(() => {
    if (!providerId) {
      navigate("/provider-register");
      return;
    }

    fetch(`http://localhost:5000/api/provider/${providerId}/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("providerToken")}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setProvider({
          company: data.company || "",
          name: data.name || "",
          phone: data.phone || "",
          services: data.services || [],
          societyName: data.society?.societyName || "",
        })
      )
      .catch(() => alert("Failed to load profile"));
  }, [navigate, providerId]);

  const handleChange = (e) => setProvider({ ...provider, [e.target.name]: e.target.value });

  const toggleService = (service) => {
    setProvider((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((item) => item !== service)
        : [...prev.services, service],
    }));
  };

  const handleSave = async () => {
    const res = await fetch(`http://localhost:5000/api/provider/${providerId}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("providerToken")}`,
      },
      body: JSON.stringify({
        company: provider.company,
        name: provider.name,
        phone: provider.phone,
        services: provider.services,
      }),
    });
    const data = await res.json();
    alert(res.ok ? "Profile updated successfully!" : data.message || "Update failed");
  };

  const handleLogout = () => {
    localStorage.removeItem("providerToken");
    localStorage.removeItem("providerId");
    navigate("/provider-register");
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Provider Profile</h2>
          <p>Keep your service details accurate so matching complaints appear in your workspace.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div><span>Profile settings</span><h3>Service Provider Information</h3></div>
          </div>

          <div className="s2f-detail-grid">
            <Field label="Company Name" name="company" value={provider.company} onChange={handleChange} />
            <Field label="Provider Name" name="name" value={provider.name} onChange={handleChange} />
            <Field label="Phone Number" name="phone" value={provider.phone} onChange={handleChange} />
            <Field label="Society" value={provider.societyName} disabled />
          </div>

          <div className="s2f-action-box">
            <h4>Services</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {serviceList.map((service) => (
                <label className="s2f-status-badge" key={service} style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={provider.services.includes(service)}
                    onChange={() => toggleService(service)}
                    style={{ marginRight: "8px" }}
                  />
                  {service}
                </label>
              ))}
            </div>
          </div>

          <div className="s2f-actions aligned">
            <button className="s2f-btn primary" onClick={handleSave}>Save Changes</button>
            <button className="s2f-btn outline" onClick={handleLogout}>Logout</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="s2f-detail">
      <span>{label}</span>
      <input className="s2f-input" {...props} />
    </label>
  );
}
