// frontend/src/Components/SkeletonLoader.jsx

import React from 'react';

const SkeletonLoader = ({ className = '' }) => {
  return (
    <div className={`bg-neutral-200 rounded-lg p-6 shadow-sm ${className}`}>
      <div className="h-4 bg-neutral-300 rounded w-3/4 mb-4 animate-pulse"></div>
      <div className="h-8 bg-neutral-300 rounded w-1/2 animate-pulse"></div>
    </div>
  );
};

// THE FIX: Add the missing export default line
export default SkeletonLoader;
