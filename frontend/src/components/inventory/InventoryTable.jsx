import React, { useState } from 'react';
import { ExclamationTriangleIcon, EyeIcon } from '@heroicons/react/24/outline';
import { InventoryService } from '../../services/inventoryService';
import SearchAndFilterBar from '../ui/SearchAndFilterBar';

export default function InventoryTable({ inventory, onRefresh, showLowStockWarning = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovements, setSelectedMovements] = useState(null);
  const [loadingMovements, setLoadingMovements] = useState(false);

  const filteredInventory = inventory.filter(item =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStockStatus = (item) => {
    const ratio = item.available_quantity / Math.max(item.current_quantity, 1);
    if (item.available_quantity === 0) return 'empty';
    if (item.available_quantity <= 5) return 'low';
    if (ratio < 0.3) return 'medium';
    return 'good';
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'empty': return 'bg-red-900 text-red-200 border border-red-800';
      case 'low': return 'bg-yellow-900 text-yellow-200 border border-yellow-800';
      case 'medium': return 'bg-orange-900 text-orange-200 border border-orange-800';
      case 'good': return 'bg-green-900 text-green-200 border border-green-800';
      default: return 'bg-gray-900 text-gray-200 border border-gray-800';
    }
  };

  const getStockStatusText = (status) => {
    switch (status) {
      case 'empty': return 'Elfogyott';
      case 'low': return 'Alacsony';
      case 'medium': return 'Közepes';
      case 'good': return 'Megfelelő';
      default: return 'Ismeretlen';
    }
  };

  const handleShowMovements = async (inventoryId) => {
    try {
      setLoadingMovements(true);
      const movements = await InventoryService.getInventoryMovements(inventoryId);
      setSelectedMovements(movements);
    } catch (error) {
      console.error('Hiba a mozgások betöltésekor:', error);
    } finally {
      setLoadingMovements(false);
    }
  };

  if (filteredInventory.length === 0 && searchTerm) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400">
          Nincs találat a "{searchTerm}" keresésre.
        </p>
      </div>
    );
  }

  if (inventory.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 shadow rounded-lg border border-gray-700">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 20h16M20 28h16m-16-8V8a4 4 0 118 0v12M8 20v20a4 4 0 004 4h24a4 4 0 004-4V20H8z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-white">Nincs készlet</h3>
        <p className="mt-1 text-sm text-gray-400">
          {showLowStockWarning ? 'Nincs alacsony készletű termék.' : 'Kezdj el szállítólevelek létrehozásával.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 shadow rounded-lg border border-gray-700">
      {/* Keresés */}
      <div className="p-6 border-b border-gray-700">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Keresés termék név, típus vagy gyártó alapján..."
          showTypeFilter={false}
        />
      </div>

      {/* Táblázat */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Sorszám
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Termék név
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Mennyiségi egység
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Mennyiség
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Gyártó
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Nettó eladási ár
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Műveletek
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredInventory.map((item, index) => {
              const status = getStockStatus(item);
              return (
                <tr key={item.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {item.product_name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {item.product_type}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {item.unit_of_measure}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-white mr-2">
                        {item.current_quantity} {item.unit_of_measure}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(status)}`}>
                        {getStockStatusText(status)}
                      </span>
                      {status === 'low' && (
                        <ExclamationTriangleIcon className="ml-1 h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Elérhető: {item.available_quantity} {item.unit_of_measure}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {item.manufacturer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-400">
                      {item.average_purchase_price.toLocaleString('hu-HU')} {item.currency}
                    </div>
                    <div className="text-xs text-gray-400">
                      Összesen: {item.total_value.toLocaleString('hu-HU')} {item.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleShowMovements(item.id)}
                      disabled={loadingMovements}
                      className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                      title="Mozgások megtekintése"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mozgások modal */}
      {selectedMovements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-gray-800 border-gray-600">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-white mb-4">
                Készletmozgások
              </h3>
              <div className="max-h-96 overflow-y-auto">
                {selectedMovements.length === 0 ? (
                  <p className="text-gray-400">Nincs mozgás.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedMovements.map((movement) => (
                      <div key={movement.id} className="border-b border-gray-700 pb-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-white">{movement.movement_type}</span>
                          <span className="text-sm text-gray-300">{movement.quantity} db</span>
                        </div>
                        <div className="text-xs text-gray-400">{formatDate(movement.created_at)}</div>
                        {movement.notes && (
                          <div className="text-xs text-gray-500">{movement.notes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedMovements(null)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                >
                  Bezár
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
