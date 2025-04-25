import axios from 'axios';
import config from '../../backend.config.json'; // Import the config file

const BACKEND_URL = `http://localhost:${config.BACKEND_PORT}`; // Use BACKEND_PORT
const CONTENT_TYPE = "application/json";

/**
 * Sends an HTTP request to the backend with standardized headers and optional JSON data.
 * 
 * This function builds the full URL by concatenating BACKEND_URL with the specified path, 
 * sets the HTTP method, and prepares the request headers:
 *  - Always sets the 'Accept' header to the value of CONTENT_TYPE (typically "application/json").
 *  - If data is provided, sets the 'Content-Type' header to CONTENT_TYPE.
 *  - If an authorization token is stored in localStorage (under "token"), it includes 
 *    an 'Authorization' header with a Bearer token.
 * 
 * @param {string} path - The API endpoint path (e.g., '/job/feed', '/auth/login').
 * @param {string} method - The HTTP method to use (e.g., 'GET', 'POST').
 * @param {Object} [data=null] - Optional data to send in the request body (will be JSON-stringified)
 * @returns {Promise<Object>} A promise that resolves with the parsed JSON response.
 */
export async function apiCall(path, method, data = null) {
  const url = BACKEND_URL + path;

  const headers = { 'Accept': CONTENT_TYPE };
  if (data) headers['Content-Type'] = CONTENT_TYPE;

  const token = JSON.parse(localStorage.getItem('token'));
  if (token) headers['Authorization'] = 'Bearer ' + token;

  try {
    const response = await axios({
      url,
      method: method.toUpperCase(),
      headers,
      data,
    });
    const x = {
      url,
      method: method.toUpperCase(),
      headers,
      data,
    };

    const responseBody = response.data;
    if (responseBody.error) {
      throw new Error(responseBody.error);
    }
    return responseBody;
  } catch (error) {
    // alert('Failed! ' + (error.response?.data?.error || ''));

    throw new Error(error.response?.data?.error || error.message || 'API request failed');
  }
}