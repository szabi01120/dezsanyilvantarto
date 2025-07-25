import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/users/login', {
        username,
        password
      });

      if (response.data.user && response.data.token) {
        await login(response.data.user, response.data.token);
        navigate('/');
      } else {
        setError('Hiányzó felhasználói adatok vagy token!');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Bejelentkezési hiba történt');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Bejelentkezés
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Felhasználónév
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-300"
          >
            {isLoading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>
      </div>
    </div>

  );
};

export default Login;
