import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/applications/analyze-match";
const RESUME_API = "http://localhost:8080/api/resume/extract";
const JOB_API = "http://localhost:8080/api/job/fetch";

function scoreLabel(s) {
  if (s >= 80) return { label: "Strong Match", color: "#059669" };
  if (s >= 60) return { label: "Good Match", color: "#d97706" };
  if (s >= 40) return { label: "Partial Match", color: "#ea580c" };
  return { label: "Weak Match", color: "#dc2626" };
}

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <polyline points="16 16 12 12 8 16"></polyline>
    <line x1="12" y1="12" x2="12" y2="21"></line>
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"></path>
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

export default function AiMatcher() {
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [jobUrl, setJobUrl] = useState("");
  const [jdText, setJdText] = useState("");
  const [jobLoading, setJobLoading] = useState(false);
  const [fetchMsg, setFetchMsg] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const fileRef = useRef();

  useEffect(() => {
    if (!result) return;
    const target = result.matchScore;
    const start = performance.now();
    const dur = 1200;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(ease * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [result]);

  const handlePdf = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeLoading(true);
    setResumeFile(file.name);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await axios.post(RESUME_API, fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.text) setResumeText(res.data.text);
      else alert("Could not read PDF.");
    } catch { alert("PDF extraction failed."); }
    setResumeLoading(false);
  };

  const handleFetch = async () => {
    if (!jobUrl) return;
    setJobLoading(true); setFetchMsg(""); setJdText("");
    try {
      const res = await axios.post(JOB_API, { url: jobUrl });
      if (res.data.error) setFetchMsg(res.data.error);
      else { setJdText(res.data.text); setFetchMsg("Extracted — review and edit below if needed."); }
    } catch { setFetchMsg("Failed to fetch. Paste JD manually."); }
    setJobLoading(false);
  };

  const analyze = async () => {
    if (!resumeText || !jdText) { alert("Provide both resume and job description."); return; }
    setLoading(true); setResult(null); setDisplayScore(0);
    try {
      const res = await axios.post(API, { resume: resumeText, jobDescription: jdText });
      setResult(typeof res.data === "string" ? JSON.parse(res.data) : res.data);
    } catch { alert("Analysis failed. Try again."); }
    setLoading(false);
  };

  const info = result ? scoreLabel(result.matchScore) : null;

  return (
    <div className="panel">
      <div className="ai-header">
        <div className="section-label">AI POWERED</div>
        <h2>Resume-JD Match Scorer</h2>
        <p>Upload your resume and add a job description to get an instant AI match score with actionable feedback.</p>
      </div>

      <div className="ai-grid">
        <div className="ai-input-box">
          <div className="ai-input-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Resume
          </div>
          <div className={`upload-zone ${!resumeFile && !resumeLoading ? 'upload-zone--idle' : ''}`} onClick={() => fileRef.current.click()}>
            {resumeLoading ? (
              <p>Extracting...</p>
            ) : resumeFile ? (
              <>
                <div className="upload-icon-box"><FileIcon /></div>
                <div className="upload-name">{resumeFile}</div>
                <div className="upload-hint">Click to change file</div>
              </>
            ) : (
              <>
                <div className="upload-icon-box"><UploadIcon /></div>
                <p style={{fontWeight:500, fontSize:"0.85rem", color:"var(--text-2)"}}>Upload PDF Resume</p>
                <div className="upload-hint">Click to browse files</div>
              </>
            )}
          </div>
          {resumeText && (
            <div className="upload-success">
              <svg style={{width:12,height:12,stroke:'currentColor',fill:'none',strokeWidth:2,marginRight:4,verticalAlign:'middle'}} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
              Text extracted successfully — {resumeText.length} characters
            </div>
          )}
          <input ref={fileRef} type="file" accept=".pdf" style={{display:"none"}} onChange={handlePdf} />
        </div>

        <div className="ai-input-box">
          <div className="ai-input-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Job Description
          </div>
          <div className="url-row">
            <input
              className="url-input"
              placeholder="Paste job URL to auto-extract..."
              value={jobUrl}
              onChange={e => setJobUrl(e.target.value)}
            />
            <button className="fetch-btn" onClick={handleFetch} disabled={jobLoading}>
              {jobLoading ? "..." : "Fetch"}
            </button>
          </div>
          {fetchMsg && (
            <div className="fetch-msg" style={{color: fetchMsg.startsWith("Extracted") ? "#059669" : "#dc2626"}}>
              {fetchMsg}
            </div>
          )}
          <textarea
            className="jd-textarea"
            placeholder="Or paste the job description text directly here..."
            value={jdText}
            onChange={e => setJdText(e.target.value)}
          />
        </div>
      </div>

      <div className="analyze-row">
        <button className="primary" onClick={analyze} disabled={loading}>
          {loading ? (
            "Analyzing..."
          ) : (
            <>
              <svg style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2,marginRight:6,verticalAlign:'middle'}} viewBox="0 0 24 24">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              Analyze Match
            </>
          )}
        </button>
        {result && (
          <span style={{fontSize:"0.8rem", color:"var(--text-muted)", display:"inline-flex", alignItems:"center", gap:4}}>
            <svg style={{width:12,height:12,stroke:'#059669',fill:'none',strokeWidth:2}} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
            Analysis complete
          </span>
        )}
      </div>

      {result && (
        <div className="ai-result">
          <div className="result-label">Analysis Results</div>
          <div className="score-section">
            <div className="score-ring" style={{"--pct": displayScore}}>
              <span className="score-ring-num">{displayScore}</span>
            </div>
            <div className="score-info">
              <h3 style={{color: info.color}}>{info.label}</h3>
              <p>Your profile matches <strong>{displayScore}%</strong> of this job's requirements.</p>
            </div>
          </div>

          <div className="result-grid">
            <div className="result-card">
              <h4>Strong Matches</h4>
              <div className="tag-wrap">
                {result.strongMatches?.map((s, i) => <span key={s} className="tag match" style={{animationDelay: `${i * 60}ms`}}>{s}</span>)}
              </div>
            </div>
            <div className="result-card">
              <h4>Missing Skills</h4>
              <div className="tag-wrap">
                {result.missingSkills?.map((s, i) => <span key={s} className="tag missing" style={{animationDelay: `${i * 60}ms`}}>{s}</span>)}
              </div>
            </div>
            <div className="result-card full">
              <h4>Suggestions</h4>
              <ul className="suggest-list">
                {result.suggestions?.map(s => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div className="result-card full">
              <h4>Summary</h4>
              <p className="summary-text">{result.summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}