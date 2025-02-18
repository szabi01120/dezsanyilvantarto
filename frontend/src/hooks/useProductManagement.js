import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductService } from '../services/productService';

export const useProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(() => {
        const savedItemsPerPage = localStorage.getItem('itemsPerPage');
        return savedItemsPerPage ? parseInt(savedItemsPerPage, 10) : 5;
    });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedProducts = await ProductService.getAllProducts();

            const formattedProducts = fetchedProducts.map(product => ({
                ...product,
                acquisitionDate: product.purchase_date,
                acquisitionPrice: product.purchase_price
            }));

            setProducts(formattedProducts);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }, []);

    // Módosított useEffect, most figyeli a refreshTrigger-t
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, refreshTrigger]);

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

    // Szűrt és rendezett termékek
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Rendezés
        if (sortColumn) {
            result.sort((a, b) => {
                let valueA = a[sortColumn];
                let valueB = b[sortColumn];

                // Speciális kezelés dátumokhoz és számokhoz
                if (sortColumn === 'acquisitionDate') {
                    valueA = new Date(valueA);
                    valueB = new Date(valueB);
                }

                if (['acquisitionPrice', 'quantity', 'id'].includes(sortColumn)) {
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
        return result.filter(product =>
            (typeFilter === '' || product.type === typeFilter) &&
            (searchTerm === '' ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.type.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [products, searchTerm, typeFilter, sortColumn, sortDirection]);

    // Oldalszámozás
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    // Elemek oldalanként frissítése
    const updateItemsPerPage = (value) => {
        const numberValue = Number(value);
        setItemsPerPage(numberValue);
        localStorage.setItem('itemsPerPage', numberValue.toString());
        setCurrentPage(1);
    };

    return {
        products,
        setProducts,
        triggerRefresh,
        sortColumn,
        setSortColumn,
        sortDirection,
        setSortDirection,
        searchTerm,
        setSearchTerm,
        typeFilter,
        setTypeFilter,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        filteredProducts,
        paginatedProducts,
        handleSort,
        updateItemsPerPage
    };
};
