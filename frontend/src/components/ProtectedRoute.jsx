import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from './ui/Spinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); 

  // Ha még betölt a felhasználói állapot, mutassunk spinner-t
  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Suspense fallback={<Spinner />}>
      {children}
    </Suspense>
  );
};

export default React.memo(ProtectedRoute);