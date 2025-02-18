import React from 'react';

const SearchAndFilterBar = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  setCurrentPage
}) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <input
        type="text"
        placeholder="Keresés termékek között..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <select
        value={typeFilter}
        onChange={(e) => {
          setTypeFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full md:w-auto px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="">Minden típus</option>
        <option value="Elektronika">Elektronika</option>
        <option value="Mobileszköz">Mobileszköz</option>
      </select>
    </div>
  );
};

export default SearchAndFilterBar;
