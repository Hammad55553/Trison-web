/**
 * Mock Backend Lead Generation Service
 * Simulates API requests and stores submissions in LocalStorage for demo purposes.
 */

const LEADS_STORAGE_KEY = 'trison_solar_leads';

/**
 * Submits contact/inquiry form data to the simulated backend
 * @param {object} leadData - Form parameters { name, email, phone, bill, systemType, message }
 * @returns {Promise<object>} response status
 */
export const submitInquiry = (leadData) => {
  return new Promise((resolve, reject) => {
    // Simulate network latency (800ms)
    setTimeout(() => {
      try {
        // Validation check
        if (!leadData.name || !leadData.email || !leadData.phone) {
          throw new Error('Please fill out all required fields (Name, Email, and Phone number).');
        }

        // Get existing leads from localstorage
        const existingLeads = JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || '[]');
        
        const newLead = {
          id: 'lead_' + Math.random().toString(36).substr(2, 9),
          ...leadData,
          submittedAt: new Date().toISOString(),
        };

        // Add to array and save
        existingLeads.push(newLead);
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(existingLeads));

        resolve({
          success: true,
          message: 'Inquiry submitted successfully! Our solar expert will call you within 24 hours.',
          leadId: newLead.id
        });
      } catch (error) {
        reject({
          success: false,
          message: error.message || 'Something went wrong while submitting the form. Please try again.'
        });
      }
    }, 800);
  });
};

/**
 * Fetches all inquiries stored in local storage (useful for admin panel/simulated dashboard)
 * @returns {Array} array of submitted leads
 */
export const getInquiries = () => {
  return JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || '[]');
};
