import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token & Dev Debug Logger
apiClient.interceptors.request.use(
  (config) => {
    // Attach JWT token automatically
    const token = localStorage.getItem('voyager_jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach request timestamp for duration measurement in Dev mode
    (config as any)._requestStartTime = Date.now();

    if (import.meta.env.DEV) {
      console.log(`➡ ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Dev Logger & 401 Unauthorized Handler
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      const startTime = (response.config as any)._requestStartTime;
      const duration = startTime ? `${Date.now() - startTime}ms` : '';
      console.log(`⬅ ${response.status} ${response.statusText} ${duration ? `(${duration})` : ''} - ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : 'Network/Offline Error';
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
    const url = error.config?.url || 'UNKNOWN';
    const message = error.response?.data?.message || error.message || 'API request failed';

    if (import.meta.env.DEV) {
      console.error(`❌ API Failure:
  Method: ${method}
  URL: ${url}
  Status Code: ${status}
  Error Message: ${typeof message === 'object' ? JSON.stringify(message) : message}`);
    }

    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request (401), clearing session tokens');
      localStorage.removeItem('voyager_jwt_token');
      localStorage.removeItem('voyager_user_info');
    }

    return Promise.reject(error);
  }
);
