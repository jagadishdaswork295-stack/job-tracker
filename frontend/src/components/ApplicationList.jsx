import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getAvatarColor } from "../App";

const API = "http://localhost:8080/api/applications";

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const from = prev.current;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + ease * (target - from)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prev.current = target;
  }, [target, duration]);
  return value;
}

export default function ApplicationList() {
  const [apps, setApps] = useState([]);

  useEffect(() => { axios.get(API).then(r => setApps(r.data)); }, []);

  const deleteApp = async (id) => {
    await axios.delete(`${API}/${id}`);
    setApps(apps.filter(a => a.id !== id));
  };

  const updateStatus = async (app, status) => {
    const updated = { ...app, status };
    await axios.put(`${API}/${app.id}`, updated);
    setApps(apps.map(a => a.id === app.id ? updated : a));
  };

  const counts = {
    total: apps.length,
    interviews: apps.filter(a => a.status === "INTERVIEW").length,
    offers: apps.filter(a => a.status === "OFFER").length,
    rejected: apps.filter(a => a.status === "REJECTED").length,
  };

  const dTotal = useCountUp(counts.total);
  const dInterviews = useCountUp(counts.interviews);
  const dOffers = useCountUp(counts.offers);
  const dRejected = useCountUp(counts.rejected);

  return (
    <>
      <div className="stats-strip">
        <div className="stat-item">
          <div className="num">{dTotal}</div>
          <div className="lbl">Total Applied</div>
        </div>
        <div className="stat-item">
          <div className="num" style={{color:"#d97706"}}>{dInterviews}</div>
          <div className="lbl">Interviews</div>
        </div>
        <div className="stat-item">
          <div className="num" style={{color:"#059669"}}>{dOffers}</div>
          <div className="lbl">Offers</div>
        </div>
        <div className="stat-item">
          <div className="num" style={{color:"#ef4444"}}>{dRejected}</div>
          <div className="lbl">Rejected</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Recent Applications</h2>
          <span className="count-badge">{apps.length} total</span>
        </div>

        {apps.length === 0 ? (
          <div className="empty">
  <div className="empty-icon">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  </div>
  <h3>No applications yet</h3>
  <p>Add your first application to get started</p>
</div>
        ) : (
          apps.map((app, index) => (
            <div className="app-card" key={app.id} style={{animationDelay: `${index * 60}ms`}}>
              <div className="app-card-left">
                <div className="avatar" style={{ background: getAvatarColor(app.companyName) }}>
                  {app.companyName.charAt(0).toUpperCase()}
                </div>
                <div className="app-card-info">
                  <h3>{app.companyName}</h3>
                  <p>{app.jobRole} · Applied {app.appliedDate}{app.deadline ? ` · Deadline: ${app.deadline}` : ""}</p>
                </div>
              </div>
              <div className="app-card-right">
                <select className="status-select" value={app.status} onChange={e => updateStatus(app, e.target.value)}>
                  <option>APPLIED</option>
                  <option>INTERVIEW</option>
                  <option>OFFER</option>
                  <option>REJECTED</option>
                </select>
                <span className={`badge ${app.status}`}>{app.status}</span>
                <button className="del-btn" onClick={() => deleteApp(app.id)}>
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}