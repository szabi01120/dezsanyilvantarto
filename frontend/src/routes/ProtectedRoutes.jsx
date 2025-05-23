// src/routes/protectedRoutes.js
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import Quotation from '../pages/Quotation';
import Inventory from '../pages/Inventory';
import DeliveryNotes from '../pages/DeliveryNotes';

export const protectedRoutes = [
  {
    path: '/',
    component: Dashboard,
    exact: true,
  },
  {
    path: '/products',
    component: Products,
  },
  {
    path: '/inventory',
    component: Inventory,
  },
  {
    path: '/delivery-notes',
    component: DeliveryNotes,
  },
  {
    path: '/orders',
    component: Orders,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/quotation',
    component: Quotation,
  },
];
