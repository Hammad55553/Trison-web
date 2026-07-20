const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Secure HTTP Headers with Helmet
app.use(helmet());

// 2. Configure CORS securely
// Limit origins on production, allow all on local staging
const corsOptions = {
  origin: '*', // Customize this on production, e.g. ['https://trisonsolar.com', 'https://your-vercel-staging.vercel.app']
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Enable JSON parser with max payload size protection (prevent server memory exhaustion)
app.use(express.json({ limit: '10kb' }));

// 3. Rate Limiting Middleware (Prevent DDoS / Spam)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Very relaxed limit for admin operations and general browsing (2000 requests per 15 min)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' }
});

// Apply global limiter to all routes
app.use(globalLimiter);

// Strict limiter for public barcode verification & lead generation (prevent brute force / script spamming)
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 25 verification checks or form submissions per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests/submissions. Please wait 15 minutes before trying again.' }
});

// We will apply strictLimiter inline on public endpoints:
// - POST /api/leads (Public lead submission)
// - GET /api/panels/verify/:serial (Public barcode verification lookup)

// ── Database Connection Pool ─────────────────────────
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trison_db',
  waitForConnections: true,
  connectionLimit: 15, // standard pool limit
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

const promisePool = pool.promise();

// Check database connection status on boot
pool.getConnection((err, connection) => {
  if (err) {
    console.error('⚠️ Warning: Database connection failed. Falling back to secure mock in-memory store. Error:', err.message);
  } else {
    console.log('✅ Connected to Hostinger/Local MySQL Database successfully.');
    connection.release();
  }
});

// ── In-Memory Secure Mock DB (Used if MySQL database is offline or unconfigured) ──
let mockPanels = [
  {
    serial: 'TSCN-2607-731358458',
    brand: 'Trison',
    model: 'TS-Premium-580M',
    wattage: '580W',
    technology: 'Bifacial Mono PERC',
    class: 'A',
    country: 'Pakistan',
    customerName: 'Hammad Aslam',
    warrantyYears: '25',
    status: 'active',
    registeredAt: new Date().toISOString()
  }
];

let mockInquiries = [];

// Helper to check if DB is online
async function isDbConnected() {
  try {
    await promisePool.query('SELECT 1');
    return true;
  } catch (e) {
    return false;
  }
}

// ── Panels Registry Endpoints ────────────────────────

// 1. Get all registered panels
app.get('/api/panels', async (req, res) => {
  const dbActive = await isDbConnected();
  if (!dbActive) {
    return res.json(mockPanels);
  }
  try {
    const [rows] = await promisePool.query('SELECT * FROM panels ORDER BY registered_at DESC LIMIT 500');
    // Map database fields safely
    const mapped = rows.map(r => ({
      serial: r.serial || '',
      brand: r.brand || 'Trison',
      model: r.model || '',
      wattage: r.wattage || '',
      technology: r.technology || '',
      class: r.class || 'A',
      country: r.country || '',
      customerName: r.customer_name || '',
      warrantyYears: r.warranty_years || '25',
      status: r.status || 'active',
      registeredAt: r.registered_at
    }));
    res.json(mapped);
  } catch (error) {
    res.status(550).json({ error: 'Failed to retrieve records securely.' });
  }
});

// 2. Save or edit a panel (with full validation)
app.post('/api/panels', async (req, res) => {
  const { serial, brand, model, wattage, technology, class: cls, country, customerName, warrantyYears, status } = req.body;

  // STRICT VALIDATION
  if (!serial || typeof serial !== 'string' || !serial.trim()) {
    return res.status(400).json({ error: 'Invalid or missing serial barcode parameter.' });
  }
  if (!model || typeof model !== 'string' || !model.trim()) {
    return res.status(400).json({ error: 'Model name field is required.' });
  }
  if (!wattage || typeof wattage !== 'string' || !wattage.trim()) {
    return res.status(400).json({ error: 'Wattage specification is required.' });
  }

  const cleanSerial = serial.trim();
  const cleanModel = model.trim();
  const cleanWatt = wattage.trim();
  const cleanBrand = (brand || 'Trison').trim();
  const cleanTech = (technology || 'Bifacial Mono PERC').trim();
  const cleanClass = (cls || 'A').trim();
  const cleanCountry = (country || 'Pakistan').trim();
  const cleanCustomer = (customerName || '').trim();
  const cleanWarranty = (warrantyYears || '25').trim();
  const cleanStatus = (status || 'active').trim();

  const dbActive = await isDbConnected();
  if (!dbActive) {
    const idx = mockPanels.findIndex(p => p.serial.toLowerCase() === cleanSerial.toLowerCase());
    const savedObj = {
      serial: cleanSerial,
      brand: cleanBrand,
      model: cleanModel,
      wattage: cleanWatt,
      technology: cleanTech,
      class: cleanClass,
      country: cleanCountry,
      customerName: cleanCustomer,
      warrantyYears: cleanWarranty,
      status: cleanStatus,
      registeredAt: new Date().toISOString()
    };
    if (idx !== -1) {
      mockPanels[idx] = savedObj;
    } else {
      mockPanels.push(savedObj);
    }
    return res.json({ message: 'Panel saved/updated successfully (Mock Database)', serial: cleanSerial });
  }

  try {
    const query = `
      INSERT INTO panels (serial, brand, model, wattage, technology, class, country, customer_name, warranty_years, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        brand = VALUES(brand),
        model = VALUES(model),
        wattage = VALUES(wattage),
        technology = VALUES(technology),
        class = VALUES(class),
        country = VALUES(country),
        customer_name = VALUES(customer_name),
        warranty_years = VALUES(warranty_years),
        status = VALUES(status)
    `;
    await promisePool.query(query, [
      cleanSerial,
      cleanBrand,
      cleanModel,
      cleanWatt,
      cleanTech,
      cleanClass,
      cleanCountry,
      cleanCustomer,
      cleanWarranty,
      cleanStatus
    ]);
    res.json({ message: 'Panel record saved successfully.', serial: cleanSerial });
  } catch (error) {
    res.status(500).json({ error: 'Database execution error. Record not saved.' });
  }
});

