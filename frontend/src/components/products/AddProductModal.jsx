// src/components/products/AddProductModal.jsx
import React, { useState } from 'react';

const AddProductModal = ({ onClose, onSave }) => {
  const [productData, setProductData] = useState({
    name: '',
    type: '',
    quantity: '',
    manufacturer: '',
    purchase_price: '',
    currency: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validáció
    const { name, type, quantity, manufacturer, purchase_price, currency } = productData;
    if (!name || !type || !quantity || !manufacturer || !purchase_price || !currency) {
      alert('Kérem töltsön ki minden mezőt!');
      return;
    }

    onSave({
      ...productData,
      quantity: Number(quantity),
      purchase_price: Number(purchase_price),
      currency: currency.toUpperCase()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Új termék hozzáadása
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Név
            </label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded 
              dark:bg-gray-700 dark:border-gray-600 
              dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Típus
            </label>
            <input
              type="text"
              name="type"
              value={productData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded 
              dark:bg-gray-700 dark:border-gray-600 
              dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Mennyiség
            </label>
            <input
              type="number"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded 
              dark:bg-gray-700 dark:border-gray-600 
              dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Gyártó
            </label>
            <input
              type="text"
              name="manufacturer"
              value={productData.manufacturer}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded 
              dark:bg-gray-700 dark:border-gray-600 
              dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Beszerzési ár
            </label>
            <input
              type="number"
              name="purchase_price"
              value={productData.purchase_price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded 
              dark:bg-gray-700 dark:border-gray-600 
              dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Pénznem
            </label>
            <select
              name="currency"
              value={productData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded 
                        dark:bg-gray-700 dark:border-gray-600 
                        dark:text-white"
              required
            >
              <option value="">Válassz...</option>
              <option value="HUF">HUF</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 
              rounded hover:bg-gray-300 
              dark:bg-gray-600 dark:text-white 
              dark:hover:bg-gray-500"
            >
              Mégse
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white 
              rounded hover:bg-blue-600 
              dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Mentés
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
