import React from 'react';
import axios from 'axios';
import { useState } from 'react';

const Dashboard = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/hello');
      setData(response.data.message);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <p className="text-gray-600">Üdvözöljük a Dezsa Nyilvántartó Rendszerben!</p>
      <div className="mt-4">
        <button 
          onClick={fetchData} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Adatok lekérése
        </button>
        {data && <p className="mt-4 text-gray-700">{JSON.stringify(data)}</p>}
      </div>
    </div>
  );
};

export default Dashboard;
