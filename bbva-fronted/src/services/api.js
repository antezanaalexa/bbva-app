import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000"
})

// Request interceptor to automatically add JWT token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("bbva_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (err) {
        console.error("Error parsing user token from localStorage:", err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api