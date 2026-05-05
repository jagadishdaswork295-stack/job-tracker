import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/applications";

export default function AddApplication({ onAdded }) {
  const [form, setForm] = useState({
    companyName: "", jobRole: "", status: "APPLIED",
    appliedDate: "", deadline: "", notes: "",
  });

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.companyName || !form.jobRole || !form.appliedDate) {
      alert("Please fill Company, Role and Applied Date");
      return;
    }
    await axios.post(API, form);
    onAdded();
  };

  return (
    <div className="panel">
      <div className="form-section">
        <h2>Add New Application</h2>
        <p>Track a new job you've applied to or are planning to apply.</p>
        <div className="form-grid">
          <div>
            <label>Company Name *</label>
            <input name="companyName" placeholder="e.g. Google" onChange={handle} />
          </div>
          <div>
            <label>Job Role *</label>
            <input name="jobRole" placeholder="e.g. Backend Developer" onChange={handle} />
          </div>
          <div>
            <label>Applied Date *</label>
            <input name="appliedDate" type="date" onChange={handle} />
          </div>
          <div>
            <label>Application Deadline</label>
            <input name="deadline" type="date" onChange={handle} />
          </div>
        </div>
        <label>Status</label>
        <select name="status" onChange={handle} style={{maxWidth: 200}}>
          <option>APPLIED</option>
          <option>INTERVIEW</option>
          <option>OFFER</option>
          <option>REJECTED</option>
        </select>
        <label>Notes</label>
        <textarea name="notes" placeholder="Any notes about this role, recruiter contact, next steps..." onChange={handle} />
        <button className="primary" onClick={submit}>
          <svg style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2,marginRight:6,verticalAlign:'middle'}} viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7"/>
          </svg>
          Save Application
          <svg style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2,marginLeft:6,verticalAlign:'middle'}} viewBox="0 0 24 24">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </button>
      </div>
    </div>
  );
}