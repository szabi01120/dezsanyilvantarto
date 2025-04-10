import React from 'react';
import SortableHeader from './SortableHeader';

const ProductTableDesktop = ({
  paginatedProducts,
  sortColumn,
  sortDirection,
  handleSort,
  onEditProduct,
  onDeleteProduct
}) => {
  if (!paginatedProducts || paginatedProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-4">
        Nincs megjeleníthető elem.
      </div>
    );
  }

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
            column="name"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Név
          </SortableHeader>
          <SortableHeader
            column="acquisitionDate"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Beszerzés
          </SortableHeader>
          <SortableHeader
            column="type"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Típus
          </SortableHeader>
          <SortableHeader
            column="quantity"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Mennyiség
          </SortableHeader>
          <SortableHeader
            column="manufacturer"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Gyártó
          </SortableHeader>
          <SortableHeader
            column="acquisitionPrice"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Beszerzési ár
          </SortableHeader>
          <th className="px-4 py-3 text-left">Műveletek</th>
        </tr>
      </thead>
      <tbody>
        {paginatedProducts.map((product) => (
          <tr
            key={`product-${product.id}`}
            className="hidden md:table-row border-b border-gray-200 dark:border-gray-600 
               hover:bg-gray-50 dark:hover:bg-gray-700 
               transition duration-200"
          >
            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{product.id}</td>
            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
              {product.acquisitionDate ? new Date(product.acquisitionDate).toLocaleDateString() : 'N/A'}
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{product.type}</td>
            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{product.quantity}</td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{product.manufacturer}</td>
            <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
              {product.acquisitionPrice || product.purchase_price
                ? `${Number(product.acquisitionPrice || product.purchase_price).toLocaleString()} ${product.currency || 'Ft'}`
                : 'N/A'}
            </td>
            <td className="px-4 py-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditProduct(product)}
                  className="text-blue-500 hover:text-blue-700 
                     dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Szerkesztés
                </button>
                <button
                  onClick={() => onDeleteProduct(product)}
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

export default ProductTableDesktop;
