import React, { useState } from 'react';
import api from '../Services/api';
import AnimatedButton from './animatedButton';

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
    
    if (name === 'sensor_type') {
      // Update unit based on sensor type
      const units = {
        'temperature': '°C',
        'soil_moisture': '%',
        'humidity': '%',
        'ph': 'pH units',
        'sunlight': 'W/m²',
        'rainfall': 'mm',
        'wind_speed': 'm/s',
        'soil_nitrogen': 'mg/kg'
      };
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        unit: units[value] || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');

    try {
      const submissionData = {
        timestamp: new Date().toISOString(),
        field_id: `field_${formData.field_id}`,
        sensor_type: formData.sensor_type,
        reading_value: parseFloat(formData.value),
        unit: formData.unit
      };

      await api.post('/sensor-data', submissionData);
      
      // Reset form
      setFormData({
        field_id: '1',
        sensor_type: 'temperature',
        value: '',
        unit: '°C'
      });

      if (onNewData) {
        onNewData(submissionData);
      }

      setMessage('Data submitted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting data:', error);
      setMessage('Failed to submit data. Please try again.');
      
      // Clear error message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4 text-neutral-700">Submit a Reading</h2>
      <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form Inputs */}
          <div>
            <label htmlFor="field_id" className="block text-sm font-medium text-neutral-600">
              Field ID
            </label>
            <input 
              id="field_id"
              type="number" 
              name="field_id" 
              value={formData.field_id} 
              onChange={handleChange} 
              className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label htmlFor="sensor_type" className="block text-sm font-medium text-neutral-600">
              Sensor Type
            </label>
            <select 
              id="sensor_type"
              name="sensor_type" 
              value={formData.sensor_type} 
              onChange={handleChange} 
              className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="temperature">Temperature</option>
              <option value="soil_moisture">Soil Moisture</option>
              <option value="humidity">Humidity</option>
              <option value="ph">pH</option>
              <option value="sunlight">Sunlight</option>
              <option value="rainfall">Rainfall</option>
              <option value="wind_speed">Wind Speed</option>
              <option value="soil_nitrogen">Soil Nitrogen</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-neutral-600">
              Value
            </label>
            <input 
              id="value"
              type="number" 
              step="0.1" 
              name="value" 
              value={formData.value} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-neutral-600">
              Unit
            </label>
            <input 
              id="unit"
              type="text" 
              name="unit" 
              value={formData.unit} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        <div className="mt-6">
          {/* USE THE ANIMATED BUTTON */}
          <AnimatedButton type="submit" className="w-full">
            Submit
          </AnimatedButton>
        </div>
      </form>
      
      {message && (
        <p className={`mt-4 text-sm text-center ${
          message.includes('successfully') ? 'text-green-600' : 
          message.includes('Failed') ? 'text-red-600' : 'text-neutral-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SubmissionForm;