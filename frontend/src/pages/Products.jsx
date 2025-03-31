import React, { useState } from 'react';
import { useProductManagement } from '../hooks/useProductManagement';
import { ProductService } from '../services/productService';
import ProductTable from '../components/products/ProductTable';
import SearchAndFilterBar from '../components/ui/SearchAndFilterBar';
import EditProductModal from '../components/products/EditProductModal';
import DeleteConfirmModal from '../components/products/DeleteConfirmModal';
import AddProductModal from '../components/products/AddProductModal';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const Products = () => {
  const {
    products,
    setProducts,
    triggerRefresh,
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
    loading,
    error
  } = useProductManagement();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEditProduct = async (editedProduct) => {
    try {
      // Backend frissítés
      const updatedProduct = await ProductService.updateProduct(
        editedProduct.id,
        {
          name: editedProduct.name,
          type: editedProduct.type,
          quantity: editedProduct.quantity,
          manufacturer: editedProduct.manufacturer,
          purchase_price: editedProduct.acquisitionPrice,
          purchase_date: editedProduct.acquisitionDate
        }
      );

      // Frontend state frissítés
      setProducts(products.map(p =>
        p.id === updatedProduct.id
          ? {
            ...updatedProduct,
            acquisitionDate: updatedProduct.purchase_date,
            acquisitionPrice: updatedProduct.purchase_price
          }
          : p
      ));

      triggerRefresh();
      setSelectedProduct(null);
    } catch (error) {
      console.error('Hiba a termék frissítésekor:', error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      // Backend törlés
      await ProductService.deleteProduct(deleteConfirmProduct.id);

      // Frontend state frissítés
      setProducts(products.filter(p => p.id !== deleteConfirmProduct.id));
      triggerRefresh();
      setDeleteConfirmProduct(null);
    } catch (error) {
      console.error('Hiba a termék törlésekor:', error);
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      // Backend hozzáadás
      const addedProduct = await ProductService.addProduct({...newProduct});

      // Frontend state frissítés
      const formattedProduct = {
        ...addedProduct,
        acquisitionPrice: addedProduct.purchase_price
      };

      setProducts([...products, formattedProduct]);
      setIsAddModalOpen(false);

      triggerRefresh();
    } catch (error) {
      console.error('Hiba az új termék hozzáadásakor:', error);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchAndFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        setCurrentPage={setCurrentPage}
        refreshTrigger={triggerRefresh}
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
        onAddProduct={() => setIsAddModalOpen(true)}
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

      {isAddModalOpen && (
        <AddProductModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProduct}
        />
      )}
    </div>
  );
};

export default Products;