// 3. Delete a panel
app.delete('/api/panels/:serial', async (req, res) => {
  const { serial } = req.params;
  if (!serial || typeof serial !== 'string' || !serial.trim()) {
    return res.status(400).json({ error: 'Invalid serial key.' });
  }
  const cleanSerial = serial.trim();

  const dbActive = await isDbConnected();
  if (!dbActive) {
    mockPanels = mockPanels.filter(p => p.serial.toLowerCase() !== cleanSerial.toLowerCase());
    return res.json({ message: 'Panel record deleted successfully.' });
  }

  try {
    // Prepared statement safe delete
    await promisePool.query('DELETE FROM panels WHERE serial = ?', [cleanSerial]);
    res.json({ message: 'Panel record deleted successfully.', serial: cleanSerial });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete deletion process.' });
  }
});

// 4. Verify panel serial number (returns verified details or 404)
app.get('/api/panels/verify/:serial', strictLimiter, async (req, res) => {
  const { serial } = req.params;
  if (!serial || typeof serial !== 'string' || !serial.trim()) {
    return res.status(400).json({ error: 'Invalid barcode input.' });
  }
  const cleanSerial = serial.trim();

  const dbActive = await isDbConnected();
  if (!dbActive) {
    const found = mockPanels.find(p => p.serial.toLowerCase() === cleanSerial.toLowerCase());
    if (found) {
      return res.json({ ...found, found: true });
    }
    return res.status(404).json({ error: 'Record not found in local registries.' });
  }

  try {
    const [rows] = await promisePool.query('SELECT * FROM panels WHERE serial = ? LIMIT 1', [cleanSerial]);
    if (rows.length > 0) {
      const r = rows[0];
      return res.json({
        serial: r.serial,
        brand: r.brand,
        model: r.model,
        wattage: r.wattage,
        technology: r.technology,
        class: r.class,
        country: r.country,
        customerName: r.customer_name,
        warrantyYears: r.warranty_years,
        status: r.status,
        registeredAt: r.registered_at,
        found: true
      });
    }
    res.status(404).json({ error: 'Record not found in database.' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed. Try again later.' });
  }
});

// ── Inquiries / Leads Endpoints ──────────────────────

// 1. Get all leads
app.get('/api/leads', async (req, res) => {
  const dbActive = await isDbConnected();
  if (!dbActive) {
    return res.json(mockInquiries);
  }
  try {
    const [rows] = await promisePool.query('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 1000');
    const mapped = rows.map(r => ({
      id: r.id,
      name: r.name || '',
      email: r.email || '',
      phone: r.phone || '',
      subject: r.subject || '',
      message: r.message || '',
      createdAt: r.created_at
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries database.' });
  }
});

// 2. Submit a lead (with strict input sanitization)
app.post('/api/leads', strictLimiter, async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Strict Validation checks
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name field is required.' });
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return res.status(400).json({ error: 'Phone contact number is required.' });
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message content cannot be blank.' });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanPhone = phone.trim();
  const cleanSubject = (subject || 'Solar Inquiry').trim();
  const cleanMessage = message.trim();

  const dbActive = await isDbConnected();
  if (!dbActive) {
    const newLead = {
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage,
      createdAt: new Date().toISOString()
    };
    mockInquiries.push(newLead);
    return res.json({ message: 'Lead recorded securely.', id: newLead.id });
  }

  try {
    const query = 'INSERT INTO inquiries (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)';
    const [result] = await promisePool.query(query, [
      cleanName,
      cleanEmail,
      cleanPhone,
      cleanSubject,
      cleanMessage
    ]);
    res.json({ message: 'Inquiry registered successfully.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Server busy. Submission failed.' });
  }
});

// 3. Delete a lead
app.delete('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  const numId = parseInt(id);
  if (isNaN(numId)) {
    return res.status(400).json({ error: 'Invalid Lead ID format.' });
  }

  const dbActive = await isDbConnected();
  if (!dbActive) {
    mockInquiries = mockInquiries.filter(i => i.id !== numId);
    return res.json({ message: 'Lead entry deleted.' });
  }

  try {
    await promisePool.query('DELETE FROM inquiries WHERE id = ?', [numId]);
    res.json({ message: 'Lead entry deleted successfully.', id: numId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process lead deletion.' });
  }
});

// Global Error Catch Handler (prevents process termination and hides sensitive call stack info)
app.use((err, req, res, next) => {
  console.error('🔥 Unexpected Global Error:', err.message);
  res.status(500).json({ error: 'An unexpected internal security error occurred.' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Secure Trison server is running on http://localhost:${PORT}`);
});
