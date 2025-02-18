import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from './ui/Spinner'; 

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={<Spinner />}>
      {children}
    </Suspense>
  );
};

export default React.memo(PublicRoute);