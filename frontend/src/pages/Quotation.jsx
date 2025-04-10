import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import huLocale from 'date-fns/locale/hu';

// Minta termékadatok - később API-ból jönne
const sampleProducts = [
  { id: 1, name: 'Laptop Dell XPS 15', category: 'Elektronika', price: 589000, unit: 'db', tax: 27 },
  { id: 2, name: 'Microsoft Office 365', category: 'Szoftver', price: 39000, unit: 'licenc/év', tax: 27 },
  { id: 3, name: 'Vezeték nélküli egér', category: 'Kiegészítő', price: 12000, unit: 'db', tax: 27 },
  { id: 4, name: 'Full HD monitor 24"', category: 'Elektronika', price: 78000, unit: 'db', tax: 27 },
  { id: 5, name: 'SSD 1TB Samsung', category: 'Alkatrész', price: 45000, unit: 'db', tax: 27 },
  { id: 6, name: 'Weboldal fejlesztés', category: 'Szolgáltatás', price: 350000, unit: 'projekt', tax: 27 },
  { id: 7, name: 'SEO optimalizálás', category: 'Szolgáltatás', price: 120000, unit: 'hónap', tax: 27 },
  { id: 8, name: 'Irodai szék', category: 'Bútor', price: 65000, unit: 'db', tax: 27 },
  { id: 9, name: 'Rendszergazdai támogatás', category: 'Szolgáltatás', price: 25000, unit: 'óra', tax: 27 },
  { id: 10, name: 'Nyomtató HP LaserJet', category: 'Elektronika', price: 112000, unit: 'db', tax: 27 },
];

// Minta ügyfél adatok
const sampleCustomers = [
  { id: 1, name: 'Kovács Zrt.', email: 'info@kovacszrt.hu', taxNumber: '12345678-2-42', address: 'Budapest, Példa utca 1.', contactPerson: 'Kovács János', phone: '+36 30 123 4567' },
  { id: 2, name: 'Horváth és Társa Bt.', email: 'horvath@pelda.hu', taxNumber: '87654321-2-42', address: 'Debrecen, Minta körút 45.', contactPerson: 'Horváth Béla', phone: '+36 20 987 6543' },
  { id: 3, name: 'Digitális Megoldások Kft.', email: 'info@digimegoldasok.hu', taxNumber: '23456789-2-41', address: 'Szeged, Innovációs út 7.', contactPerson: 'Nagy Katalin', phone: '+36 30 456 7890' },
  { id: 4, name: 'Zöld Energia Kft.', email: 'kapcsolat@zoldenergia.hu', taxNumber: '34567890-2-43', address: 'Pécs, Napelem utca 12.', contactPerson: 'Kiss Gábor', phone: '+36 70 345 6789' },
];

// Árajánlat sablonok
const sampleTemplates = [
  { id: 1, name: 'Alap IT csomag', description: 'Irodai alapfelszerelés kezdő vállalkozásoknak' },
  { id: 2, name: 'Prémium IT infrastruktúra', description: 'Komplex IT rendszer középvállalatok számára' },
  { id: 3, name: 'Webfejlesztési csomag', description: 'Honlap és marketing szolgáltatások' },
  { id: 4, name: 'Iroda berendezés', description: 'Teljes irodai bútorzat és eszközök' },
];

