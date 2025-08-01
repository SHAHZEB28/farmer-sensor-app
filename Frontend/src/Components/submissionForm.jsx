// frontend/src/Components/submissionForm.jsx

import React, { useState } from 'react';
import api from '../Services/api';

const SubmissionForm = ({ onNewData }) => {
  const [formData, setFormData] = useState({
    field_id: '1',
    sensor_type: 'temperature',
    value: '',
    unit: '°C',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const payload = { ...formData, value: parseFloat(formData.value) };
      await api.createSensorReading(payload);
      setMessage('Reading submitted successfully!');
      if (onNewData) onNewData();
      setFormData(prev => ({ ...prev, value: '' }));
    } catch (error) {
      setMessage('Error submitting reading.');
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4 text-neutral-700">Submit a Reading</h2>
      <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form Inputs */}
          <div>
            <label htmlFor="field_id" className="block text-sm font-medium text-neutral-600">Field ID</label>
            <input type="number" name="field_id" value={formData.field_id} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
          </div>
          <div>
            <label htmlFor="sensor_type" className="block text-sm font-medium text-neutral-600">Sensor Type</label>
            <select name="sensor_type" value={formData.sensor_type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
              <option value="temperature">Temperature</option>
              <option value="soil_moisture">Soil Moisture</option>
            </select>
          </div>
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-neutral-600">Value</label>
            <input type="number" step="0.1" name="value" value={formData.value} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
          </div>
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-neutral-600">Unit</label>
            <input type="text" name="unit" value={formData.unit} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
          </div>
        </div>
        <div className="mt-6">
          {/* Reverted to a standard button */}
          <button type="submit" className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
            Submit
          </button>
        </div>
      </form>
      {message && <p className="mt-4 text-sm text-center text-neutral-600">{message}</p>}
    </div>
  );
};

export default SubmissionForm;
