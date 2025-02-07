// src/routes/protectedRoutes.js
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Orders from '../pages/Orders';
// import Reports from '../pages/Reports';

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
    path: '/orders',
    component: Orders,
  },
  // {
  //   path: '/reports',
  //   component: Reports,
  // },
];
