// src/routes/index.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import Layout from '../components/Layout';
import { protectedRoutes } from './ProtectedRoutes';
import { publicRoutes } from './PublicRoutes';
import NotFound from '../pages/NotFound';

const Root = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Root />}>
        {/* Publikus útvonalak */}
        {publicRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <PublicRoute>
                <Component />
              </PublicRoute>
            }
          />
        ))}

        {/* Védett útvonalak */}
        {protectedRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            }
          />
        ))}

        {/* NotFound útvonal globálisan */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
