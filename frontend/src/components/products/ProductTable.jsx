import React from 'react';
import ProductTableDesktop from './ProductTableDesktop';
import ProductTableMobile from './ProductTableMobile';

const ProductTable = ({
    paginatedProducts,
    filteredProducts,
    sortColumn,
    sortDirection,
    handleSort,
    itemsPerPage,
    setCurrentPage,
    currentPage,
    onEditProduct,
    onDeleteProduct,
    updateItemsPerPage
}) => {
    const hasProducts = paginatedProducts && paginatedProducts.length > 0;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">
                    Termékek
                </h1>
                <button
                    className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded 
                     hover:bg-blue-600 transition duration-200 
                     dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                    <span className="hidden sm:inline">Új termék hozzáadása</span>
                    <span className="sm:hidden">+ Új termék</span>
                </button>
            </div>

            {hasProducts ? (
                <>
                    <ProductTableDesktop
                        paginatedProducts={paginatedProducts}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                        onEditProduct={onEditProduct}
                        onDeleteProduct={onDeleteProduct}
                    />
                    <ProductTableMobile
                        paginatedProducts={paginatedProducts}
                        onEditProduct={onEditProduct}
                        onDeleteProduct={onDeleteProduct}
                    />
                </>
            ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    Nincsenek termékek
                </div>
            )}

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-600 dark:text-gray-300">Termékek oldalanként:</span>
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
                            prev < Math.ceil(filteredProducts.length / itemsPerPage)
                                ? prev + 1
                                : prev
                        )}
                        disabled={currentPage >= Math.ceil(filteredProducts.length / itemsPerPage)}
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

export default ProductTable;
