// Mock backend for managing administrators

const ADMINS_STORAGE_KEY = 'trison_admins_registry';

// Default system administrator (master)
const MASTER_ADMIN = {
  username: 'admin',
  password: 'trison',
  role: 'master',
  status: 'active'
};

/**
 * Get all administrators from local storage.
 * Injects the MASTER_ADMIN if it doesn't exist.
 */
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
export const loginAdmin = (username, password) => {
  const admins = getAllAdmins();
  const admin = admins.find(a => a.username === username && a.password === password);
  
  if (!admin) {
    return { success: false, error: 'Invalid username or password.' };
  }
  if (admin.status === 'blocked') {
    return { success: false, error: 'This account has been blocked.' };
  }

  // Set persistent login token for 24 hours
  const expiry = Date.now() + 24 * 60 * 60 * 1000;
  const tokenPayload = {
    username,
    role: admin.role,
    expiry
  };
  localStorage.setItem('trison_admin_auth_token', JSON.stringify(tokenPayload));

  // Record history asynchronously
  recordLoginHistory(username);

  return { success: true, user: admin };
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
  
  return admins;
};
