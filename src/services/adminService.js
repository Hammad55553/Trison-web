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

  // Set the current logged in user to sessionStorage
  sessionStorage.setItem('trison_admin_auth', 'true');
  sessionStorage.setItem('trison_admin_user', username);
  sessionStorage.setItem('trison_admin_role', admin.role);

  return { success: true, user: admin };
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
