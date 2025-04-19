import React from 'react';

const OrderTableMobile = ({ paginatedOrders, onViewOrder, onEditOrder, onDeleteOrder }) => {
  if (!paginatedOrders || paginatedOrders.length === 0) {
    return null;
  }

  // Státuszok színezése
  const getStatusColor = (status) => {
    const statusColors = {
      'új': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'folyamatban': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'teljesítve': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'törölt': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="md:hidden">
      {paginatedOrders.map((order) => (
        <div
          key={`order-mobile-${order.id}`}
          className="border-b border-gray-200 dark:border-gray-600 p-4"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {order.orderNumber}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.customerName}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Dátum:</span>
              <span className="ml-1 text-gray-800 dark:text-gray-200">
                {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Összeg:</span>
              <span className="ml-1 font-semibold text-green-600 dark:text-green-400">
                {order.totalAmount
                  ? `${Number(order.totalAmount).toLocaleString()} ${order.currency || 'Ft'}`
                  : '0 Ft'}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => onViewOrder(order)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded
                dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Részletek
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => onEditOrder(order)}
                className="text-blue-500 hover:text-blue-700 
                  dark:text-blue-400 dark:hover:text-blue-300"
              >
                Szerkesztés
              </button>
              <button
                onClick={() => onDeleteOrder(order)}
                className="text-red-500 hover:text-red-700 
                  dark:text-red-400 dark:hover:text-red-300"
              >
                Törlés
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTableMobile;
