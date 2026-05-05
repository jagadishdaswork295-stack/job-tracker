import { useState } from "react";
import ApplicationList from "./components/ApplicationList";
import AddApplication from "./components/AddApplication";
import AiMatcher from "./components/AiMatcher";
import "./App.css";

const AVATARS = ["#2563eb","#7c3aed","#0891b2","#059669","#d97706","#dc2626","#db2777"];
export function getAvatarColor(name) {
  let h = 0;
  for (let c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return AVATARS[Math.abs(h) % AVATARS.length];
}

export default function App() {
  const [tab, setTab] = useState("applications");
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo" onClick={() => setTab("applications")}>
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1>Track<span>AI</span></h1>
        </div>
        <div className="nav-links">
          <button className={`nav-btn ${tab==="applications"?"active":""}`} onClick={() => setTab("applications")}>
            My Applications
          </button>
          <button className={`nav-btn ${tab==="add"?"active":""}`} onClick={() => setTab("add")}>
            Add New
          </button>
          <button className={`nav-cta ${tab==="ai"?"active":""}`} onClick={() => setTab("ai")}>
            <span className="nav-cta-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              AI Score
            </span>
          </button>
        </div>
      </nav>

      {tab === "applications" && (
        <div className="hero-wrapper">
          <div className="hero-orbs">
            <div className="orb orb--blue"></div>
            <div className="orb orb--purple"></div>
          </div>
          <div className="hero">
            <div className="hero-badge">
              <div className="hero-badge-dot"></div>
              AI-Powered Job Tracker
            </div>
            <h1>Track Your Applications,<br /><span className="gradient-text">Land Your Dream Job</span></h1>
            <p>Stay organized, get AI-powered match scores, and never miss a deadline in your job search.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => setTab("add")}>
                <svg style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2,marginRight:6,verticalAlign:'middle'}} viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
                Add Application
              </button>
              <button className="btn-secondary" onClick={() => setTab("ai")}>
                <svg style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2,marginRight:6,verticalAlign:'middle'}} viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                Try AI Scorer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page">
        {tab === "applications" && <ApplicationList key={refresh} />}
        {tab === "add" && <AddApplication onAdded={() => { setRefresh(r=>r+1); setTab("applications"); }} />}
        {tab === "ai" && <AiMatcher />}
      </div>
    </div>
  );
}