// frontend/src/Components/BulkUpload.jsx
import React, { useState, useRef } from 'react';
import api from '../Services/api';
import toast from 'react-hot-toast';

const BulkUpload = ({ onNewData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const pollTaskStatus = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await api.getTaskStatus(taskId);
        if (data.status === 'SUCCESS') {
          clearInterval(interval);
          toast.success('File processed successfully!', { id: taskId });
          onNewData(); // Refresh dashboard
        } else if (data.status === 'FAILURE') {
          clearInterval(interval);
          toast.error('File processing failed.', { id: taskId });
        } else if (data.status === 'PROGRESS' && data.result) {
          const progress = (data.result.current / data.result.total) * 100;
          toast.loading(`Processing... ${Math.round(progress)}%`, { id: taskId });
        }
      } catch (error) {
        clearInterval(interval);
        toast.error('Could not get task status.', { id: taskId });
      }
    }, 2000); // Check every 2 seconds
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    const toastId = toast.loading('Uploading file...');
    try {
      const { data } = await api.createBulkReadings(formData);
      toast.dismiss(toastId);
      toast.loading('File sent for processing...', { id: data.task_id });
      pollTaskStatus(data.task_id);
    } catch (error) {
      toast.error('Upload failed. Please check the file format.');
      toast.dismiss(toastId);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4 text-neutral-700">Bulk Upload CSV</h2>
      <div className="flex items-center space-x-4">
        <label className="w-full flex items-center px-4 py-3 bg-white text-primary rounded-lg shadow-sm tracking-wide uppercase border border-primary cursor-pointer hover:bg-primary-500 hover:text-white transition-colors duration-200">
          <svg className="w-6 h-6 mr-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3V7h2v4z" />
          </svg>
          <span className="text-base leading-normal truncate">{selectedFile ? selectedFile.name : 'Select a CSV file'}</span>
          <input type='file' ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />
        </label>
      </div>
      {selectedFile && (
        <div className="mt-4">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-secondary text-white py-3 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 transition-colors duration-200"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
