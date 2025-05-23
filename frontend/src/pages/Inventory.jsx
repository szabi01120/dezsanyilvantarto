import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { InventoryService } from '../services/inventoryService';
import InventoryTable from '../components/inventory/InventoryTable';
import ErrorMessage from '../components/ui/ErrorMessage';
import Spinner from '../components/ui/Spinner';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      const [inventoryData, lowStockData] = await Promise.all([
        InventoryService.getAllInventory(),
        InventoryService.getLowStockItems(5)
      ]);
      
      setInventory(inventoryData);
      setLowStockItems(lowStockData);
    } catch (error) {
      console.error('Hiba a készlet adatok betöltésekor:', error);
      setError('Nem sikerült betölteni a készlet adatokat.');
    } finally {
      setLoading(false);
    }
  };

  const totalValue = inventory.reduce((sum, item) => {
    return sum + (item.current_quantity * 0); // Itt kellene a beszerzési ár
  }, 0);

  const totalItems = inventory.reduce((sum, item) => sum + item.current_quantity, 0);

  if (loading) return <Spinner />;

  if (error) {
    return <ErrorMessage message={error} onRetry={loadInventoryData} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Készletkezelés
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Termékek készletének nyomon követése és kezelése
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link
              to="/delivery-notes"
              className="ml-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Szállítólevelek
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Összes termék
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {inventory.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">K</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Összes készlet
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {totalItems} db
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Alacsony készlet
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {lowStockItems.length} db
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">É</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Elérhető termékek
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {inventory.filter(item => item.available_quantity > 0).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">Összes termék</option>
              <option value="low-stock">Alacsony készlet</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('all')}
                className={`${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium`}
              >
                Összes termék ({inventory.length})
              </button>
              <button
                onClick={() => setActiveTab('low-stock')}
                className={`${
                  activeTab === 'low-stock'
                    ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium`}
              >
                Alacsony készlet ({lowStockItems.length})
                {lowStockItems.length > 0 && (
                  <ExclamationTriangleIcon className="ml-1 inline h-4 w-4 text-yellow-500" />
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'all' && (
            <InventoryTable 
              inventory={inventory} 
              onRefresh={loadInventoryData}
            />
          )}
          {activeTab === 'low-stock' && (
            <InventoryTable 
              inventory={lowStockItems} 
              onRefresh={loadInventoryData}
              showLowStockWarning={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
