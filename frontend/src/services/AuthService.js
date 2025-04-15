import { apiCall } from '../utils/api';

export async function loginUser(email, password) {
  console.log("loginUser")
  const data = { email, password };
  const res = await apiCall('/admin/auth/login', 'POST', data);
  console.log('------res', res)
  return res;
};