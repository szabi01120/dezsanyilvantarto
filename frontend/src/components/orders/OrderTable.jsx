import React from 'react';
import OrderTableDesktop from './OrderTableDesktop';
import OrderTableMobile from './OrderTableMobile';

const OrderTable = ({
  paginatedOrders,
  filteredOrders,
  sortColumn,
  sortDirection,
  handleSort,
  itemsPerPage,
  setCurrentPage,
  currentPage,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  updateItemsPerPage,
  onAddOrder
}) => {
  const hasOrders = paginatedOrders && paginatedOrders.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">
          Megrendelések
        </h1>
        <button
          onClick={onAddOrder}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded 
           hover:bg-blue-600 transition duration-200 
           dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <span className="hidden sm:inline">Új megrendelés</span>
          <span className="sm:hidden">+ Új megrendelés</span>
        </button>
      </div>

      {hasOrders ? (
        <>
          <OrderTableDesktop
            paginatedOrders={paginatedOrders}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
            onViewOrder={onViewOrder}
            onEditOrder={onEditOrder}
            onDeleteOrder={onDeleteOrder}
          />
          <OrderTableMobile
            paginatedOrders={paginatedOrders}
            onViewOrder={onViewOrder}
            onEditOrder={onEditOrder}
            onDeleteOrder={onDeleteOrder}
          />
        </>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          Nincsenek megrendelések
        </div>
      )}

      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-300">Megrendelések oldalanként:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => updateItemsPerPage(e.target.value)}
            className="px-2 py-1 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded 
            disabled:opacity-50 
            bg-blue-500 text-white 
            hover:bg-blue-600 
            dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Előző
          </button>
          <button
            onClick={() => setCurrentPage(prev =>
              prev < Math.ceil(filteredOrders.length / itemsPerPage)
                ? prev + 1
                : prev
            )}
            disabled={currentPage >= Math.ceil(filteredOrders.length / itemsPerPage)}
            className="px-4 py-2 border rounded 
            disabled:opacity-50
            bg-blue-500 text-white 
            hover:bg-blue-600 
            dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Következő
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
