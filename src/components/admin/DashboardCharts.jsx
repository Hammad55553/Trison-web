import React, { useMemo } from 'react';
import { TrendingUp, PieChart as PieIcon, Globe2, Layers, Activity } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import './DashboardCharts.css';

/* ── Data helpers ─────────────────────────────── */
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function lastSixMonths() {
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABELS[d.getMonth()] });
  }
  return buckets;
}

function bucketByMonth(items, dateField) {
  const map = {};
  items.forEach((it) => {
    const raw = it[dateField];
    if (!raw) return;
    const d = new Date(raw);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    map[key] = (map[key] || 0) + 1;
  });
  return map;
}

function countBy(items, keyFn) {
  const map = {};
  items.forEach((it) => {
    const k = keyFn(it) || 'Unknown';
    map[k] = (map[k] || 0) + 1;
  });
  return map;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="recharts-custom-tooltip">
        <p className="label">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="intro" style={{ color: entry.color || entry.payload.fill }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ── Main dashboard charts ────────────────────── */
const DashboardCharts = ({ serials, inquiries }) => {
  const panels = useMemo(() => Object.values(serials || {}), [serials]);
  const leads = inquiries || [];

  const months = useMemo(() => lastSixMonths(), []);
  const areaData = useMemo(() => {
    const pBuckets = bucketByMonth(panels, 'registeredAt');
    const lBuckets = bucketByMonth(leads, 'submittedAt');
    return months.map((m) => ({
      name: m.label,
      Panels: pBuckets[m.key] || 0,
      Leads: lBuckets[m.key] || 0,
    }));
  }, [panels, leads, months]);

  const classSegments = useMemo(() => {
    const c = countBy(panels, (p) => (p.class === 'B' ? 'Class B' : 'Class A'));
    return [
      { name: 'Class A', value: c['Class A'] || 0, color: '#1a1a5e' },
      { name: 'Class B', value: c['Class B'] || 0, color: '#f97316' },
    ];
  }, [panels]);

  const statusSegments = useMemo(() => {
    const active = panels.filter((p) => (p.status || 'active') === 'active').length;
    const inactive = panels.length - active;
    return [
      { name: 'Active', value: active, color: '#10b981' },
      { name: 'Inactive', value: inactive, color: '#ef4444' },
    ];
  }, [panels]);

  const countryRows = useMemo(() => {
    const c = countBy(panels, (p) => p.country);
    return Object.entries(c)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [panels]);

  const techRows = useMemo(() => {
    const c = countBy(panels, (p) => (p.technology || 'Unknown').replace(/ Mono PERC| HPDC| TOPCon/g, (m) => m));
    return Object.entries(c)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [panels]);

  return (
    <div className="dash-charts">
      {/* Trend area chart — full width */}
      <div className="chart-card chart-card-wide shimmer-card">
        <div className="chart-head">
          <div className="chart-head-title">
            <TrendingUp size={18} />
            <h3>Registrations &amp; Leads — Last 6 Months</h3>
          </div>
          <div className="chart-legend-inline">
            <span><i className="dot-navy" /> Panels</span>
            <span><i className="dot-orange" /> Leads</span>
          </div>
        </div>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPanels" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a1a5e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1a1a5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Panels" stroke="#1a1a5e" strokeWidth={3} fillOpacity={1} fill="url(#colorPanels)" activeDot={{ r: 6, strokeWidth: 0, fill: '#1a1a5e' }} />
              <Area type="monotone" dataKey="Leads" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid of four analytics cards */}
      <div className="chart-card shimmer-card">
        <div className="chart-head">
          <div className="chart-head-title"><PieIcon size={18} /><h3>Panel Grade Split</h3></div>
        </div>
        <div className="recharts-pie-container">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={classSegments}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {classSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center-text">
            <span>{classSegments.reduce((a, b) => a + b.value, 0)}</span>
            <small>TOTAL</small>
          </div>
        </div>
        <div className="donut-legend-row">
          {classSegments.map((seg, i) => (
            <div key={i} className="donut-legend-item">
              <span className="legend-dot" style={{ background: seg.color }} />
              <span className="legend-label">{seg.name}</span>
              <span className="legend-value">{seg.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card shimmer-card">
        <div className="chart-head">
          <div className="chart-head-title"><Activity size={18} /><h3>Module Status</h3></div>
        </div>
        <div className="recharts-pie-container">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusSegments}
                cx="50%"
                cy="50%"
                outerRadius={85}
                dataKey="value"
                stroke="#fff"
                strokeWidth={3}
              >
                {statusSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="donut-legend-row">
          {statusSegments.map((seg, i) => (
            <div key={i} className="donut-legend-item">
              <span className="legend-dot" style={{ background: seg.color }} />
              <span className="legend-label">{seg.name}</span>
              <span className="legend-value">{seg.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card shimmer-card">
        <div className="chart-head">
          <div className="chart-head-title"><Globe2 size={18} /><h3>Top Destination Markets</h3></div>
        </div>
        <div style={{ width: '100%', height: 240, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryRows} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} width={80} />
              <Tooltip cursor={{ fill: 'rgba(26,26,94,0.04)' }} content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                {countryRows.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="url(#gradBlue)" />
                ))}
              </Bar>
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1a1a5e" />
                  <stop offset="100%" stopColor="#3b3b9a" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card shimmer-card">
        <div className="chart-head">
          <div className="chart-head-title"><Layers size={18} /><h3>Cell Technology Mix</h3></div>
        </div>
        <div style={{ width: '100%', height: 240, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={techRows} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} width={80} />
              <Tooltip cursor={{ fill: 'rgba(249,115,22,0.04)' }} content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                {techRows.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="url(#gradOrange)" />
                ))}
              </Bar>
              <defs>
                <linearGradient id="gradOrange" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fca5a5" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
