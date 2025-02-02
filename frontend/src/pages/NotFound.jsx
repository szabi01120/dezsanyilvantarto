import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 mb-4">A keresett oldal nem található.</p>
      <Link 
        to="/" 
        className="text-blue-500 hover:text-blue-700 underline"
      >
        Vissza a főoldalra
      </Link>
    </div>
  );
};

export default NotFound;
