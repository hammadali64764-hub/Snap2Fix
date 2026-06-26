import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminEditProfile() {
  const navigate = useNavigate();
  const societyId = localStorage.getItem("societyId");

  const [admin, setAdmin] = useState({
    societyName: "",
    adminName: "",
    phone: "",
  });

  useEffect(() => {
    if (!societyId) {
      navigate("/admin-register");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/society/${societyId}/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("societyToken")}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          alert(data.message);
          return;
        }

        setAdmin({
          societyName: data.societyName,
          adminName: data.adminName,
          phone: data.phone,
        });
      } catch {
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, [navigate, societyId]);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/society/${societyId}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("societyToken")}`,
          },
          body: JSON.stringify(admin),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Profile updated successfully!");
    } catch {
      alert("Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("societyToken");
    localStorage.removeItem("societyId");
    navigate("/admin-register");
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Update Profile</h2>
          <p>Manage your society admin information.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div><span>Profile settings</span><h3>Admin Information</h3></div>
          </div>

          <div className="s2f-action-box">
            <label className="s2f-label">Society Name</label>
            <input
              className="s2f-input"
              name="societyName"
              value={admin.societyName}
              onChange={handleChange}
            />

            <label className="s2f-label">Admin Name</label>
            <input
              className="s2f-input"
              name="adminName"
              value={admin.adminName}
              onChange={handleChange}
            />

            <label className="s2f-label">Phone Number</label>
            <input
              className="s2f-input"
              name="phone"
              value={admin.phone}
              onChange={handleChange}
            />

            <div className="s2f-actions aligned">
              <button className="s2f-btn primary" onClick={handleSave}>Save Changes</button>
              <button className="s2f-btn outline" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
