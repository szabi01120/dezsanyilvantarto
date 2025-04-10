import React, { useState, useEffect } from 'react';

const EditProductModal = ({ product, onClose, onSave }) => {
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Ha más formátumú dátum érkezik
    const date = new Date(dateString);

    // Ellenőrizzük, hogy érvényes
    if (isNaN(date.getTime())) {
      console.warn('Érvénytelen dátum:', dateString);
      return '';
    }

    return date.toISOString().split('T')[0];
  };

  const [editedProduct, setEditedProduct] = useState({
    ...product,
    // Átnevezzük a mezőket a frontend által elvárt névre
    acquisitionDate: formatDateForInput(product.purchase_date),
    acquisitionPrice: product.purchase_price
  });

  // Automatikus state frissítés, ha a termék változik
  useEffect(() => {
    setEditedProduct({
      ...product,
      acquisitionDate: formatDateForInput(product.purchase_date),
      acquisitionPrice: product.purchase_price
    });
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Backend által elvárt formátumra alakítjuk a terméket
    const productToSave = {
      ...editedProduct,
      purchase_date: editedProduct.acquisitionDate,
      purchase_price: editedProduct.acquisitionPrice
    };

    onSave(productToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Termék szerkesztése
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Termék neve
            </label>
            <input
              type="text"
              name="name"
              value={editedProduct.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Beszerzés dátuma
            </label>
            <input
              type="date"
              name="acquisitionDate"
              value={editedProduct.acquisitionDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Típus
            </label>
            <select
              name="type"
              value={editedProduct.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Elektronika">Elektronika</option>
              <option value="Mobileszköz">Mobileszköz</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mennyiség
            </label>
            <input
              type="number"
              name="quantity"
              value={editedProduct.quantity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gyártó
            </label>
            <input
              type="text"
              name="manufacturer"
              value={editedProduct.manufacturer}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Beszerzési ár
            </label>
            <div className="relative">
              <input
                type="number"
                name="acquisitionPrice"
                value={editedProduct.acquisitionPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-20"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400">{editedProduct.currency}</span>
              </div>
            </div>
          </div>
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-5">
              Pénznem
            </label>
            <select
              name="currency"
              value={editedProduct.currency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded 
                        dark:bg-gray-700 dark:border-gray-600 
                        dark:text-white"
              required
            >
              <option value="">Pénznem</option>
              <option value="HUF">HUF</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-md 
                       hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200"
          >
            Mégsem
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md 
                       hover:bg-blue-600 transition duration-200"
          >
            Mentés
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
