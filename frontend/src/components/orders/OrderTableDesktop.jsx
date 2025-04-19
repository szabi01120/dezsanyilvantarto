import React from 'react';
import SortableHeader from '../ui/SortableHeader';

const OrderTableDesktop = ({
  paginatedOrders,
  sortColumn,
  sortDirection,
  handleSort,
  onViewOrder,
  onEditOrder,
  onDeleteOrder
}) => {
  if (!paginatedOrders || paginatedOrders.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-4">
        Nincs megjeleníthető elem.
      </div>
    );
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
    <table className="w-full">
      <thead className="hidden md:table-header-group">
        <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          <SortableHeader
            column="id"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            ID
          </SortableHeader>
          <SortableHeader
            column="orderNumber"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Rendelésszám
          </SortableHeader>
          <SortableHeader
            column="customerName"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Ügyfél
          </SortableHeader>
          <SortableHeader
            column="orderDate"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Dátum
          </SortableHeader>
          <SortableHeader
            column="status"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Állapot
          </SortableHeader>
          <SortableHeader
            column="totalAmount"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Összeg
          </SortableHeader>
          <th className="px-4 py-3 text-left">Műveletek</th>
        </tr>
      </thead>
      <tbody>
        {paginatedOrders.map((order) => (
          <tr
            key={`order-${order.id}`}
            className="hidden md:table-row border-b border-gray-200 dark:border-gray-600 
               hover:bg-gray-50 dark:hover:bg-gray-700 
               transition duration-200"
          >
            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{order.id}</td>
            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
              {order.orderNumber}
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
              {order.customerName}
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
              {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
            </td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </td>
            <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
              {order.totalAmount
                ? `${Number(order.totalAmount).toLocaleString()} ${order.currency || 'Ft'}`
                : '0 Ft'}
            </td>
            <td className="px-4 py-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewOrder(order)}
                  className="text-gray-500 hover:text-gray-700 
                     dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Részletek
                </button>
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTableDesktop;
