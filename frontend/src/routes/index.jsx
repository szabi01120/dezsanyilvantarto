// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import { protectedRoutes } from './protectedRoutes';
import { publicRoutes } from './publicRoutes';

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Publikus útvonalak */}
        {publicRoutes.map(({ path, component: Component }) => (
          <Route 
            key={path} 
            path={path} 
            element={<Component />} 
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
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
