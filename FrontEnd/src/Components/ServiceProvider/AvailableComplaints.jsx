import { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const API = "http://localhost:5000";

const isAuthorityComplaint = (item = {}) =>
  item.flowType === "DEPARTMENT" ||
  /garbage|waste|trash|security|guard|theft|safety|violence|violance|fight|assault|weapon|crime/i.test(
    `${item.complaintType || ""} ${item.departmentType || ""} ${item.description || ""}`
  );

export default function AvailableComplaints() {
  const [householdComplaints, setHouseholdComplaints] = useState([]);
  const [householdBids, setHouseholdBids] = useState([]);
  const [societyComplaints, setSocietyComplaints] = useState([]);
  const [societyBids, setSocietyBids] = useState([]);
  const [forms, setForms] = useState({});
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("providerToken");

  const load = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const responses = await Promise.all([
        fetch(`${API}/api/household/available`, { headers }),
        fetch(`${API}/api/household-bids/provider-bids`, { headers }),
        fetch(`${API}/api/society-complaints/provider`, { headers }),
        fetch(`${API}/api/society-bids/provider`, { headers }),
      ]);
      const [householdData, householdBidData, societyData, societyBidData] = await Promise.all(responses.map((res) => res.json()));
      if (householdData.success) setHouseholdComplaints(householdData.complaints || []);
      if (householdBidData.success) setHouseholdBids(householdBidData.bids || []);
      if (societyData.success) setSocietyComplaints(societyData.complaints || []);
      if (societyBidData.success) setSocietyBids(societyBidData.bids || []);
    } catch {
      alert("Could not load available complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const societyBidIds = useMemo(() => new Set(societyBids.map((bid) => bid.complaintId?._id)), [societyBids]);
  const householdBidIds = useMemo(() => new Set(householdBids.map((bid) => bid.complaintId?._id)), [householdBids]);
  const openSociety = societyComplaints.filter((item) => !isAuthorityComplaint(item) && ["AI_CLASSIFIED", "FORWARDED", "BIDDING", "NEGOTIATION"].includes(item.status) && !societyBidIds.has(item._id));
  const openHousehold = householdComplaints.filter((item) => !householdBidIds.has(item._id));
  const activeHousehold = householdBids.filter((bid) => !["ACCEPTED", "REJECTED"].includes(bid.status));
  const activeSociety = societyBids.filter((bid) => !["ACCEPTED", "REJECTED"].includes(bid.status));

  const change = (id, field, value) => setForms((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  const toggle = (key) => setOpenKey((current) => current === key ? null : key);

  const submitBid = async (kind, complaintId) => {
    const form = forms[complaintId] || {};
    if (!form.amount || !form.days) return alert("Enter cost and completion days");
    const url = kind === "society" ? `${API}/api/society-bids` : `${API}/api/household-bids/place`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ complaintId, amount: Number(form.amount), timeEstimate: `${form.days} days` }),
    });
    const data = await res.json();
    if (data.success) {
      setForms((prev) => ({ ...prev, [complaintId]: {} }));
      setOpenKey(null);
      load();
    } else alert(data.message || "Could not submit bid");
  };

  const respond = async (kind, bidId, action) => {
    const form = forms[bidId] || {};
    if (action === "counter" && (!form.amount || !form.days)) return alert("Enter your counter cost and completion days");
    const url = kind === "society" ? `${API}/api/society-bids/${bidId}/provider-response` : `${API}/api/household-bids/respond/${bidId}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, amount: form.amount ? Number(form.amount) : undefined, timeEstimate: form.days ? `${form.days} days` : undefined, message: form.message }),
    });
    const data = await res.json();
    if (data.success) { setOpenKey(null); load(); } else alert(data.message || "Could not update negotiation");
  };

  if (loading) return <div className="s2f-page"><div className="s2f-container"><div className="s2f-card">Loading available complaints...</div></div></div>;

  return (
    <div className="s2f-page">
      <div className="s2f-container">
        <section className="s2f-hero">
          <h2>Available Complaints</h2>
          <p>Review matching work, place a bid, and respond to active negotiations.</p>
        </section>

        <ComplaintSection title="My negotiations" eyebrow="Bids requiring attention" count={activeSociety.length + activeHousehold.length} empty="No active negotiations.">
          {activeSociety.map((bid) => <NegotiationRow key={bid._id} kind="society" bid={bid} isOpen={openKey === `bid-${bid._id}`} toggle={toggle} forms={forms} change={change} respond={respond} />)}
          {activeHousehold.map((bid) => <NegotiationRow key={bid._id} kind="household" bid={bid} isOpen={openKey === `bid-${bid._id}`} toggle={toggle} forms={forms} change={change} respond={respond} />)}
        </ComplaintSection>

        <ComplaintSection title="Open for bidding" eyebrow="Available work" count={openSociety.length + openHousehold.length} empty="No relevant complaints are open for bidding.">
          {openSociety.map((item) => <OpenRow key={item._id} kind="society" item={item} isOpen={openKey === `open-${item._id}`} toggle={toggle} forms={forms} change={change} submitBid={submitBid} />)}
          {openHousehold.map((item) => <OpenRow key={item._id} kind="household" item={item} isOpen={openKey === `open-${item._id}`} toggle={toggle} forms={forms} change={change} submitBid={submitBid} />)}
        </ComplaintSection>
      </div>
    </div>
  );
}

function ComplaintSection({ title, eyebrow, count, empty, children }) {
  return (
    <section className="s2f-section-panel">
      <div className="s2f-section-heading"><div><span>{eyebrow}</span><h3>{title}</h3></div><strong>{count}</strong></div>
      {count ? <div className="s2f-accordion-list">{children}</div> : <div className="s2f-empty">{empty}</div>}
    </section>
  );
}

function RowHeader({ item, kind, status, isOpen, onClick }) {
  const type = item?.complaintType || item?.serviceType || "Complaint";
  return (
    <button className="s2f-accordion-toggle" onClick={onClick} aria-expanded={isOpen}>
      <div className="s2f-accordion-title"><strong>{type}</strong><span>S2F-{item?._id?.slice(-4).toUpperCase()}</span></div>
      <div className="s2f-accordion-meta"><span className="s2f-kind-badge">{kind}</span>{status && <span className="s2f-status-badge">{status.replaceAll("_", " ")}</span>}<span className="s2f-view-label">{isOpen ? "Hide details" : "View details"}</span><FaChevronDown aria-hidden="true" /></div>
    </button>
  );
}

function OpenRow({ kind, item, isOpen, toggle, forms, change, submitBid }) {
  return (
    <article className={`s2f-accordion ${isOpen ? "open" : ""}`}>
      <RowHeader item={item} kind={kind} isOpen={isOpen} onClick={() => toggle(`open-${item._id}`)} />
      {isOpen && (
        <div className="s2f-accordion-body">
          {kind === "society" && item.imagePath && <img className="s2f-complaint-image" src={`${API}${item.imagePath}`} alt={`${item.complaintType} complaint`} />}
          <div className="s2f-detail-grid"><Detail label="Description" value={item.description} /><Detail label="Location" value={item.location} /></div>
          <div className="s2f-action-box">
            <h4>Place your bid</h4>
            <div className="s2f-form-row compact">
              <input type="number" min="1" placeholder="Cost (Rs)" value={forms[item._id]?.amount || ""} onChange={(e) => change(item._id, "amount", e.target.value)} />
              <input type="number" min="1" placeholder="Completion days" value={forms[item._id]?.days || ""} onChange={(e) => change(item._id, "days", e.target.value)} />
              <button className="s2f-btn primary" onClick={() => submitBid(kind, item._id)}>Submit bid</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function NegotiationRow({ kind, bid, isOpen, toggle, forms, change, respond }) {
  const item = bid.complaintId;
  return (
    <article className={`s2f-accordion ${isOpen ? "open" : ""}`}>
      <RowHeader item={item} kind={kind} status={bid.status} isOpen={isOpen} onClick={() => toggle(`bid-${bid._id}`)} />
      {isOpen && (
        <div className="s2f-accordion-body">
          {kind === "society" && item?.imagePath && <img className="s2f-complaint-image" src={`${API}${item.imagePath}`} alt={`${item.complaintType} complaint`} />}
          <div className="s2f-detail-grid"><Detail label="Current offer" value={`Rs ${bid.finalAmount || bid.amount} / ${bid.finalTimeEstimate || bid.timeEstimate}`} /><Detail label="Location" value={item?.location} /><Detail label="Description" value={item?.description} /></div>
          <div className="s2f-action-box">
            <h4>Respond to offer</h4>
            <div className="s2f-form-row negotiation">
              <input type="number" min="1" placeholder="Counter cost (Rs)" value={forms[bid._id]?.amount || ""} onChange={(e) => change(bid._id, "amount", e.target.value)} />
              <input type="number" min="1" placeholder="Completion days" value={forms[bid._id]?.days || ""} onChange={(e) => change(bid._id, "days", e.target.value)} />
              <input placeholder="Message (optional)" value={forms[bid._id]?.message || ""} onChange={(e) => change(bid._id, "message", e.target.value)} />
            </div>
            <div className="s2f-actions aligned">
              <button className="s2f-btn primary" onClick={() => respond(kind, bid._id, "accept")}>Accept offer</button>
              <button className="s2f-btn outline" onClick={() => respond(kind, bid._id, "counter")}>Send counter</button>
              <button className="s2f-btn danger" onClick={() => respond(kind, bid._id, "reject")}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function Detail({ label, value }) {
  return <div className="s2f-detail"><span>{label}</span><p>{value || "Not provided"}</p></div>;
}
