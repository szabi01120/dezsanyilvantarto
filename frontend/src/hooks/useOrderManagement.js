import { useState, useEffect, useMemo, useCallback } from 'react';

// Mivel nincs OrderService, létrehozunk egy ideiglenes szolgáltatásmodellet
const mockOrderService = {
  getAllOrders: () => {
    return Promise.resolve([
      {
        id: 1,
        orderNumber: "MR-2023-001",
        customerName: "Kovács Kft.",
        orderDate: "2023-11-05",
        status: "teljesítve",
        totalAmount: 235000,
        currency: "HUF"
      },
      {
        id: 2,
        orderNumber: "MR-2023-002",
        customerName: "Nagy és Társa Bt.",
        orderDate: "2023-11-10",
        status: "teljesítve",
        totalAmount: 85400,
        currency: "HUF"
      },
      {
        id: 3,
        orderNumber: "MR-2023-003",
        customerName: "Zöld Energia Kft.",
        orderDate: "2023-11-12",
        status: "folyamatban",
        totalAmount: 150000,
        currency: "HUF"
      },
      {
        id: 4,
        orderNumber: "MR-2023-004",
        customerName: "Global Trading Inc.",
        orderDate: "2023-11-15",
        status: "törölt",
        totalAmount: 1200,
        currency: "EUR"
      },
      {
        id: 5,
        orderNumber: "MR-2023-005",
        customerName: "Informatikai Megoldások Zrt.",
        orderDate: "2023-11-18",
        status: "új",
        totalAmount: 320000,
        currency: "HUF"
      }
    ]);
  }
};

export const useOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sortColumn, setSortColumn] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const savedItemsPerPage = localStorage.getItem('orderItemsPerPage');
    return savedItemsPerPage ? parseInt(savedItemsPerPage, 10) : 5;
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedOrders = await mockOrderService.getAllOrders();
      setOrders(fetchedOrders);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Rendezési logika
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prevDirection =>
        prevDirection === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Szűrt és rendezett megrendelések
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Rendezés
    if (sortColumn) {
      result.sort((a, b) => {
        let valueA = a[sortColumn];
        let valueB = b[sortColumn];

        // Speciális kezelés dátumokhoz és számokhoz
        if (sortColumn === 'orderDate') {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }

        if (['totalAmount', 'id'].includes(sortColumn)) {
          valueA = Number(valueA);
          valueB = Number(valueB);
        }

        // Rendezési irány
        return sortDirection === 'asc'
          ? (valueA > valueB ? 1 : valueA < valueB ? -1 : 0)
          : (valueA < valueB ? 1 : valueA > valueB ? -1 : 0);
      });
    }

    // Szűrés
    return result.filter(order =>
      (statusFilter === '' || order.status === statusFilter) &&
      (searchTerm === '' ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [orders, searchTerm, statusFilter, sortColumn, sortDirection]);

  // Oldalszámozás
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Elemek oldalanként frissítése
  const updateItemsPerPage = (value) => {
    const numberValue = Number(value);
    setItemsPerPage(numberValue);
    localStorage.setItem('orderItemsPerPage', numberValue.toString());
    setCurrentPage(1);
  };

  return {
    orders,
    setOrders,
    triggerRefresh,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filteredOrders,
    paginatedOrders,
    handleSort,
    updateItemsPerPage,
    loading,
    error
  };
};