const Quotation = () => {
  // State kezelés
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [quoteItems, setQuoteItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [quoteSettings, setQuoteSettings] = useState({
    validUntil: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 30 nap alapértelmezetten
    quoteNumber: `AJ-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    paymentTerms: '8 nap',
    deliveryTime: '2-3 hét',
    currency: 'HUF',
    discount: 0,
    note: '',
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    quantity: 1,
    unit: 'db',
    tax: 27,
    description: '',
  });

  // Szűrés
  useEffect(() => {
    const results = sampleProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm]);

  // Sablon kiválasztása
  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    if (template.id === 1) {
      // Alap IT csomag
      setQuoteItems([
        { ...sampleProducts[0], quantity: 1, discount: 0, description: 'Dell XPS 15 laptop, i7, 16GB RAM, 512GB SSD' },
        { ...sampleProducts[1], quantity: 1, discount: 0, description: 'Microsoft Office 365 Business' },
        { ...sampleProducts[2], quantity: 1, discount: 0, description: 'Logitech MX Master 3 vezeték nélküli egér' },
      ]);
    } else if (template.id === 2) {
      // Prémium csomag
      setQuoteItems([
        { ...sampleProducts[0], quantity: 3, discount: 5, description: 'Dell XPS 15 laptop, i7, 32GB RAM, 1TB SSD' },
        { ...sampleProducts[1], quantity: 3, discount: 10, description: 'Microsoft Office 365 Business Premium' },
        { ...sampleProducts[3], quantity: 3, discount: 0, description: 'Dell UltraSharp 27" 4K Monitor' },
        { ...sampleProducts[8], quantity: 10, discount: 15, description: '10 óra rendszergazdai támogatás' },
      ]);
    } else if (template.id === 3) {
      // Webfejlesztési csomag
      setQuoteItems([
        { ...sampleProducts[5], quantity: 1, discount: 0, description: 'Reszponzív weboldal fejlesztése Wordpress platformon' },
        { ...sampleProducts[6], quantity: 3, discount: 10, description: 'SEO optimalizálás 3 hónapos szolgáltatás' },
      ]);
    }
    setShowTemplates(false);
  };

  // Termék hozzáadása
  const addProduct = (product) => {
    const existingProductIndex = quoteItems.findIndex(item => item.id === product.id);
    if (existingProductIndex >= 0) {
      const updatedItems = [...quoteItems];
      updatedItems[existingProductIndex] = {
        ...updatedItems[existingProductIndex],
        quantity: updatedItems[existingProductIndex].quantity + 1
      };
      setQuoteItems(updatedItems);
    } else {
      setQuoteItems([...quoteItems, { ...product, quantity: 1, discount: 0, description: product.name }]);
    }
  };

  // Egyedi termék hozzáadása
  const addCustomProduct = () => {
    const newId = Math.max(0, ...quoteItems.map(item => item.id)) + 1;
    setQuoteItems([
      ...quoteItems,
      {
        id: newId,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        unit: newProduct.unit,
        tax: parseFloat(newProduct.tax),
        description: newProduct.description || newProduct.name,
        category: 'Egyedi',
        discount: 0,
      }
    ]);
    // State visszaállítása
    setNewProduct({
      name: '',
      price: 0,
      quantity: 1,
      unit: 'db',
      tax: 27,
      description: '',
    });
    setShowProductModal(false);
  };

  // Termék eltávolítása
  const removeProduct = (index) => {
    const updatedItems = quoteItems.filter((_, i) => i !== index);
    setQuoteItems(updatedItems);
  };

  // Termék mennyiség módosítása
  const updateQuantity = (index, quantity) => {
    const updatedItems = [...quoteItems];
    updatedItems[index] = { ...updatedItems[index], quantity: parseInt(quantity) || 0 };
    setQuoteItems(updatedItems);
  };

  // Termék kedvezmény módosítása
  const updateDiscount = (index, discount) => {
    const updatedItems = [...quoteItems];
    updatedItems[index] = { ...updatedItems[index], discount: parseFloat(discount) || 0 };
    setQuoteItems(updatedItems);
  };

  // Összegzés számítása
  const calculateTotals = () => {
    let subtotal = 0;
    let taxTotal = 0;
    let discountTotal = 0;

    quoteItems.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      const itemDiscount = itemSubtotal * (item.discount / 100);
      const afterDiscount = itemSubtotal - itemDiscount;
      const itemTax = afterDiscount * (item.tax / 100);

      subtotal += afterDiscount;
      taxTotal += itemTax;
      discountTotal += itemDiscount;
    });

    // Teljes ajánlatra vonatkozó kedvezmény
    const globalDiscount = subtotal * (quoteSettings.discount / 100);
    const afterGlobalDiscount = subtotal - globalDiscount;
    const total = afterGlobalDiscount + taxTotal;

    return {
      subtotal,
      taxTotal,
      discountTotal: discountTotal + globalDiscount,
      total
    };
  };

  const totals = calculateTotals();

  // Árajánlat PDF generálása (itt csak jelezzük)
  const generatePDF = () => {
    alert('PDF generálás...\nEgy valós implementációban itt a PDF dokumentumot generálnánk és letöltenénk');
    // Itt használhatnánk a jspdf, react-pdf vagy hasonló könyvtárat
  };

  // Árajánlat e-mailben küldése (itt csak jelezzük)
  const sendByEmail = () => {
    alert(`E-mail küldése ${selectedCustomer?.email} címre...\nEgy valós implementációban itt küldené el az árajánlatot e-mailben`);
  };

  // Lépések tartalma
  const renderCurrentStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Ügyfél kiválasztása
            </h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Ügyfél keresése..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleCustomers.map(customer => (
                <div
                  key={customer.id}
                  className={`border p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedCustomer?.id === customer.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">{customer.name}</h3>
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      {selectedCustomer?.id === customer.id && '✓ Kiválasztva'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{customer.address}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Adószám: {customer.taxNumber}</p>
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Kapcsolattartó:</span> {customer.contactPerson}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">E-mail:</span> {customer.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Telefon:</span> {customer.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <button
                type="button"
                className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  if (selectedCustomer) {
                    setCurrentStep(2);
                  } else {
                    alert('Kérjük, válasszon ügyfelet!');
                  }
                }}
              >
                Tovább
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Termékek és szolgáltatások
              </h2>
              {!showTemplates && (
                <div className="mt-3 md:mt-0 space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setShowTemplates(!showTemplates)}
                  >
                    Ajánlat sablonok
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setShowProductModal(true)}
                  >
                    + Egyedi termék
                  </button>
                </div>
              )}
            </div>
            
            {showTemplates ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Válasszon sablont</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleTemplates.map(template => (
                    <div
                      key={template.id}
                      className="border p-4 rounded-lg cursor-pointer transition-colors border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                      onClick={() => selectTemplate(template)}
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={() => setShowTemplates(false)}
                >
                  Vissza
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-4">Termékek hozzáadása</h3>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Termék keresése..."
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="overflow-y-auto max-h-96">
                      <div className="grid grid-cols-1 gap-2">
                        {filteredProducts.map(product => (
                          <div
                            key={product.id}
                            className="border border-gray-200 dark:border-gray-700 p-3 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() => addProduct(product)}
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium text-gray-800 dark:text-white">{product.name}</h4>
                              <span className="text-gray-600 dark:text-gray-300 font-medium">
                                {product.price.toLocaleString()} Ft/{product.unit}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Kategória: {product.category}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-4">Árajánlat tartalma</h3>
                    {quoteItems.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-6">Még nem adott hozzá terméket az ajánlathoz</p>
                    ) : (
                      <div className="overflow-y-auto max-h-96">
                        <div className="space-y-3">
                          {quoteItems.map((item, index) => (
                            <div 
                              key={index} 
                              className="border border-gray-200 dark:border-gray-700 p-3 rounded relative"
                            >
                              <button
                                type="button"
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                onClick={() => removeProduct(index)}
                              >
                                ✕
                              </button>
                              <div className="pr-6">
                                <h4 className="font-medium text-gray-800 dark:text-white">{item.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <div className="flex-1 min-w-[120px]">
                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Ár ({quoteSettings.currency})</label>
                                    <input
                                      type="text"
                                      className="w-full p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      value={item.price.toLocaleString()}
                                      readOnly
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Mennyiség</label>
                                    <input
                                      type="number"
                                      min="1"
                                      className="w-full p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      value={item.quantity}
                                      onChange={(e) => updateQuantity(index, e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Egység</label>
                                    <input
                                      type="text"
                                      className="w-full p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      value={item.unit}
                                      readOnly
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Kedvezmény (%)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      className="w-full p-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      value={item.discount}
                                      onChange={(e) => updateDiscount(index, e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                  <span>ÁFA ({item.tax}%)</span>
                                  <span className="font-medium">
                                    {(item.price * item.quantity * (1 - item.discount / 100) * (item.tax / 100)).toLocaleString()} {quoteSettings.currency}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                  <span className="text-gray-700 dark:text-gray-300">Részösszeg:</span>
                                  <span className="text-gray-800 dark:text-white">
                                    {(item.price * item.quantity * (1 - item.discount / 100) * (1 + item.tax / 100)).toLocaleString()} {quoteSettings.currency}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>Nettó összesen:</span>
                        <span>{totals.subtotal.toLocaleString()} {quoteSettings.currency}</span>
                      </div>
                      {totals.discountTotal > 0 && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-300">
                          <span>Kedvezmény:</span>
                          <span>-{totals.discountTotal.toLocaleString()} {quoteSettings.currency}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>ÁFA:</span>
                        <span>{totals.taxTotal.toLocaleString()} {quoteSettings.currency}</span>
                      </div>
                      <div className="flex justify-between text-gray-800 dark:text-white font-bold mt-2 text-lg">
                        <span>Végösszeg:</span>
                        <span>{totals.total.toLocaleString()} {quoteSettings.currency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => setCurrentStep(1)}
                  >
                    Vissza
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                      if (quoteItems.length === 0) {
                        alert('Kérjük, adjon hozzá legalább egy terméket!');
                      } else {
                        setCurrentStep(3);
                      }
                    }}
                  >
                    Tovább
                  </button>
                </div>
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Árajánlat beállításai
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label htmlFor="quoteNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Árajánlat száma
                </label>
                <input
                  type="text"
                  id="quoteNumber"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={quoteSettings.quoteNumber}
                  onChange={(e) => setQuoteSettings({...quoteSettings, quoteNumber: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Érvényes eddig
                </label>
                <input
                  type="date"
                  id="validUntil"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={quoteSettings.validUntil}
                  onChange={(e) => setQuoteSettings({...quoteSettings, validUntil: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pénznem
                </label>
                <select
                  id="currency"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={quoteSettings.currency}
                  onChange={(e) => setQuoteSettings({...quoteSettings, currency: e.target.value})}
                >
                  <option value="HUF">HUF (Forint)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="USD">USD (Dollár)</option>
                </select>
              </div>
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teljes ajánlatra vonatkozó kedvezmény (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  min="0"
                  max="100"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={quoteSettings.discount}
                  onChange={(e) => setQuoteSettings({...quoteSettings, discount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fizetési feltételek
                </label>
                <select
                  id="paymentTerms"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={quoteSettings.paymentTerms}
                  onChange={(e) => setQuoteSettings({...quoteSettings, paymentTerms: e.target.value})}
                >
                  <option value="fizetés előre">Fizetés előre</option>
                  <option value="8 nap">8 napos fizetési határidő</option>
                  <option value="15 nap">15 napos fizetési határidő</option>
                  <option value="30 nap">30 napos fizetési határidő</option>
                </select>
              </div>
              <div>
                <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Szállítási idő
                </label>
                <select
                  id="deliveryTime"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={quoteSettings.deliveryTime}
                  onChange={(e) => setQuoteSettings({...quoteSettings, deliveryTime: e.target.value})}
                >
                  <option value="raktárkészletről">Azonnal (raktárkészletről)</option>
                  <option value="1-3 nap">1-3 munkanap</option>
                  <option value="1 hét">1 hét</option>
                  <option value="2-3 hét">2-3 hét</option>
                  <option value="1 hónap">1 hónap</option>
                  <option value="egyeztetés szerint">Egyeztetés szerint</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Megjegyzés
                </label>
                <textarea
                  id="note"
                  rows={4}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={quoteSettings.note}
                  onChange={(e) => setQuoteSettings({...quoteSettings, note: e.target.value})}
                  placeholder="Például: Az árak tartalmazzák a kiszállítás költségét."
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                onClick={() => setCurrentStep(2)}
              >
                Vissza
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setCurrentStep(4)}
              >
                Tovább
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Árajánlat előnézete
            </h2>
            
            {/* Előnézet */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between pb-6 border-b border-gray-200 dark:border-gray-700 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Árajánlat</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Szám: {quoteSettings.quoteNumber}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dátum: {format(new Date(), 'yyyy. MM. dd.', { locale: huLocale })}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Érvényesség: {format(new Date(quoteSettings.validUntil), 'yyyy. MM. dd.', { locale: huLocale })}</p>
                  </div>
                  <div className="mt-4 md:mt-0 md:text-right">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Dézsa Kft.</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">1111 Budapest, Példa utca 123.</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">info@dezsakft.hu</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">+36 1 234 5678</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Adószám: 12345678-2-42</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between pb-6 border-b border-gray-200 dark:border-gray-700 mb-6">
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-1">Ajánlattevő</h3>
                    <p className="font-medium text-gray-800 dark:text-white">{selectedCustomer?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedCustomer?.address}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Adószám: {selectedCustomer?.taxNumber}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-1">Kapcsolattartó</h3>
                    <p className="font-medium text-gray-800 dark:text-white">{selectedCustomer?.contactPerson}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedCustomer?.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedCustomer?.phone}</p>
                  </div>
                </div>

                <h3 className="font-medium text-gray-800 dark:text-white mb-3">Árajánlat részletei</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mb-4">
                    <thead>
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Termék/Szolgáltatás</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Egységár</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Menny.</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kedv. %</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ÁFA</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Összesen</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {quoteItems.map((item, index) => {
                        const subtotal = item.price * item.quantity;
                        const discount = subtotal * (item.discount / 100);
                        const afterDiscount = subtotal - discount;
                        const tax = afterDiscount * (item.tax / 100);
                        const total = afterDiscount + tax;
                        
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs">{item.description}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              {item.price.toLocaleString()} {quoteSettings.currency}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              {item.discount}%
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              {item.tax}%
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right">
                              {total.toLocaleString()} {quoteSettings.currency}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={5} scope="row" className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white text-right">
                          Részösszeg:
                        </th>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                          {totals.subtotal.toLocaleString()} {quoteSettings.currency}
                        </td>
                      </tr>
                      {(quoteSettings.discount > 0 || totals.discountTotal > 0) && (
                        <tr>
                          <th colSpan={5} scope="row" className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white text-right">
                            Kedvezmény:
                          </th>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                            -{totals.discountTotal.toLocaleString()} {quoteSettings.currency}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <th colSpan={5} scope="row" className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white text-right">
                          ÁFA:
                        </th>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                          {totals.taxTotal.toLocaleString()} {quoteSettings.currency}
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th colSpan={5} scope="row" className="px-4 py-2 text-base font-bold text-gray-900 dark:text-white text-right">
                          Végösszeg:
                        </th>
                        <td className="px-4 py-2 whitespace-nowrap text-base font-bold text-gray-900 dark:text-white text-right">
                          {totals.total.toLocaleString()} {quoteSettings.currency}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p><span className="font-medium">Fizetési feltételek:</span> {quoteSettings.paymentTerms}</p>
                  <p><span className="font-medium">Szállítási idő:</span> {quoteSettings.deliveryTime}</p>
                  {quoteSettings.note && (
                    <p><span className="font-medium">Megjegyzés:</span> {quoteSettings.note}</p>
                  )}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm">
                  <p>Köszönjük az érdeklődését! Várjuk visszajelzését az ajánlattal kapcsolatban.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-between gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                onClick={() => setCurrentStep(3)}
              >
                Vissza
              </button>
              
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={generatePDF}
                >
                  <span className="flex items-center">
                    <span className="mr-2">📄</span> PDF letöltése
                  </span>
                </button>
                
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={sendByEmail}
                >
                  <span className="flex items-center">
                    <span className="mr-2">📧</span> E-mailben küldés
                  </span>
                </button>
                
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span className="flex items-center">
                    <span className="mr-2">✓</span> Véglegesítés és mentés
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Egyedi termék modal
  const renderProductModal = () => {
    return (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
          <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="px-4 pt-5 pb-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Egyedi termék/szolgáltatás hozzáadása
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Megnevezés
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ár ({quoteSettings.currency})
                    </label>
                    <input
                      type="number"
                      id="price"
                      min="0"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mennyiség
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Egység
                    </label>
                    <select
                      id="unit"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                    >
                      <option value="db">db</option>
                      <option value="óra">óra</option>
                      <option value="nap">nap</option>
                      <option value="hónap">hónap</option>
                      <option value="alkalom">alkalom</option>
                      <option value="projekt">projekt</option>
                      <option value="csomag">csomag</option>
                      <option value="licenc">licenc</option>
                      <option value="db/hó">db/hó</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tax" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ÁFA (%)
                    </label>
                    <select
                      id="tax"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      value={newProduct.tax}
                      onChange={(e) => setNewProduct({...newProduct, tax: parseFloat(e.target.value)})}
                    >
                      <option value="27">27%</option>
                      <option value="18">18%</option>
                      <option value="5">5%</option>
                      <option value="0">0%</option>
                      <option value="AAM">AAM (adómentes)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Leírás
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={addCustomProduct}
              >
                Hozzáadás
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowProductModal(false)}
              >
                Mégsem
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Árajánlat készítő</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Készítsen professzionális árajánlatot ügyfelei számára néhány egyszerű lépésben.
          </p>
        </div>
        
        {/* Lépések folyamatjelző */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  currentStep >= 1 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`text-lg ${
                  currentStep >= 1 ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  1
                </span>
              </div>
              <div className={`ml-4 ${
                currentStep >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              }`}>
                <p className="text-sm font-medium">Ügyfél</p>
              </div>
            </div>
            <div className={`flex-1 border-t-2 mx-4 ${
              currentStep >= 2 ? 'border-blue-600 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'
            }`}></div>
            <div className="flex items-center">
              <div 
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  currentStep >= 2 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`text-lg ${
                  currentStep >= 2 ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  2
                </span>
              </div>
              <div className={`ml-4 ${
                currentStep >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              }`}>
                <p className="text-sm font-medium">Termékek</p>
              </div>
            </div>
            <div className={`flex-1 border-t-2 mx-4 ${
              currentStep >= 3 ? 'border-blue-600 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'
            }`}></div>
            <div className="flex items-center">
              <div 
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  currentStep >= 3 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`text-lg ${
                  currentStep >= 3 ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  3
                </span>
              </div>
              <div className={`ml-4 ${
                currentStep >= 3 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              }`}>
                <p className="text-sm font-medium">Beállítások</p>
              </div>
            </div>
            <div className={`flex-1 border-t-2 mx-4 ${
              currentStep >= 4 ? 'border-blue-600 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'
            }`}></div>
            <div className="flex items-center">
              <div 
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  currentStep >= 4 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`text-lg ${
                  currentStep >= 4 ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  4
                </span>
              </div>
              <div className={`ml-4 ${
                currentStep >= 4 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              }`}>
                <p className="text-sm font-medium">Áttekintés</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tartalomrész */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          {renderCurrentStep()}
        </div>
        
        {/* Egyedi termék modal */}
        {showProductModal && renderProductModal()}
      </div>
    </div>
  );
};

export default Quotation;