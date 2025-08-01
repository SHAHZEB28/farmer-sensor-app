// frontend/src/Services/api.js
import axios from 'axios';

// Always use process.env here so Jest never sees import.meta
const baseURL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({ baseURL });

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default {
  getAnalytics(fieldId, sensorType, start, end) {
    const params = new URLSearchParams();
    if (fieldId)    params.append('field_id',   fieldId);
    if (sensorType) params.append('sensor_type', sensorType);
    if (start)      params.append('start',        start.toISOString());
    if (end)        params.append('end',          end.toISOString());
    return apiClient.get(`/api/v1/analytics?${params.toString()}`);
  },

  createSensorReading(readingData) {
    return apiClient.post('/api/v1/sensors', readingData, {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  createBulkReadings(formData) {
    return apiClient.post('/api/v1/sensors/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getChartData(fieldId, hours) {
    return apiClient.get(`/api/v1/readings/chart?field_id=${fieldId}&hours=${hours}`);
  },

  getTaskStatus(taskId) {
    return apiClient.get(`/api/v1/tasks/${taskId}`);
  },

  // Generic wrappers
  post(url, data) {
    return apiClient.post(url, data);
  },

  get(url, config) {
    return apiClient.get(url, config);
  },
};
