export const fetchApi = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const opts = { ...options, headers };
  const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, opts);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }
  return res.json();
};

export const logout = () => {
  localStorage.removeItem("token");
};

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token;
}