import { FaBuilding, FaTools, FaUser, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    title: "Administrator",
    text: "Review society registrations and control platform-level onboarding.",
    icon: FaUserShield,
    path: "/administrator-login",
  },
  
  {
    title: "Society Admin",
    text: "Manage residents, providers, bids, payments, verification, and proof of work.",
    icon: FaBuilding,
    path: "/admin-register",
  },
  {
    title: "Service Provider",
    text: "Find relevant work, submit bids, negotiate, complete assigned jobs, and view feedback.",
    icon: FaTools,
    path: "/provider-register",
  },
  {
    title: "Resident",
    text: "Submit society or household complaints, track progress, review bids, and give feedback.",
    icon: FaUser,
    path: "/resident-register",
  },
  
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-copy">
          <span className="home-kicker">AI assisted complaint operations</span>
          <h1>Snap2Fix turns society maintenance into a clear, trackable workflow.</h1>
          <p>
            Residents report problems, admins verify and assign work, providers bid and complete jobs,
            and every role stays updated through one connected system.
          </p>
          
        </div>
      </section>

      <section className="role-section">
        <div className="section-head">
          <span>Choose your workspace</span>
          <h2>Role-based access.</h2>
        </div>

        <div className="role-grid">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button key={role.title} className="role-card" onClick={() => navigate(role.path)}>
                <Icon />
                <strong>{role.title}</strong>
                <p>{role.text}</p>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
