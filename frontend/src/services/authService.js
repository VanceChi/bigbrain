import { apiCall } from '../utils/api';

export async function loginUser(email, password) {
  console.log("loginUser")
  const data = { email, password };
  const res = await apiCall('/admin/auth/login', 'POST', data);
  return res;
};

export async function logoutUser() {
  console.log('Log out user.')
  try {
    await apiCall('/admin/auth/logout', 'POST');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    return true;
  } catch (error) {
    console.error('Logout failed:', error.message);
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    throw error;
  }
};