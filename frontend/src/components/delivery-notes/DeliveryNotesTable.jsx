import React, { useState } from 'react';
import { PencilIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import SearchAndFilterBar from '../ui/SearchAndFilterBar';

export default function DeliveryNotesTable({ deliveryNotes, onEdit, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeliveryNote, setSelectedDeliveryNote] = useState(null);

  const filteredDeliveryNotes = deliveryNotes.filter(dn =>
    dn.delivery_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dn.supplier_name && dn.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('hu-HU');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (deliveryNote) => {
    setSelectedDeliveryNote(deliveryNote);
  };

  if (filteredDeliveryNotes.length === 0 && searchTerm) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Nincs találat a "{searchTerm}" keresésre.
        </p>
      </div>
    );
  }

  if (deliveryNotes.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 shadow rounded-lg">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nincs szállítólevél</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kezdj el új szállítólevél létrehozásával.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        {/* Keresés */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <SearchAndFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Keresés szállítólevél szám vagy szállító alapján..."
          />
        </div>

        {/* Táblázat */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Szállítólevél szám
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Szállító
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dátum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tételek
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Összérték
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Létrehozva
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Műveletek
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDeliveryNotes.map((deliveryNote) => (
                <tr key={deliveryNote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {deliveryNote.delivery_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {deliveryNote.supplier_name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(deliveryNote.delivery_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {deliveryNote.items ? deliveryNote.items.length : 0} db
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {deliveryNote.total_value.toLocaleString('hu-HU')} {deliveryNote.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDateTime(deliveryNote.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(deliveryNote)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        title="Részletek megtekintése"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onEdit(deliveryNote)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Szerkesztés"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Részletek Modal */}
      {selectedDeliveryNote && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Szállítólevél részletei
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Szállítólevél szám
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedDeliveryNote.delivery_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Dátum
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDate(selectedDeliveryNote.delivery_date)}
                    </p>
                  </div>
                </div>

                {selectedDeliveryNote.supplier_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Szállító
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedDeliveryNote.supplier_name}
                    </p>
                  </div>
                )}

                {selectedDeliveryNote.items && selectedDeliveryNote.items.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                      Tételek
                    </label>
                    <div className="border dark:border-gray-600 rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                              Termék
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                              Mennyiség
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                              Egységár
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                              Összesen
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                          {selectedDeliveryNote.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                {item.product_name}
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.product_type} • {item.manufacturer}
                                </div>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                {item.quantity} db
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                {item.unit_price.toLocaleString('hu-HU')} {item.currency}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                {item.total_price.toLocaleString('hu-HU')} {item.currency}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Összérték:
                    </span>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedDeliveryNote.total_value.toLocaleString('hu-HU')} {selectedDeliveryNote.currency}
                    </span>
                  </div>
                </div>

                {selectedDeliveryNote.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Megjegyzések
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedDeliveryNote.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedDeliveryNote(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Bezár
                </button>
                <button
                  onClick={() => {
                    setSelectedDeliveryNote(null);
                    onEdit(selectedDeliveryNote);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Szerkesztés
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
