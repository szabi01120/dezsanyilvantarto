import React from 'react';

const ProductTableMobile = ({
  paginatedProducts,
  onEditProduct,
  onDeleteProduct
}) => {
  if (!paginatedProducts || paginatedProducts.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 md:hidden">
        Nincsenek termékek
      </div>
    );
  }

  return (
    <div className="md:hidden">
      <table className="w-full">
        <tbody>
          {paginatedProducts.map((product) => (
            <tr
              key={`product-mobile-${product.id}`}
              className="border-b border-gray-200 dark:border-gray-600"
            >
              <td className="px-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </div>
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
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">Típus:</div>
                  <div className="text-gray-800 dark:text-gray-200">
                    {product.type}
                  </div>

                  <div className="text-gray-600 dark:text-gray-400">Mennyiség:</div>
                  <div className="text-gray-800 dark:text-gray-200">
                    {product.quantity}
                  </div>

                  <div className="text-gray-600 dark:text-gray-400">Gyártó:</div>
                  <div className="text-gray-800 dark:text-gray-200">
                    {product.manufacturer}
                  </div>

                  <div className="text-gray-600 dark:text-gray-400">Beszerzési ár:</div>
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    {product.acquisitionPrice || product.purchase_price
                      ? `${Number(product.acquisitionPrice || product.purchase_price).toLocaleString()} ${product.currency || 'Ft'}`
                      : 'N/A'}
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-400">Beszerzés:</div>
                  <div className="text-gray-800 dark:text-gray-200">
                    {product.acquisitionDate ? new Date(product.acquisitionDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTableMobile;
