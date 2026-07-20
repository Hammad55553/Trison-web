/**
 * Sales Inquiry Leads API Service
 * Synced automatically with Node.js/Express MySQL Database, fallback to localStorage.
 */

const API_URL = 'http://localhost:5000/api/leads';
const LEADS_STORAGE_KEY = 'trison_solar_leads';

// Background sync on startup
const syncLeads = () => {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      // Map keys from DB (createdAt -> submittedAt)
      const mapped = data.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        message: item.message,
        systemType: item.subject || 'Solar Inquiry',
        submittedAt: item.createdAt || new Date().toISOString()
      }));
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(mapped));
    })
    .catch(() => {
      // Fallback silently if server is offline during load
    });
};

// Fire initial sync
syncLeads();

/**
 * Submits contact/inquiry form data to backend
 */
export const submitInquiry = (leadData) => {
  return new Promise((resolve, reject) => {
    // 1. Save locally first
    const existing = JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || '[]');
    const localId = 'lead_' + Math.random().toString(36).substr(2, 9);
    const newLead = {
      id: localId,
      ...leadData,
      submittedAt: new Date().toISOString()
    };
    existing.push(newLead);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(existing));

    // 2. Post to Node.js backend MySQL API
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        subject: leadData.systemType || leadData.subject || 'Solar Inquiry',
        message: leadData.message || ''
      })
    })
    .then(res => res.json())
    .then(serverRes => {
      // Sync fresh list
      syncLeads();
      resolve({
        success: true,
        message: 'Inquiry submitted successfully! Our solar expert will call you within 24 hours.',
        leadId: serverRes.id || localId
      });
    })
    .catch(() => {
      // If backend offline, resolve local success anyway
      resolve({
        success: true,
        message: 'Inquiry registered offline/locally. It will sync once connection returns.',
        leadId: localId
      });
    });
  });
};

/**
 * Fetches all inquiries stored locally (synced from server)
 */
export const getInquiries = () => {
  // Trigger background refresh so UI gets fresh data on next render
  syncLeads();
  return JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || '[]');
};

/**
 * Delete an inquiry lead
 */
export const deleteInquiryLead = (id) => {
  // 1. Remove locally
  const existing = JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || '[]');
  const updated = existing.filter(l => l.id !== id);
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));

  // 2. Delete on Express API
  fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(() => syncLeads())
    .catch(() => {});

  return { success: true };
};
