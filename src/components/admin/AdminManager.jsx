import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, ShieldAlert, Trash2, Edit2, X, CheckCircle, ToggleLeft, ToggleRight, Save, Eye, EyeOff } from 'lucide-react';
import { getAllAdmins, addAdmin, updateAdmin, deleteAdmin } from '../../services/adminService';

const BLANK_ADMIN = { username: '', password: '', status: 'active' };

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...BLANK_ADMIN });
  const [toast, setToast] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const reload = () => setAdmins(getAllAdmins());
  
  useEffect(() => { reload(); }, []);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      flash('Username and password are required.');
      return;
    }

    try {
      if (editing) {
        updateAdmin(editing, form);
        flash(`Admin '${editing}' updated successfully.`);
      } else {
        addAdmin(form);
        flash(`Admin '${form.username}' created successfully.`);
      }
      setShowForm(false);
      reload();
    } catch (err) {
      flash(err.message);
    }
  };

  const openAdd = () => {
    setForm({ ...BLANK_ADMIN });
    setEditing(null);
    setShowForm(true);
    setShowPassword(false);
  };

  const openEdit = (admin) => {
    setForm({ ...admin });
    setEditing(admin.username);
    setShowForm(true);
    setShowPassword(false);
  };

  const handleDelete = (username) => {
    if (window.confirm(`Are you sure you want to delete admin '${username}'?`)) {
      try {
        deleteAdmin(username);
        flash(`Admin '${username}' deleted.`);
        reload();
      } catch (err) {
        flash(err.message);
      }
    }
  };

  const handleToggleStatus = (admin) => {
    try {
      const newStatus = admin.status === 'active' ? 'blocked' : 'active';
      updateAdmin(admin.username, { status: newStatus });
      reload();
    } catch (err) {
      flash(err.message);
    }
  };

  return (
    <div className="pm-root">
      {/* ── Toolbar ── */}
      <div className="pm-topbar" style={{ marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Admin Users</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>
            Manage dashboard access, add new administrators, and configure passwords.
          </p>
        </div>
        <button className="pm-btn-add" onClick={openAdd}>
          <UserPlus size={16} /> Add Admin
        </button>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="pm-toast">
          <CheckCircle size={15} /> {toast}
        </div>
      )}

      {/* ── Data Table ── */}
      <div className="pm-table-wrap">
        <table className="pm-tbl">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.username} className="pm-row">
                <td data-label="Username">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 16, background: a.role === 'master' ? '#f8fafc' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {a.role === 'master' ? <ShieldAlert size={16} color="#ef4444" /> : <Shield size={16} color="#64748b" />}
                    </div>
                    {a.username}
                  </div>
                </td>
                <td data-label="Role">
                  <span className={`pm-badge ${a.role === 'master' ? 'watt' : 'class-badge class-b'}`}>
                    {a.role.toUpperCase()}
                  </span>
                </td>
                <td data-label="Status">
                  <button
                    className={`pm-status-toggle ${a.status === 'active' ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(a)}
                    disabled={a.role === 'master'}
                    title={a.role === 'master' ? "Master admin cannot be blocked" : "Click to toggle status"}
                    style={{ opacity: a.role === 'master' ? 0.6 : 1, cursor: a.role === 'master' ? 'not-allowed' : 'pointer' }}
                  >
                    {a.status === 'active'
                      ? <><ToggleRight size={16} /> Active</>
                      : <><ToggleLeft size={16} /> Blocked</>
                    }
                  </button>
                </td>
                <td data-label="Actions">
                  <div className="pm-actions">
                    <button className="pm-btn-edit" onClick={() => openEdit(a)} title="Edit Password"><Edit2 size={13} /></button>
                    {a.role !== 'master' && (
                      <button className="pm-btn-delete" onClick={() => handleDelete(a.username)} title="Delete Admin"><Trash2 size={13} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Add/Edit Modal ── */}
      {showForm && (
        <div className="pm-modal-backdrop">
          <div className="pm-modal">
            <div className="pm-modal-head" style={{ padding: '24px 24px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>{editing ? 'Edit Administrator' : 'Add Administrator'}</h2>
              <button className="pm-btn-close-modal" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 8 }}>Username</label>
                <input
                  type="text"
                  required
                  disabled={editing !== null}
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', background: editing ? '#f8fafc' : '#fff' }}
                  placeholder="e.g. jdoe_admin"
                />
                {editing && <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Username cannot be changed.</p>}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ width: '100%', padding: '12px 40px 12px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                    placeholder="Enter strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!editing && (
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 8 }}>Initial Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', background: '#fff' }}
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              )}

              <button type="submit" className="pm-btn-add" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                <Save size={18} /> {editing ? 'Save Changes' : 'Create Administrator'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManager;
