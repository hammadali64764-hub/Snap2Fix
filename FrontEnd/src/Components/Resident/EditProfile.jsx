import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const residentId = localStorage.getItem("residentId");

  const [resident, setResident] = useState({
    name: "",
    cnic: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!residentId) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/resident/${residentId}/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("residentToken")}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Failed to load profile");
          return;
        }

        setResident({
          name: data.name || "",
          cnic: data.cnic || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch {
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, [navigate, residentId]);

  const handleChange = (e) => {
    setResident({ ...resident, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/resident/${residentId}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("residentToken")}`,
          },
          body: JSON.stringify(resident),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      alert("Profile updated successfully!");
    } catch {
      alert("Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("residentToken");
    localStorage.removeItem("residentId");
    navigate("/");
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Update Profile</h2>
          <p>Manage your resident profile information.</p>
        </section>

        <section className="s2f-section-panel">
          <div className="s2f-section-heading">
            <div><span>Profile settings</span><h3>Resident Information</h3></div>
          </div>

          <div className="s2f-action-box">
            <label className="s2f-label">Resident Name</label>
            <input
              className="s2f-input"
              name="name"
              value={resident.name}
              onChange={handleChange}
            />

            <label className="s2f-label">CNIC</label>
            <input
              className="s2f-input"
              name="cnic"
              value={resident.cnic}
              onChange={handleChange}
            />

            <label className="s2f-label">Phone Number</label>
            <input
              className="s2f-input"
              name="phone"
              value={resident.phone}
              onChange={handleChange}
            />

            <label className="s2f-label">Address</label>
            <input
              className="s2f-input"
              name="address"
              value={resident.address}
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
