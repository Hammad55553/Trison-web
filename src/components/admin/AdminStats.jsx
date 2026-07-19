import React from 'react';
import { Database, ClipboardList, ShieldCheck } from 'lucide-react';

const AdminStats = ({ serialCount, inquiryCount }) => {
  return (
    <div className="admin-stats-grid">
      <div className="admin-stat-card">
        <Database size={24} className="stat-icon" />
        <div className="stat-info">
          <h3>{serialCount}</h3>
          <p>Registered Serial Keys</p>
        </div>
      </div>
      <div className="admin-stat-card">
        <ClipboardList size={24} className="stat-icon" />
        <div className="stat-info">
          <h3>{inquiryCount}</h3>
          <p>Partner Inquiry Leads</p>
        </div>
      </div>
      <div className="admin-stat-card">
        <ShieldCheck size={24} className="stat-icon" />
        <div className="stat-info">
          <h3>100%</h3>
          <p>Database Health</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
