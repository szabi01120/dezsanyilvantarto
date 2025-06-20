import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { DeliveryNoteService } from '../../services/deliveryNoteService';

export default function DeliveryNoteForm({ deliveryNote, onClose, onSave }) {
  const [formData, setFormData] = useState({
    supplier_name: '',
    notes: ''
  });
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    product_name: '',
    product_type: '',
    manufacturer: '',
    unit_of_measure: 'db',
    quantity: '',
    unit_price: '',
    currency: 'HUF'
  });
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (deliveryNote) {
      setFormData({
        supplier_name: deliveryNote.supplier_name || '',
        notes: deliveryNote.notes || ''
      });
      setItems(deliveryNote.items || []);
    }
  }, [deliveryNote]);

  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewItemChange = (field, value) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateItem = (item) => {
    return (
      item.product_name.trim() &&
      item.product_type.trim() &&
      item.manufacturer.trim() &&
      item.quantity > 0 &&
      item.unit_price > 0
    );
  };

  const handleAddItem = async () => {
    if (!validateItem(newItem)) {
      setError('Minden mező kitöltése kötelező és a mennyiség/ár pozitív szám kell legyen.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const itemData = {
        product_name: newItem.product_name,
        product_type: newItem.product_type,
        manufacturer: newItem.manufacturer,
        unit_of_measure: newItem.unit_of_measure,
        quantity: parseInt(newItem.quantity),
        unit_price: parseFloat(newItem.unit_price),
        currency: newItem.currency
      };

      const response = await DeliveryNoteService.addItemToDeliveryNote(
        deliveryNote.id,
        itemData
      );

      // Frissítjük a helyi listát
      const totalPrice = itemData.quantity * itemData.unit_price;
      setItems(prev => [...prev, {
        ...itemData,
        total_price: totalPrice,
        id: response.item.id
      }]);

      // Form reset
      setNewItem({
        product_name: '',
        product_type: '',
        manufacturer: '',
        unit_of_measure: 'db',
        quantity: '',
        unit_price: '',
        currency: 'HUF'
      });
    } catch (error) {
      console.error('Hiba a tétel hozzáadásakor:', error);
      setError('Nem sikerült hozzáadni a tételt.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem({
      ...item,
      quantity: item.quantity.toString(),
      unit_price: item.unit_price.toString()
    });
  };

  const handleSaveEditedItem = async () => {
    if (!validateItem(editingItem)) {
      setError('Minden mező kitöltése kötelező és a mennyiség/ár pozitív szám kell legyen.');
      return;
    }

    console.log('=== FRONTEND DEBUG ===');
    console.log('editingItem:', editingItem);
    console.log('editingItem.quantity:', editingItem.quantity, typeof editingItem.quantity);
    console.log('editingItem.unit_price:', editingItem.unit_price, typeof editingItem.unit_price);
    console.log('parseInt result:', parseInt(editingItem.quantity));
    console.log('parseFloat result:', parseFloat(editingItem.unit_price));

    try {
      setSaving(true);
      setError(null);

      const itemData = {
        product_name: editingItem.product_name,
        product_type: editingItem.product_type,
        manufacturer: editingItem.manufacturer,
        unit_of_measure: editingItem.unit_of_measure,
        quantity: parseInt(editingItem.quantity),
        unit_price: parseFloat(editingItem.unit_price),
        currency: editingItem.currency
      };

      await DeliveryNoteService.updateDeliveryNoteItem(
        deliveryNote.id,
        editingItem.id,
        itemData
      );

      // Helyi lista frissítése
      const updatedItems = items.map(item => 
        item.id === editingItem.id 
          ? {
              ...itemData,
              id: editingItem.id,
              total_price: itemData.quantity * itemData.unit_price
            }
          : item
      );

      setItems(updatedItems);
      setEditingItem(null);
    } catch (error) {
      console.error('Hiba a tétel módosításakor:', error);
      setError('Nem sikerült módosítani a tételt.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt a tételt?')) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await DeliveryNoteService.deleteDeliveryNoteItem(deliveryNote.id, itemId);

      // Helyi lista frissítése
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Hiba a tétel törlésekor:', error);
      setError('Nem sikerült törölni a tételt.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      await DeliveryNoteService.updateDeliveryNote(deliveryNote.id, formData);
      onSave();
    } catch (error) {
      console.error('Hiba a szállítólevél mentésekor:', error);
      setError('Nem sikerült menteni a szállítólevelet.');
    } finally {
      setSaving(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.total_price || 0), 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-6 border w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-xl rounded-lg bg-gray-800 border-gray-600 max-h-screen overflow-y-auto">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-white">
              Szállítólevél szerkesztése
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* Szállítólevél adatok */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-700/50 rounded-lg border border-gray-600">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Szállítólevél szám
              </label>
              <p className="text-lg text-white font-semibold">
                {deliveryNote?.delivery_number}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dátum
              </label>
              <p className="text-lg text-white">
                {deliveryNote?.delivery_date && new Date(deliveryNote.delivery_date).toLocaleDateString('hu-HU')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Összérték
              </label>
              <p className="text-lg text-white font-semibold text-green-400">
                {calculateTotal().toLocaleString('hu-HU')} HUF
              </p>
            </div>
          </div>

          {/* Szállító és megjegyzések */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Szállító neve
              </label>
              <input
                type="text"
                value={formData.supplier_name}
                onChange={(e) => handleFormDataChange('supplier_name', e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                placeholder="Szállító neve (opcionális)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Megjegyzések
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleFormDataChange('notes', e.target.value)}
                rows={3}
                className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors resize-none"
                placeholder="Megjegyzések (opcionális)"
              />
            </div>
          </div>

          {/* Új tétel hozzáadása */}
          <div className="border-t border-gray-600 pt-8">
            <h4 className="text-lg font-semibold text-white mb-6">
              Új tétel hozzáadása
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
              <div className="xl:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Termék neve *
                </label>
                <input
                  type="text"
                  value={newItem.product_name}
                  onChange={(e) => handleNewItemChange('product_name', e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                  placeholder="pl. Akácfa dézsa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Típus *
                </label>
                <input
                  type="text"
                  value={newItem.product_type}
                  onChange={(e) => handleNewItemChange('product_type', e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                  placeholder="pl. Dézsa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gyártó *
                </label>
                <input
                  type="text"
                  value={newItem.manufacturer}
                  onChange={(e) => handleNewItemChange('manufacturer', e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                  placeholder="pl. Fa-Ber Kft."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mértékegység *
                </label>
                <select
                  value={newItem.unit_of_measure}
                  onChange={(e) => handleNewItemChange('unit_of_measure', e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                >
                  <option value="db">db</option>
                  <option value="kg">kg</option>
                  <option value="liter">liter</option>
                  <option value="m">m</option>
                  <option value="m2">m²</option>
                  <option value="m3">m³</option>
                  <option value="csomag">csomag</option>
                  <option value="doboz">doboz</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mennyiség *
                </label>
                <input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => handleNewItemChange('quantity', e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Egységár *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.unit_price}
                  onChange={(e) => handleNewItemChange('unit_price', e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pénznem *
                </label>
                <select
                  value={newItem.currency}
                  onChange={(e) => handleNewItemChange('currency', e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                >
                  <option value="HUF">HUF</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mb-8">
              <button
                onClick={handleAddItem}
                disabled={saving || !validateItem(newItem)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                {saving ? 'Hozzáadás...' : 'Tétel hozzáadása'}
              </button>
            </div>
          </div>

          {/* Tételek listája */}
          {items.length > 0 && (
            <div className="border-t border-gray-600 pt-8">
              <h4 className="text-lg font-semibold text-white mb-6">
                Szállítólevél tételei ({items.length} db)
              </h4>
              
              <div className="overflow-x-auto shadow-sm border border-gray-600 rounded-lg">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Termék
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Mértékegység
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Mennyiség
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Egységár
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Összesen
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Műveletek
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">
                            {item.product_name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {item.product_type} • {item.manufacturer}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {item.unit_of_measure}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {item.quantity} {item.unit_of_measure}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {item.unit_price?.toLocaleString('hu-HU')} {item.currency}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {item.total_price?.toLocaleString('hu-HU')} {item.currency}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditItem(item)}
                              disabled={saving}
                              className="text-blue-400 hover:text-blue-300 transition-colors p-1 disabled:opacity-50"
                              title="Szerkesztés"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              disabled={saving}
                              className="text-red-400 hover:text-red-300 transition-colors p-1 disabled:opacity-50"
                              title="Törlés"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-700">
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-white">
                        Összesen:
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-white">
                        {calculateTotal().toLocaleString('hu-HU')} HUF
                      </td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Action buttons MENTÉS GOMB*/}
          <div className="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-600">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              Mégse
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-[60]">
          <div className="relative top-20 mx-auto p-6 border w-11/12 md:w-2/3 lg:w-1/2 shadow-xl rounded-lg bg-gray-800 border-gray-600">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-white mb-6">
                Tétel szerkesztése
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Termék neve *
                  </label>
                  <input
                    type="text"
                    value={editingItem.product_name}
                    onChange={(e) => setEditingItem({...editingItem, product_name: e.target.value})}
                    className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Típus *
                    </label>
                    <input
                      type="text"
                      value={editingItem.product_type}
                      onChange={(e) => setEditingItem({...editingItem, product_type: e.target.value})}
                      className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gyártó *
                    </label>
                    <input
                      type="text"
                      value={editingItem.manufacturer}
                      onChange={(e) => setEditingItem({...editingItem, manufacturer: e.target.value})}
                      className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mértékegység *
                    </label>
                    <select
                      value={editingItem.unit_of_measure}
                      onChange={(e) => setEditingItem({...editingItem, unit_of_measure: e.target.value})}
                      className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                    >
                      <option value="db">db</option>
                      <option value="kg">kg</option>
                      <option value="liter">liter</option>
                      <option value="m">m</option>
                      <option value="m2">m²</option>
                      <option value="m3">m³</option>
                      <option value="csomag">csomag</option>
                      <option value="doboz">doboz</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mennyiség *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editingItem.quantity}
                      onChange={(e) => setEditingItem({...editingItem, quantity: e.target.value})}
                      className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pénznem *
                    </label>
                    <select
                      value={editingItem.currency}
                      onChange={(e) => setEditingItem({...editingItem, currency: e.target.value})}
                      className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                    >
                      <option value="HUF">HUF</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Egységár *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingItem.unit_price}
                    onChange={(e) => setEditingItem({...editingItem, unit_price: e.target.value})}
                    className="block w-full px-4 py-3 rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 sm:text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingItem(null)}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Mégse
                </button>
                <button
                  onClick={handleSaveEditedItem}
                  disabled={saving}
                  className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Mentés...' : 'Mentés'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
