/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContextData } from './context/ContextProvider';

interface ProtectRouteProps {
  children?: ReactNode;
}

const ProtectRoute = ({ children }: ProtectRouteProps) => {
  const { user, fetchCurrentUser } = useContextData();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectRoute;
