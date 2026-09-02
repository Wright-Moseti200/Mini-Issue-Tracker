import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ContextProvider from './context/ContextProvider';
import ProtectRoute from './ProtectRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateIssue from './pages/CreateIssue';
import IssueDetails from './pages/IssueDetails';

const App: React.FC = () => {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/issues/new" element={<CreateIssue />} />
            <Route path="/issues/:id" element={<IssueDetails />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
};

export default App;