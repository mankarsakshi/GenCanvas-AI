/**
 * API Utility for Authenticated HTTP Requests
 * Automatically injects verified Bearer JWT tokens from localStorage.
 */

export const getAuthToken = () => {
  return localStorage.getItem("token") || "";
};

export const authHeaders = (customHeaders = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const apiFetch = async (url, options = {}) => {
  const headers = authHeaders(options.headers);
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle unauthorized gracefully
  if (response.status === 401) {
    console.warn("Session expired or unauthorized request to:", url);
  }

  return response;
};
