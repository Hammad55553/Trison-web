// Mock backend for managing administrators

const ADMINS_STORAGE_KEY = 'trison_admins_registry';

const MASTER_ADMIN = {
  username: 'admin',
  role: 'master',
  status: 'active'
};

/**
 * Get all administrators from local storage.
 * Injects the MASTER_ADMIN if it doesn't exist.
 */
const syncAdmins = () => {
  fetch('/api/admins.php')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(data));
      }
    })
    .catch(() => {});
};
syncAdmins();

export const getAllAdmins = () => {
  let admins = [];
  try {
    const data = localStorage.getItem(ADMINS_STORAGE_KEY);
    if (data) {
      admins = JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to parse admins from local storage', err);
  }

  // Ensure master admin is always present
  if (!admins.find(a => a.username === MASTER_ADMIN.username)) {
    admins.unshift(MASTER_ADMIN);
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
  }

  return admins;
};

const LOGIN_HISTORY_KEY = 'trison_admin_login_history';

export const getLoginHistory = () => {
  try {
    const data = localStorage.getItem(LOGIN_HISTORY_KEY);
    if (data) {
      // Filter out entries older than 30 days
      const history = JSON.parse(data);
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const filtered = history.filter(h => new Date(h.timestamp).getTime() > thirtyDaysAgo);
      if (filtered.length !== history.length) {
        localStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(filtered));
      }
      return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  } catch (err) {}
  return [];
};

const extractDeviceName = (ua) => {
  if (!ua) return 'Unknown Device';
  let browser = 'Unknown Browser';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  let os = 'Unknown OS';
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('like Mac')) os = 'iOS';

  return `${browser} on ${os}`;
};

export const recordLoginHistory = async (username) => {
  let ip = 'Unknown IP';
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    if (res.ok) {
      const data = await res.json();
      ip = data.ip;
    }
  } catch (err) {}

  const deviceStr = extractDeviceName(navigator.userAgent);
  const history = getLoginHistory();
  history.push({
    username,
    ip,
    device: deviceStr,
    timestamp: new Date().toISOString()
  });

  localStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(history));
};

/**
 * Authenticate an administrator.
 */
export const loginAdmin = async (username, password) => {
  try {
    const res = await fetch('/api/auth.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    // If backend returns a successful JSON response
    const data = await res.json();
    if (res.ok && data.success) {
      const expiry = Date.now() + 24 * 60 * 60 * 1000;
      const tokenPayload = {
        username,
        role: username === 'admin' ? 'master' : 'admin',
        expiry,
        token: data.token
      };
      localStorage.setItem('trison_admin_auth_token', JSON.stringify(tokenPayload));
      // Backend handles history logging
      return { success: true, user: tokenPayload };
    }
    
    throw new Error(data.error || 'Invalid credentials');
    
  } catch (err) {
    // If fetch failed (offline) or threw error above, fallback is disabled for security reasons
    return { success: false, error: err.message || 'Server is unreachable. Please check your connection.' };
  }
};

export const checkAdminAuth = () => {
  try {
    const tokenStr = localStorage.getItem('trison_admin_auth_token');
    if (tokenStr) {
      const token = JSON.parse(tokenStr);
      if (token.expiry && token.expiry > Date.now()) {
        return { isAuthenticated: true, user: token.username, role: token.role };
      } else {
        localStorage.removeItem('trison_admin_auth_token');
      }
    }
  } catch (e) {}
  return { isAuthenticated: false };
};

export const logoutAdmin = () => {
  localStorage.removeItem('trison_admin_auth_token');
};

/**
 * Add a new administrator.
 */
export const addAdmin = (newAdmin) => {
  const admins = getAllAdmins();
  if (admins.find(a => a.username.toLowerCase() === newAdmin.username.toLowerCase())) {
    throw new Error('An administrator with this username already exists.');
  }

  admins.push({
    ...newAdmin,
    role: 'admin',
    status: newAdmin.status || 'active'
  });

  localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
  fetch('/api/admins.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAdmin)
  }).then(() => syncAdmins()).catch(() => {});
  
  return admins;
};

/**
 * Update an administrator (e.g. change password or status).
 */
export const updateAdmin = (username, updates) => {
  const admins = getAllAdmins();
  const index = admins.findIndex(a => a.username === username);
  
  if (index === -1) throw new Error('Admin not found.');

  if (admins[index].role === 'master' && updates.status === 'blocked') {
    throw new Error('The master administrator cannot be blocked.');
  }

  admins[index] = { ...admins[index], ...updates };
  localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
  fetch('/api/admins.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(admins[index])
  }).then(() => syncAdmins()).catch(() => {});
  
  return admins;
};

/**
 * Delete an administrator.
 */
export const deleteAdmin = (username) => {
  let admins = getAllAdmins();
  const admin = admins.find(a => a.username === username);

  if (!admin) throw new Error('Admin not found.');
  if (admin.role === 'master') {
    throw new Error('The master administrator cannot be deleted.');
  }

  admins = admins.filter(a => a.username !== username);
  localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
  fetch(`/api/admins.php?username=${username}`, { method: 'DELETE' })
    .then(() => syncAdmins()).catch(() => {});
  
  return admins;
};
