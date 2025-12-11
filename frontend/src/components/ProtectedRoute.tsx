// frontend/src/components/ProtectedRoute.tsx

import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Chuyển hướng tới trang Login
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Nếu đã xác thực, hiển thị nội dung route
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;