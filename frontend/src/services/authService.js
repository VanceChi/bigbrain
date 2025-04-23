import { apiCall } from '../utils/api';

export async function loginUser(email, password) {
  console.log("loginUser")
  const data = { email, password };
  const res = await apiCall('/admin/auth/login', 'POST', data);
  return res;
};

export async function logoutUser() {
  console.log('logouUser start.')
  try {
    await apiCall('/admin/auth/logout', 'POST');
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Logout failed:', error.message);
    localStorage.clear();
    throw error;
  }
};