// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import Layout from '../components/Layout';
import { protectedRoutes } from './ProtectedRoutes';
import { publicRoutes } from './PublicRoutes';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
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
          element={
            <NotFound />
          }
        />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
