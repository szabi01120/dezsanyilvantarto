import React from 'react';

const SortableHeader = ({ column, sortColumn, sortDirection, handleSort, children }) => (
  <th
    onClick={() => handleSort(column)}
    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 select-none"
  >
    {children}
    {sortColumn === column && (
      <span className="ml-2 text-xs">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    )}
  </th>
);

export default SortableHeader;
