export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('adminToken');
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  
  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('adminToken');
    // We only redirect if we are inside the admin area, otherwise public pages might break
    if (window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin';
    }
  }
  
  return response;
};
