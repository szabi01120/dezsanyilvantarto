// src/routes/publicRoutes.js
import Login from '../components/Login';
import NotFound from '../pages/NotFound';

export const publicRoutes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '*',
    component: NotFound,
  },
];
