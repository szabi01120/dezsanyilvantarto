import React, { useState, useEffect } from 'react';
import { ProductService } from '../../services/productService';

const SearchAndFilterBar = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  setCurrentPage
}) => {
  const [productTypes, setProductTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, []);

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
        {/* <option value="Elektronika">Elektronika</option>
        <option value="Mobileszköz">Mobileszköz</option> */}
      </select>
    </div>
  );
};

export default SearchAndFilterBar;
