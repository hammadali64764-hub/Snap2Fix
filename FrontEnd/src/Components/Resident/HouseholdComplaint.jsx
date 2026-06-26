import { useState } from "react";

export default function HouseholdComplaint() {
  const [service, setService] = useState("Gardening");
  const [description, setDescription] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const enableLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by this browser");
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const fallbackLocation = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        setCoordinates({ lat, lng });
        setLocationEnabled(true);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          setLocation(data.display_name || fallbackLocation);
        } catch {
          setLocation(fallbackLocation);
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
        alert("Please enable your device location");
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const handleSubmit = async () => {
    if (!description || !location) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/household/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("residentToken")}`,
        },
        body: JSON.stringify({
          serviceType: service,
          description,
          location,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Household complaint submitted successfully");
        setDescription("");
        setLocation("");
        setCoordinates(null);
        setLocationEnabled(false);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="s2f-page">
      <div className="s2f-container s2f-center">

        {/* HERO */}
        <section className="s2f-hero">
          <h1>Household Complaint</h1>
          <p>Submit a manual complaint for household services</p>
        </section>

        {/* CENTER CARD */}
        <section className="s2f-card s2f-single">

          <h3>Complaint Details</h3>

          <label className="s2f-label">Select Service</label>
          <select
            className="s2f-input"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option>Gardening</option>
            <option>Electric Services</option>
          </select>

          <label className="s2f-label">Description</label>
          <textarea
            className="s2f-input"
            style={{ minHeight: "100px" }}
            placeholder="Describe your household issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            className="s2f-btn primary"
            onClick={enableLocation}
            disabled={detectingLocation}
          >
            {detectingLocation ? "Detecting Location..." : "Detect Device Location"}
          </button>

          {locationEnabled && (
            <div className="s2f-locationBox">
              <label className="s2f-label">Detected Address</label>

              <textarea
                className="s2f-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ minHeight: "80px" }}
              />

              {coordinates && (
                <iframe
                  title="Complaint location map"
                  className="s2f-map"
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    coordinates.lng - 0.004
                  },${coordinates.lat - 0.004},${
                    coordinates.lng + 0.004
                  },${coordinates.lat + 0.004}&layer=mapnik&marker=${
                    coordinates.lat
                  },${coordinates.lng}`}
                />
              )}
            </div>
          )}

          <button className="s2f-btn dark full" onClick={handleSubmit}>
            Submit Complaint
          </button>

        </section>

      </div>
    </div>
  );
}