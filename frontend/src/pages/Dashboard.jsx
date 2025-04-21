import React from 'react';
import axios from '../utils/axios';
import { useState, useEffect, useRef } from 'react';
import { ProductService } from '../services/productService';
// Importok
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// ChartJS regisztráció
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Időszak-választó komponens
const PeriodSelector = ({ activePeriod, onChange }) => {
  const periods = [
    { id: 'day', label: 'Napi' },
    { id: 'week', label: 'Heti' },
    { id: 'month', label: 'Havi' },
    { id: 'year', label: 'Éves' },
  ];

  return (
    <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      {periods.map((period) => (
        <button
          key={period.id}
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            activePeriod === period.id
              ? 'bg-white dark:bg-gray-800 shadow text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
          }`}
          onClick={() => onChange(period.id)}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

// Cél-teljesítés (Goal Progress) komponens
const GoalProgress = () => {
  const goals = [
    { name: 'Havi bevétel', current: 4200000, target: 5000000, unit: 'Ft', color: 'blue' },
    { name: 'Új ügyfelek', current: 28, target: 50, unit: 'ügyfél', color: 'green' },
    { name: 'Értékesítés', current: 342, target: 400, unit: 'db', color: 'purple' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Cél teljesítés (Havi)</h2>
      <div className="space-y-5">
        {goals.map((goal, idx) => {
          const percentage = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{goal.name}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    goal.color === 'blue' ? 'bg-blue-600' :
                    goal.color === 'green' ? 'bg-green-600' :
                    'bg-purple-600'
                  }`} 
                  style={{ width: `${percentage}%` }}>
                </div>
              </div>
              <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                {percentage}% teljesítve
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Kedvenc termékek komponens szívezhetők
const FavoriteProducts = ({ products }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Vegyünk maximum 5 terméket példának
      const productSample = products.slice(0, 5).map(product => ({
        id: product.id,
        name: product.name,
        favorite: Math.random() > 0.5, // Véletlenszerűen kedvenc vagy sem
        price: `${product.purchase_price.toLocaleString()} ${product.currency}`,
        stock: product.quantity
      }));
      setFavorites(productSample);
    }
  }, [products]);

  const toggleFavorite = (id) => {
    setFavorites(favorites.map(product => 
      product.id === id ? {...product, favorite: !product.favorite} : product
    ));
  };

  if (favorites.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Kiemelt Termékek</h2>
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Betöltés...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Kiemelt Termékek</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Termék</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ár</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Készlet</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kedvenc</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {favorites.map((product) => (
              <tr key={product.id} className={!product.favorite ? 'opacity-60' : ''}>
                <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">{product.name}</td>
                <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{product.price}</td>
                <td className="px-3 py-2.5 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.stock <= 5 ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                    product.stock <= 10 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {product.stock} db
                  </span>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap text-right">
                  <button 
                    onClick={() => toggleFavorite(product.id)} 
                    className={`text-xl ${product.favorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                    {product.favorite ? '❤️' : '🤍'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [realName, setRealName] = useState(null);
  const [showData, setShowData] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    lowStock: 0, 
    types: {}
  });
  
  // Adatok lekérése
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // API felhasználói adatok
        const userResponse = await axios.get('/users/');
        setData(userResponse.data.data.users[1].username);
        setRealName(userResponse.data.data.users[0].real_name);

        // Termék adatok
        const productsResponse = await ProductService.getAllProducts();
        setProducts(productsResponse);
        
        // Statisztikák számolása
        calculateProductStats(productsResponse);
        
        setLoading(false);
      } catch (error) {
        console.error('Hiba történt az adatok lekérésekor:', error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Termék statisztikák számolása a valós adatok alapján
  const calculateProductStats = (products) => {
    if (!products || products.length === 0) return;

    // Típusok számolása
    const types = {};
    let lowStockCount = 0;
    
    products.forEach(product => {
      // Típusok számolása
      if (!types[product.type]) {
        types[product.type] = 1;
      } else {
        types[product.type]++;
      }
      
      // Alacsony készlet számolása
      if (product.quantity <= 5) {
        lowStockCount++;
      }
    });
    
    setProductStats({
      totalProducts: products.length,
      lowStock: lowStockCount,
      types: types
    });
  };
  
  // Típus-statisztikák létrehozása a kördiagramhoz a valós adatokból
  const createCategoryChartData = () => {
    const types = productStats.types;
    const typeNames = Object.keys(types);
    
    // Ha nincs elég típus, akkor maradnak az alapértelmezett adatok
    if (typeNames.length < 3) {
      return {
        labels: ['Elektronika', 'Mobileszköz', 'Egyéb'],
        datasets: [{
          data: [35, 45, 20],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)'
          ],
          borderWidth: 1,
        }]
      };
    }
    
    // Valós adatokból építjük fel
    const total = Object.values(types).reduce((sum, count) => sum + count, 0);
    const percentages = typeNames.map(type => Math.round((types[type] / total) * 100));
    
    const colors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
    ];
    
    return {
      labels: typeNames,
      datasets: [{
        data: percentages,
        backgroundColor: typeNames.map((_, idx) => colors[idx % colors.length]),
        borderWidth: 1,
      }]
    };
  };
  
  // Termék-teljesítmény grafikonadatok létrehozása a valós adatokból
  const createProductPerformanceData = () => {
    if (products.length < 5) {
      // Alapértelmezett adatok, ha nincs elég termék
      return {
        labels: ['Laptop', 'Telefon', 'Monitor', 'Billentyűzet', 'Egér'],
        datasets: [{
          label: 'Mennyiség (db)',
          data: [128, 243, 156, 87, 124],
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
        }]
      };
    }
    
    // Top 5 termék a mennyiség alapján
    const topProducts = [...products]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
      
    return {
      labels: topProducts.map(p => p.name),
      datasets: [{
        label: 'Mennyiség (db)',
        data: topProducts.map(p => p.quantity),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      }]
    };
  };
  
  // Dinamikusan létrehozott kategória diagram adatok
  const categoryData = createCategoryChartData();
  
  // Dinamikusan létrehozott termék teljesítmény adatok
  const productPerformance = createProductPerformanceData();
  
  // Eladási és előrejelzési adatok (ezeket megtartjuk példaként)
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Eladások (millió Ft)',
        data: [3.2, 2.8, 4.1, 3.9, 5.2, 4.7, 6.1, 5.8, 6.5, 7.2, 6.9, 8.1],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Előrejelzés',
        data: [3.0, 2.5, 3.8, 4.2, 5.5, 5.0, 6.3, 6.1, 7.0, 7.8, 7.3, 8.5],
        borderColor: 'rgba(156, 163, 175, 0.7)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
      }
    ],
  };
  
  // Konverziós adatok (megtartjuk példaként)
  const conversionData = {
    labels: ['Látogatás', 'Érdeklődés', 'Kosárba', 'Vásárlás'],
    datasets: [
      {
        label: 'Konverzió',
        data: [1000, 750, 420, 210],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Alacsony készletű termékek listája
  const getLowStockProducts = () => {
    if (!products || products.length === 0) return [];
    
    return products
      .filter(p => p.quantity <= 5)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 4);
  };

  const lowStockProducts = getLowStockProducts();

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-10">      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Üdvözlő szekció és keresés */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Üdvözöljük, {realName || 'Felhasználó'}!</h1>
            <p className="text-gray-600 dark:text-gray-300">Nézze át az ERP rendszerét és kezelje vállalkozását egyszerűen.</p>
          </div>
        </div>
        
        {/* KPI Kártyák - részben valós adatokkal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { title: 'Aktív Termékek', value: `${productStats.totalProducts}`, change: '+8.1%', trend: 'up', icon: '📦', color: 'blue' },
            { title: 'Havi Bevétel', value: '4.2M Ft', change: '+12.4%', trend: 'up', icon: '💰', color: 'green' },
            { title: 'Raktárkészlet', value: '86%', change: '-2.3%', trend: 'down', icon: '🏭', color: 'yellow' },
            { title: 'Alacsony Készlet', value: `${productStats.lowStock}`, change: '+5', trend: 'up', icon: '📋', color: 'red' }
          ].map((item, i) => (
            <div key={i} className={`bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200`}>
              <div className="flex items-center justify-between mb-1">
                <div className={`p-2 rounded-lg bg-${item.color}-100 dark:bg-gray-700 text-${item.color}-600 dark:text-${item.color}-400 text-xl`}>
                  {item.icon}
                </div>
                <span className={`text-sm font-medium inline-flex items-center ${
                  item.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.change} 
                  {item.trend === 'up' ? '↑' : '↓'}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-800 dark:text-white mt-2">{item.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
            </div>
          ))}
        </div>
        
        {/* Időszak választó az eladási grafikonhoz */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 md:mb-0">
            Teljesítmény Áttekintés
          </h2>
          <PeriodSelector activePeriod={selectedPeriod} onChange={setSelectedPeriod} />
        </div>
        
        {/* Grafikonok sor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Eladások grafikon */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Havi Eladások (millió Ft)</h2>
            <div className="h-64">
              <Line data={salesData} options={{ 
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { 
                    beginAtZero: true,
                    grid: {
                      display: true,
                      color: 'rgba(156, 163, 175, 0.15)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                },
                plugins: {
                  legend: { 
                    display: true,
                    position: 'top',
                    labels: {
                      boxWidth: 12,
                      usePointStyle: true
                    }
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleFont: {
                      size: 13,
                    },
                    bodyFont: {
                      size: 12
                    }
                  }
                },
                interaction: {
                  mode: 'index',
                  intersect: false
                }
              }} />
            </div>
          </div>
          
          {/* Konverziós vizualizáció */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Értékesítési tölcsér</h2>
            <div className="h-64 flex items-center justify-center">
              <Bar 
                data={conversionData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { 
                      beginAtZero: true,
                      grid: {
                        display: true,
                        color: 'rgba(156, 163, 175, 0.15)'
                      }
                    }
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    }
                  }
                }} 
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[
                { label: 'Látogatás', value: '1000', percent: '100%' },
                { label: 'Érdeklődés', value: '750', percent: '75%' },
                { label: 'Kosárba', value: '420', percent: '42%' },
                { label: 'Vásárlás', value: '210', percent: '21%' },
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{step.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{step.label}</p>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{step.percent}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Célteljesítés és Népszerű termékek - Népszerű termékek már valós adatokból */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GoalProgress />
          <FavoriteProducts products={products} />
        </div>
        
        {/* Legnépszerűbb termékek táblázat - valós adatokból */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Termék mennyiségek</h2>
          <div className="h-64">
            <Bar data={productPerformance} options={{ 
              maintainAspectRatio: false,
              scales: {
                y: { beginAtZero: true }
              },
              plugins: {
                legend: { display: false }
              }
            }} />
          </div>
        </div>
        
        {/* Készlet és tranzakciók sor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Alacsony készlet - valós adatokból */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">Alacsony Készleten</h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Kezelés</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Termék</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Készlet</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Státusz</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {lowStockProducts.length > 0 ? (
                    lowStockProducts.map(product => (
                      <tr key={product.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{product.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{product.quantity} db</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.quantity <= 3 
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                            {product.quantity <= 3 ? 'Kritikus' : 'Alacsony'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Nincsenek alacsony készletű termékek.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Legutóbbi tranzakciók */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">Legutóbbi Tevékenységek</h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Mind megtekintése</button>
            </div>
            
            <div className="space-y-3">
              {[
                { type: 'Eladás', name: 'Irodai Szék (ergonomikus)', amount: '45,000 Ft', time: '14:32', user: 'Kovács József' },
                { type: 'Visszavétel', name: 'Monitor LG 27"', amount: '89,000 Ft', time: '11:25', user: 'Nagy Eszter' },
                { type: 'Készlet', name: 'USB-C kábel 2m', amount: '+25 db', time: '09:18', user: 'Tóth Béla' },
                { type: 'Eladás', name: 'MacBook Pro M2', amount: '740,000 Ft', time: '08:45', user: 'Kiss Anna' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      item.type === 'Eladás' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 
                      item.type === 'Visszavétel' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {item.type === 'Eladás' ? '💸' : item.type === 'Visszavétel' ? '↩️' : '📦'}
                    </div>
                    <div>
                      <p className="text-gray-800 dark:text-white font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.type} • {item.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800 dark:text-white">{item.amount}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Gyorsparancsok */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { name: 'Új Termék', icon: '➕', color: 'blue' },
            { name: 'Értékesítés', icon: '💰', color: 'green' },
            { name: 'Készletfeltöltés', icon: '🚚', color: 'purple' },
            { name: 'Jelentések', icon: '📊', color: 'indigo' }
          ].map((action, i) => (
            <button key={i} className={`flex flex-col items-center justify-center p-4 rounded-lg bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition-all border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow`}>
              <div className="mb-2 p-3 text-2xl">
                {action.icon}
              </div>
              <span className="text-sm font-medium">{action.name}</span>
            </button>
          ))}
        </div>
        
        {/* Kategória megoszlás - valós adatokból */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8">
          <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Kategória Megoszlás</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={categoryData} options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' }
                },
                cutout: '70%'
              }} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                {categoryData.labels.map((label, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ 
                      backgroundColor: categoryData.datasets[0].backgroundColor[idx] 
                    }}></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {categoryData.datasets[0].data[idx]}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                        <div className="h-1.5 rounded-full" style={{ 
                          width: `${categoryData.datasets[0].data[idx]}%`,
                          backgroundColor: categoryData.datasets[0].backgroundColor[idx]
                        }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Eredeti gomb */}
        <div className="mt-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
          <button
            onClick={() => setShowData(!showData)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            API Adatok lekérése
          </button>
          {showData && (
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-300">API Felhasználónév: <b>{data}</b></p>
              <p className="text-gray-600 dark:text-gray-300">API Teljes név: <b>{realName}</b></p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
