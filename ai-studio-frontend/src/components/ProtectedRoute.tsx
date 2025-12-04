import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setModalOpen } = useAuth();
  useEffect(() => {
    if (!user) setModalOpen(true);
  }, [user, setModalOpen]);
  if (!user) {
    return <Navigate to="/ai-studio" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
