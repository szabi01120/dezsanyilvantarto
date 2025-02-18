import React, { useState } from 'react';
import { useProductManagement } from '../hooks/useProductManagement';
import { initialProductData } from '../data/initialProducts';
import ProductTable from '../components/products/ProductTable';
import SearchAndFilterBar from '../components/ui/SearchAndFilterBar';
import EditProductModal from '../components/products/EditProductModal';
import DeleteConfirmModal from '../components/products/DeleteConfirmModal';

const Products = () => {
  const {
    products,
    setProducts,
    filteredProducts,
    paginatedProducts,
    sortColumn,
    sortDirection,
    handleSort,
    itemsPerPage,
    setCurrentPage,
    currentPage,
    updateItemsPerPage,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
  } = useProductManagement(initialProductData);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);

  const handleEditProduct = (editedProduct) => {
    setProducts(products.map(p => 
      p.id === editedProduct.id ? editedProduct : p
    ));
  };

  const handleDeleteProduct = () => {
    setProducts(products.filter(p => p.id !== deleteConfirmProduct.id));
    setDeleteConfirmProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchAndFilterBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        setCurrentPage={setCurrentPage}
      />

      <ProductTable 
        paginatedProducts={paginatedProducts}
        filteredProducts={filteredProducts}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSort={handleSort}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        updateItemsPerPage={updateItemsPerPage}
        onEditProduct={setSelectedProduct}
        onDeleteProduct={setDeleteConfirmProduct}
      />

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={handleEditProduct}
        />
      )}

      {deleteConfirmProduct && (
        <DeleteConfirmModal
          product={deleteConfirmProduct}
          onClose={() => setDeleteConfirmProduct(null)}
          onConfirm={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default Products;
