import React, { useMemo } from 'react';
import { Database, ClipboardList, ShieldCheck, Activity, ArrowUpRight } from 'lucide-react';

const AdminStats = ({ serials = {}, inquiries = [] }) => {
  const panels = useMemo(() => Object.values(serials), [serials]);

  const serialCount = panels.length;
  const inquiryCount = inquiries.length;
  const activeCount = panels.filter((p) => (p.status || 'active') === 'active').length;
  const classA = panels.filter((p) => (p.class || 'A') === 'A').length;
  const classARatio = serialCount ? Math.round((classA / serialCount) * 100) : 100;

  const cards = [
    {
      icon: Database,
      value: serialCount,
      label: 'Registered Serial Keys',
      chip: `${activeCount} active`,
      tone: 'navy',
    },
    {
      icon: ClipboardList,
      value: inquiryCount,
      label: 'Partner Inquiry Leads',
      chip: 'Sales pipeline',
      tone: 'orange',
    },
    {
      icon: Activity,
      value: `${classARatio}%`,
      label: 'Class-A Premium Ratio',
      chip: `${classA}/${serialCount || 0} panels`,
      tone: 'green',
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'Database Integrity',
      chip: 'Synced',
      tone: 'blue',
    },
  ];

  return (
    <div className="admin-stats-grid">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div className={`admin-stat-card tone-${c.tone}`} key={i}>
            <div className="stat-icon"><Icon size={22} /></div>
            <div className="stat-info">
              <p>{c.label}</p>
              <h3>{c.value}</h3>
              <span className="stat-chip"><ArrowUpRight size={12} /> {c.chip}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;
