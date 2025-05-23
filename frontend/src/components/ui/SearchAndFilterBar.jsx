import React, { useState, useEffect } from 'react';
import { ProductService } from '../../services/productService';

const SearchAndFilterBar = ({
  searchTerm,
  setSearchTerm,
  typeFilter = null,
  setTypeFilter = null,
  setCurrentPage = null,
  refreshTrigger = null,
  placeholder = "Keresés...",
  showTypeFilter = false
}) => {
  const [productTypes, setProductTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Csak akkor töltse be a típusokat, ha szükséges
    if (!showTypeFilter) {
      setIsLoading(false);
      return;
    }

    const fetchProductTypes = async () => {
      try {
        setIsLoading(true);

        //adatok lekérése
        const products = await ProductService.getAllProducts();

        //set-tel csak az egyedi típusokat 
        const uniqueTypes = [...new Set(products.map(product => product.type))].filter(Boolean);

        //rendezzük a tömböt
        uniqueTypes.sort();

        //majd átadjuk
        setProductTypes(uniqueTypes);
      } catch (error) {
        console.error('Hiba a terméktípusok lekérdezésekor: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductTypes();
  }, [refreshTrigger, showTypeFilter]);

  return (
    <div className="mb-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          if (setCurrentPage) setCurrentPage(1);
        }}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
      />
      
      {showTypeFilter && typeFilter !== null && setTypeFilter && (
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            if (setCurrentPage) setCurrentPage(1);
          }}
          className="w-full md:w-auto px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
          disabled={isLoading}
        >
          <option value="">Minden típus</option>
          {isLoading ? (
            <option value="" disabled>Betöltés...</option>
          ) : (
            productTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))
          )}
        </select>
      )}
    </div>
  );
};

export default SearchAndFilterBar;
