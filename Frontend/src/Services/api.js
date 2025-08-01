// frontend/src/Services/api.js
import axios from 'axios';

// Use the environment variable for the base URL
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: baseURL,
});

// ... (the rest of the file remains the same)
export default {
  getAnalytics(fieldId, sensorType, start, end) {
    const params = new URLSearchParams();
    if (fieldId) params.append('field_id', fieldId);
    if (sensorType) params.append('sensor_type', sensorType);
    if (start) params.append('start', start.toISOString());
    if (end) params.append('end', end.toISOString());
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
};

