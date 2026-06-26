import { useState } from "react";
import { FaBuilding, FaHome, FaSearch, FaHistory, FaGavel } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ResidentDashboard() {
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState("");

  const goTrack = () => {
    navigate("/track-complaint", { state: { complaintId: trackId } });
  };

  return (
    <>
      <div className="dashboard-page">

        <div className="dashboard-container">
          <section className="dashboard-visual resident-visual">
            <div>
              <span className="hero-chip">Resident workspace</span>
              <h2>Keep your society moving without chasing updates.</h2>
              <p>Submit a complaint, follow every status change, review bids, and close the work with feedback.</p>
              <div className="tracking-bar">
                <input
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  placeholder="Enter complaint ID, e.g. S2F-12AB"
                />
                <button onClick={goTrack}>Track</button>
              </div>
            </div>
          </section>

          <div className="dashboard-cards">
            <div
              className="dashboard-card"
              onClick={() => navigate("/society-level-complaint")}
            >
              <FaBuilding className="card-icon" />
              <p>Society Complaint</p>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/household-complaint")}
            >
              <FaHome className="card-icon" />
              <p>Household Complaint</p>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/resident-bids")}
            >
              <FaGavel className="card-icon" />
              <p>Complaint Bids</p>
            </div>


            <div
              className="dashboard-card"
              onClick={() => navigate("/track-complaint")}
            >
              <FaSearch className="card-icon" />
              <p>Track Complaint</p>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate("/complaint-history")}
            >
              <FaHistory className="card-icon" />
              <p>Complaint History</p>
            </div>
          </div>
        </div>
      </div>

      <style>{css}</style>
    </>
  );
}

const css = `
  .dashboard-page {
    width: 100vw;
    min-height: calc(100vh - 120px);
    background:
      radial-gradient(circle at 14% 0%, rgba(201, 162, 77, 0.14), transparent 24rem),
      linear-gradient(180deg, #e9eef4 0%, #f8fafc 100%);
    display: flex;
    justify-content: center;
    padding: 42px 20px 60px;
    box-sizing: border-box;
  }

  .dashboard-container {
    width: 100%;
    max-width: 1200px;
    font-family: Inter, "Segoe UI", Arial, sans-serif;
  }

  .dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
    justify-items: center;
  }

  .dashboard-visual {
    min-height: 280px;
    border-radius: 24px;
    margin-bottom: 24px;
    padding: 34px;
    color: #fff;
    text-align: left;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    background:
      linear-gradient(90deg, rgba(7, 20, 35, 0.92), rgba(7, 20, 35, 0.48)),
      url("https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80");
    background-size: cover;
    background-position: center;
    box-shadow: 0 28px 70px rgba(7, 20, 35, 0.24);
  }

  .hero-chip {
    display: inline-flex;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.13);
    color: #f3c969;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .dashboard-visual h2 {
    max-width: 620px;
    margin: 16px 0 10px;
    font-size: 34px;
    line-height: 1.08;
  }

  .dashboard-visual p {
    max-width: 560px;
    margin: 0 0 22px;
    color: #dbe7f0;
    font-size: 14px;
    line-height: 1.7;
  }

  .tracking-bar {
    width: min(620px, 100%);
    display: flex;
    gap: 10px;
    padding: 8px;
    border-radius: 16px;
    background: rgba(255,255,255,0.16);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.24);
  }

  .tracking-bar input {
    flex: 1;
    min-width: 0;
    border: none;
    border-radius: 11px;
    padding: 12px 13px;
    color: #071423;
  }

  .tracking-bar button {
    border: none;
    border-radius: 11px;
    padding: 0 20px;
    background: #f3c969;
    color: #071423;
    font-weight: 900;
    cursor: pointer;
  }

  .dashboard-card {
    width: 100%;
    min-height: 132px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid #dbe4ee;
    border-radius: 18px;
    box-shadow: 0 18px 38px rgba(11, 28, 45, 0.09);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
  }

  .dashboard-card p {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #0b1c2d;
  }

  .card-icon {
    font-size: 28px;
    color: #c9a24d;
    margin-bottom: 10px;
  }

  .dashboard-card:hover {
    background: #0b1c2d;
    transform: translateY(-6px);
    box-shadow: 0 24px 46px rgba(11, 28, 45, 0.2);
  }

  .dashboard-card:hover p,
  .dashboard-card:hover .card-icon {
    color: #c9a24d;
  }
`;
