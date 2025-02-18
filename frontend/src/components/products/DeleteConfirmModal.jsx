import React from 'react';

const DeleteConfirmModal = ({ product, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 p-6">
        <h2 className="text-xl font-bold mb-4 text-red-600">
          Termék törlésének megerősítése
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Biztosan törölni szeretné a(z) "{product.name}" terméket?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded"
          >
            Mégsem
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Törlés
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
