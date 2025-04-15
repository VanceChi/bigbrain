const BACKEND_URL = "http://localhost:5005";
const FileType = "application/json";
/**
 * Sends an HTTP request to the backend with standardized headers and optional JSON data.
 * 
 * This function builds the full URL by concatenating BACKEND_URL with the specified path, 
 * sets the HTTP method, and prepares the request headers:
 *  - Always sets the 'Accept' header to the value of FileType (typically "application/json").
 *  - If data is provided, sets the 'Content-Type' header to FileType.
 *  - If an authorization token is stored in localStorage (under "authData"), it includes 
 *    an 'Authorization' header with a Bearer token.
 * 
 * @param {string} path - The API endpoint path (e.g., '/job/feed', '/auth/login').
 * @param {string} method - The HTTP method to use (e.g., 'GET', 'POST').
 * @param {Object} [data=null] - Optional data to send in the request body (will be JSON-stringified>
 * @returns {Promise<Object>} A promise that resolves with the parsed JSON response.
 */
export function apiCall(path, method, data = null){
  // url for fetch first arg
  const url = BACKEND_URL + path;

  const headers = { 'Accept': FileType };
  if (data) headers['Content-Type'] = FileType;

  const authData = JSON.parse(localStorage.getItem('authData'));
  if (authData) headers['Authorization'] = 'Bearer ' + authData.token

  const fetchOptions = {
      method: method.toUpperCase(),
      headers
  };
  if (data) fetchOptions.body = JSON.stringify(data);

  return fetch(url, fetchOptions).then(response => response.json());
}