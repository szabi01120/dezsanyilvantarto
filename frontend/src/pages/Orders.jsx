import React, { useState, useEffect } from 'react';
import SortableHeader from '../components/products/SortableHeader';

// OrdersTableDesktop komponens - asztali nézethez hasonlóan a termékekhez
const OrdersTableDesktop = ({
  paginatedOrders,
  sortColumn,
  sortDirection,
  handleSort,
  onViewOrder,
  onEditOrder,
  onDeleteOrder
}) => {
  if (!paginatedOrders || paginatedOrders.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-4">
        Nincs megjeleníthető megrendelés.
      </div>
    );
  }

  // Státuszok színkódolása
  const getStatusColor = (status) => {
    const statusColors = {
      'új': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'folyamatban': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'teljesítve': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'törölt': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

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
            column="orderNumber"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Rendelésszám
          </SortableHeader>
          <SortableHeader
            column="customerName"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Ügyfél
          </SortableHeader>
          <SortableHeader
            column="orderDate"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Dátum
          </SortableHeader>
          <SortableHeader
            column="status"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Állapot
          </SortableHeader>
          <SortableHeader
            column="totalAmount"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          >
            Összeg
          </SortableHeader>
          <th className="px-4 py-3 text-left">Műveletek</th>
        </tr>
      </thead>
      <tbody>
        {paginatedOrders.map((order) => (
          <tr
            key={`order-${order.id}`}
            className="hidden md:table-row border-b border-gray-200 dark:border-gray-600 
               hover:bg-gray-50 dark:hover:bg-gray-700 
               transition duration-200"
          >
            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{order.id}</td>
            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
              {order.orderNumber}
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
              {order.customerName}
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
              {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
            </td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </td>
            <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
              {order.totalAmount
                ? `${Number(order.totalAmount).toLocaleString()} ${order.currency || 'Ft'}`
                : '0 Ft'}
            </td>
            <td className="px-4 py-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewOrder(order)}
                  className="text-gray-500 hover:text-gray-700 
                     dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Részletek
                </button>
                <button
                  onClick={() => onEditOrder(order)}
                  className="text-blue-500 hover:text-blue-700 
                     dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Szerkesztés
                </button>
                <button
                  onClick={() => onDeleteOrder(order)}
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

// OrdersTableMobile komponens - mobil nézethez a termékekhez hasonlóan
const OrdersTableMobile = ({ paginatedOrders, onViewOrder, onEditOrder, onDeleteOrder }) => {
  if (!paginatedOrders || paginatedOrders.length === 0) {
    return null;
  }

  // Státuszok színkódolása
  const getStatusColor = (status) => {
    const statusColors = {
      'új': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'folyamatban': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'teljesítve': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'törölt': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="md:hidden">
      {paginatedOrders.map((order) => (
        <div
          key={`order-mobile-${order.id}`}
          className="border-b border-gray-200 dark:border-gray-600 p-4"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {order.orderNumber}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.customerName}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Dátum:</span>
              <span className="ml-1 text-gray-800 dark:text-gray-200">
                {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Összeg:</span>
              <span className="ml-1 font-semibold text-green-600 dark:text-green-400">
                {order.totalAmount
                  ? `${Number(order.totalAmount).toLocaleString()} ${order.currency || 'Ft'}`
                  : '0 Ft'}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => onViewOrder(order)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded
                dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Részletek
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => onEditOrder(order)}
                className="text-blue-500 hover:text-blue-700 
                  dark:text-blue-400 dark:hover:text-blue-300"
              >
                Szerkesztés
              </button>
              <button
                onClick={() => onDeleteOrder(order)}
                className="text-red-500 hover:text-red-700 
                  dark:text-red-400 dark:hover:text-red-300"
              >
                Törlés
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// SearchAndFilterBar komponens a megrendelésekhez
const OrdersSearchAndFilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  setCurrentPage
}) => {
  // Lehetséges státuszok
  const statusOptions = ['új', 'folyamatban', 'teljesítve', 'törölt'];

  return (
    <div className="mb-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <input
        type="text"
        placeholder="Keresés megrendelések között..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full md:w-auto px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="">Minden állapot</option>
        {statusOptions.map(status => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

// OrderDetailModal komponens - Megrendelés részleteinek megjelenítéséhez
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Megrendelés részletei
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Megrendelés adatai</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Rendelésszám:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{order.orderNumber}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Dátum:</span>{' '}
                  <span className="text-gray-900 dark:text-white">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Állapot:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{order.status}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Összeg:</span>{' '}
                  <span className="text-gray-900 dark:text-white font-medium">
                    {Number(order.totalAmount).toLocaleString()} {order.currency || 'Ft'}
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Ügyfél adatai</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Név:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{order.customerName}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">E-mail:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{order.email || 'Nincs megadva'}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Telefon:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{order.phone || 'Nincs megadva'}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Cím:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{order.address || 'Nincs megadva'}</span>
                </p>
              </div>
            </div>
          </div>
          
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Megrendelt tételek</h3>
          <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Termék neve
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Mennyiség
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Egységár
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Összesen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                        {Number(item.unitPrice).toLocaleString()} {order.currency || 'Ft'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium text-right">
                        {Number(item.quantity * item.unitPrice).toLocaleString()} {order.currency || 'Ft'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                      Nincsenek tételek
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-right">
                    Összesen:
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white text-right">
                    {Number(order.totalAmount).toLocaleString()} {order.currency || 'Ft'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Bezárás
            </button>
            {order.status !== 'teljesítve' && order.status !== 'törölt' && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500">
                Állapot módosítása
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Fő komponens - Orders
const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [paginatedOrders, setPaginatedOrders] = useState([]);
  
  // Keresés és szűrés állapotai
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Rendezés állapotai
  const [sortColumn, setSortColumn] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Lapozás állapotai
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal állapota
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Minta megrendelések
  const sampleOrders = [
    {
      id: 1,
      orderNumber: "MR-2023-001",
      customerName: "Kovács Kft.",
      orderDate: "2023-11-05",
      status: "teljesítve",
      totalAmount: 235000,
      currency: "HUF",
      email: "info@kovacskft.hu",
      phone: "+36 30 123 4567",
      address: "1111 Budapest, Példa utca 1.",
      items: [
        { name: "Laptop Dell XPS", quantity: 1, unitPrice: 235000 }
      ]
    },
    {
      id: 2,
      orderNumber: "MR-2023-002",
      customerName: "Nagy és Társa Bt.",
      orderDate: "2023-11-10",
      status: "teljesítve",
      totalAmount: 85400,
      currency: "HUF",
      email: "info@nagybt.hu",
      phone: "+36 20 987 6543",
      address: "4025 Debrecen, Minta körút 12.",
      items: [
        { name: "Monitor 24\"", quantity: 2, unitPrice: 42700 }
      ]
    },
    {
      id: 3,
      orderNumber: "MR-2023-003",
      customerName: "Zöld Energia Kft.",
      orderDate: "2023-11-12",
      status: "folyamatban",
      totalAmount: 150000,
      currency: "HUF",
      email: "kapcsolat@zoldenergia.hu",
      phone: "+36 1 987 6543",
      address: "7621 Pécs, Energia út 45.",
      items: [
        { name: "Nyomtató HP LaserJet", quantity: 1, unitPrice: 120000 },
        { name: "Toner", quantity: 2, unitPrice: 15000 }
      ]
    },
    {
      id: 4,
      orderNumber: "MR-2023-004",
      customerName: "Global Trading Inc.",
      orderDate: "2023-11-15",
      status: "törölt",
      totalAmount: 1200,
      currency: "EUR",
      email: "contact@globaltrading.com",
      phone: "+1 123 456 7890",
      address: "New York, 5th Avenue",
      items: [
        { name: "Software License", quantity: 3, unitPrice: 400 }
      ]
    },
    {
      id: 5,
      orderNumber: "MR-2023-005",
      customerName: "Informatikai Megoldások Zrt.",
      orderDate: "2023-11-18",
      status: "új",
      totalAmount: 320000,
      currency: "HUF",
      email: "info@itcorp.hu",
      phone: "+36 30 111 2222",
      address: "1095 Budapest, IT utca 10.",
      items: [
        { name: "Server Dell PowerEdge", quantity: 1, unitPrice: 320000 }
      ]
    }
  ];

  // Adatok betöltése
  useEffect(() => {
    // Valós implementációban itt API hívás lenne
    setTimeout(() => {
      setOrders(sampleOrders);
      setLoading(false);
    }, 1000);
  }, []);

  // Szűrés és keresés
  useEffect(() => {
    let result = [...orders];

    // Szűrés státusz alapján
    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }

    // Keresés
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.orderNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
        order.customerName.toLowerCase().includes(lowerCaseSearchTerm) ||
        (order.items && order.items.some(item => item.name.toLowerCase().includes(lowerCaseSearchTerm)))
      );
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter]);

  // Rendezés
  useEffect(() => {
    // Objektum másolása rendezéshez
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      // Nullák kezelése
      if (a[sortColumn] === null) return 1;
      if (b[sortColumn] === null) return -1;
      if (a[sortColumn] === null && b[sortColumn] === null) return 0;

      // Különböző típusú adatok összehasonlítása
      if (sortColumn === 'orderDate') {
        const dateA = new Date(a[sortColumn]);
        const dateB = new Date(b[sortColumn]);
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Számok és stringek összehasonlítása
      if (typeof a[sortColumn] === 'number') {
        return sortDirection === 'asc' ? a[sortColumn] - b[sortColumn] : b[sortColumn] - a[sortColumn];
      } else {
        const valueA = a[sortColumn].toString().toLowerCase();
        const valueB = b[sortColumn].toString().toLowerCase();
        return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
    });

    // Rendezett és lapozott adatok beállítása
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedOrders.slice(startIndex, startIndex + itemsPerPage);

    setPaginatedOrders(paginatedData);
  }, [filteredOrders, sortColumn, sortDirection, currentPage, itemsPerPage]);

  // Lapozás
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    setPaginatedOrders(paginatedData);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Rendezés kezelése
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Elemek száma oldalanként kezelése
  const updateItemsPerPage = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Új megrendelés hozzáadása
  const handleAddOrder = () => {
    // Új megrendelés hozzáadásának logikája - implementálandó
    alert('Új megrendelés hozzáadása funkció még fejlesztés alatt.');
  };

  // Megrendelés megtekintése
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  // Megrendelés szerkesztése
  const handleEditOrder = (order) => {
    // Szerkesztés logikája - implementálandó
    alert(`Megrendelés szerkesztése: ${order.orderNumber}`);
  };

  // Megrendelés törlése
  const handleDeleteOrder = (order) => {
    // Törlés logikája - implementálandó
    if (window.confirm(`Biztosan törli a következő megrendelést: ${order.orderNumber}?`)) {
      alert(`Megrendelés törölve: ${order.orderNumber}`);
    }
  };

  // Betöltő animáció
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">
          Megrendelések
        </h1>
        <button
          onClick={handleAddOrder}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded 
           hover:bg-blue-600 transition duration-200 
           dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <span className="hidden sm:inline">Új megrendelés</span>
          <span className="sm:hidden">+ Új megrendelés</span>
        </button>
      </div>

      <div className="p-6">
        <OrdersSearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setCurrentPage={setCurrentPage}
        />
        
        <OrdersTableDesktop
          paginatedOrders={paginatedOrders}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSort={handleSort}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
        />
        
        <OrdersTableMobile
          paginatedOrders={paginatedOrders}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
        />
      </div>
      
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-300">Megrendelések oldalanként:</span>
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
              prev < Math.ceil(filteredOrders.length / itemsPerPage)
                ? prev + 1
                : prev
            )}
            disabled={currentPage >= Math.ceil(filteredOrders.length / itemsPerPage)}
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
      
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

export default Orders;
