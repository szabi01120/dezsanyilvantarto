import React from 'react';

const ErrorMessage = ({ error }) => {
  return (
    <div className="flex justify-center items-center h-screen bg-red-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Hiba történt</h2>
        <p className="text-gray-700 mb-4">
          {error?.response?.data?.message || error?.message || 'Ismeretlen hiba'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Újratöltés
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
