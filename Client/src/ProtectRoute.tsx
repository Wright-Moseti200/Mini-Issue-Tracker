import { type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContextData } from './context/ContextProvider';

const ProtectRoute = ({ children }: { children?: ReactNode }) => {
  const { user, checkingAuth } = useContextData();

  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#a3a3a3' }}>
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectRoute;
