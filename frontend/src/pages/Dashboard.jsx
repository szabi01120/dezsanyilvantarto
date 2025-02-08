import React from 'react';
import axios from '../utils/axios';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [realName, setRealName] = useState(null);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('/users/');
      setData(response.data.data.users[1].username);
      setRealName(response.data.data.users[0].real_name);
    } catch (error) {
      console.error('Hiba történt', error);
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <p className="text-gray-600">Üdvözöljük a Dézsa Nyilvántartó Rendszerben <b>{realName}</b>!</p>
      <div className="mt-4">
        <button 
          onClick={() => setShowData(!showData)} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Adatok lekérése
        </button>
        {showData && (
          <div className="mt-4">
            <p className="text-gray-600">Felhasználónév: <b>{data}</b></p>
            <p className="text-gray-600">Teljes név: <b>{realName}</b></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
