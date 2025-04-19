import React, { useState } from 'react';
import OrderTable from '../components/orders/OrderTable';
import SearchAndFilterBar from '../components/ui/SearchAndFilterBar';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useOrderManagement } from '../hooks/useOrderManagement';

const Orders = () => {
  const {
    filteredOrders,
    paginatedOrders,
    sortColumn,
    sortDirection,
    handleSort,
    itemsPerPage,
    setCurrentPage,
    currentPage,
    updateItemsPerPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    loading,
    error
  } = useOrderManagement();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchAndFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={statusFilter}
        setTypeFilter={setStatusFilter}
        setCurrentPage={setCurrentPage}
        placeholder="Keresés megrendelések között..."
        filterLabel="Állapot"
        filterOptions={[
          { value: "", label: "Minden állapot" },
          { value: "új", label: "Új" },
          { value: "folyamatban", label: "Folyamatban" },
          { value: "teljesítve", label: "Teljesítve" },
          { value: "törölt", label: "Törölt" }
        ]}
      />

      <OrderTable
        paginatedOrders={paginatedOrders}
        filteredOrders={filteredOrders}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSort={handleSort}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        updateItemsPerPage={updateItemsPerPage}
        onViewOrder={(order) => console.log("Megrendelés megtekintése", order)}
        onEditOrder={(order) => console.log("Megrendelés szerkesztése", order)}
        onDeleteOrder={(order) => console.log("Megrendelés törlése", order)}
        onAddOrder={() => console.log("Új megrendelés hozzáadása")}
      />
    </div>
  );
};

export default Orders;
