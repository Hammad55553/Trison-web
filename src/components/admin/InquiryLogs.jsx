import React from 'react';
import { Trash2, ClipboardList } from 'lucide-react';
import { getInquiries, deleteInquiryLead } from '../../services/leadService';

const InquiryLogs = ({ inquiries, onInquiriesUpdate }) => {
  const handleDeleteInquiry = (id) => {
    if (window.confirm('Delete this partner inquiry submission?')) {
      deleteInquiryLead(id);
      // Wait slightly for background sync then update parent state
      setTimeout(() => {
        onInquiriesUpdate(getInquiries());
      }, 50);
    }
  };

  return (
    <div className="admin-panel-box">
      <h2>Global Sales Inquiries Logs</h2>
      <p className="box-desc">
        Verify submitted dealer, contractor, and distributor leads generated from the partner contact forms.
      </p>

      <div className="leads-list-wrapper">
        {inquiries.length === 0 ? (
          <div className="empty-leads-box">
            <ClipboardList size={32} />
            <p>No sales inquiry leads found in database.</p>
          </div>
        ) : (
          <div className="leads-cards-container">
            {inquiries.map((lead) => (
              <div className="lead-log-card" key={lead.id}>
                <div className="lead-log-header">
                  <h4>{lead.name}</h4>
                  <button onClick={() => handleDeleteInquiry(lead.id)} className="btn-delete-lead">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="lead-log-body">
                  <p><strong>Email:</strong> {lead.email}</p>
                  <p><strong>Phone:</strong> {lead.phone}</p>
                  <p><strong>Bill / Cap Required:</strong> {lead.bill || 'N/A'}</p>
                  <p>
                    <strong>System Configuration:</strong>{' '}
                    <span className="lead-badge">{lead.systemType}</span>
                  </p>
                  {lead.message && (
                    <div className="lead-msg-box">
                      <strong>Message:</strong>
                      <p>{lead.message}</p>
                    </div>
                  )}
                </div>
                <div className="lead-log-footer">
                  <span>Submitted: {new Date(lead.submittedAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryLogs;
