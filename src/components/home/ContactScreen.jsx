import React, { useState } from 'react';
import Card from '../common/Card';
import { submitInquiry } from '../../services/leadService';
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import './ContactScreen.css';

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bill: '',
    systemType: 'on-grid',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' }); // type: 'success' | 'error' | ''

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await submitInquiry(formData);
      setStatus({
        type: 'success',
        message: response.message,
      });
      // reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        bill: '',
        systemType: 'on-grid',
        message: '',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Submission failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="section-header text-center" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 className="section-title">
          Partner with <span className="shimmer-text">Trison</span>
        </h2>
        <p className="section-subtitle">
          Contact our global sales and distribution department. We supply premium solar cell plates and modules to developers, EPC contractors, and authorized dealerships worldwide.
        </p>
      </div>

      <div className="contact-grid">
        {/* Contact info column */}
        <div className="contact-info">
          <Card className="info-glass-card" interactive={false}>
            <h3>Global Sales Headquarters</h3>
            <p className="contact-intro">Coordinate with our manufacturing sales team for bulk volume silicon module distribution and partner dealership options.</p>

            <div className="info-list">
              <div className="info-list-item">
                <MapPin className="info-list-icon" />
                <div>
                  <h4>Global Sales Headquarters — China</h4>
                  <p>Building 12, Solar Industry Park, Haining, Zhejiang, China</p>
                </div>
              </div>

              <div className="info-list-item">
                <MapPin className="info-list-icon" />
                <div>
                  <h4>Pakistan — Authorized Dealers</h4>
                  <p>Authorized dealers and distributors are available across Pakistan. Contact regional sales for locations.</p>
                </div>
              </div>

              <div className="info-list-item">
                <Phone className="info-list-icon icon-orange" />
                <div>
                  <h4>Phone Numbers (Regional)</h4>
                  <p>China: +86 138 0013 8800</p>
                  <p>UAE: +971 50 1234567</p>
                  {/* <p>Pakistan: +92 300 0871150</p> */}
                </div>
              </div>

              <div className="info-list-item">
                <Mail className="info-list-icon icon-green" />
                <div>
                  <h4>Official Email</h4>
                  <p>info@trisonsolar.com</p>
                  <p>sales@trisonsolar.com</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form Column */}
        <Card className="form-card" glow={true} interactive={false}>
          <form onSubmit={handleSubmit} className="inquiry-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Full Name *</label>
                <input 
                  id="contact-name"
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="e.g. 王强 (Wang Qiang)" 
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email Address *</label>
                <input 
                  id="contact-email"
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="e.g. wang@domain.com" 
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-phone">Phone Number *</label>
                <input 
                  id="contact-phone"
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="e.g. +86 138 0013 8000" 
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-bill">Target Sizing Capacity (kW)</label>
                <input 
                  id="contact-bill"
                  type="number" 
                  name="bill" 
                  value={formData.bill} 
                  onChange={handleChange} 
                  placeholder="e.g. 50" 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contact-system">Requested Module Technology</label>
              <select 
                id="contact-system"
                name="systemType" 
                value={formData.systemType} 
                onChange={handleChange}
              >
                <option value="on-grid">Utility Bifacial Double Glass Plates</option>
                <option value="hybrid">Residential Obsidian Back-Contact Cell Modules</option>
                <option value="off-grid">N-Type TOPCon Cell Components</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Volume Requirements & Details</label>
              <textarea 
                id="contact-message"
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                rows="4" 
                placeholder="Specify volume requirements (in MW/kW), shipment destination, or customized manufacturing options..."
              ></textarea>
            </div>

            {status.message && (
              <div className={`status-banner banner-${status.type}`}>
                {status.type === 'success' ? (
                  <CheckCircle2 className="status-banner-icon" />
                ) : (
                  <AlertCircle className="status-banner-icon" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <button type="submit" className="btn-primary btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="spinner" size={18} /> Processing...
                </>
              ) : (
                <>
                  Send Inquiry <Send size={16} />
                </>
              )}
            </button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default ContactScreen;
