/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';

export const Contextdata = createContext<any>(null);

export const useContextData = () => useContext(Contextdata);

const API_BASE_URL = 'http://localhost:5000/api';

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);

  // 1. Register (POST /api/register)
  const register = async (payload: any) => {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  };

  // 2. Login (POST /api/login)
  const login = async (payload: any) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) fetchCurrentUser();
    return data;
  };

  // 3. Logout (POST /api/logout)
  const logout = async () => {
    const res = await fetch(`${API_BASE_URL}/logout`, { method: 'POST' });
    const data = await res.json();
    if (data.success) setUser(null);
    return data;
  };

  // 4. Get Current User (GET /api/me)
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/me`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setUser(data.user);
      else setUser(null);
      return data;
    } catch {
      setUser(null);
    }
  };

  // 5. Get Issues (GET /api/issues)
  const fetchIssues = async () => {
    const res = await fetch(`${API_BASE_URL}/issues`, { credentials: 'include' });
    const data = await res.json();
    if (data.success) setIssues(data.userdata);
    return data;
  };

  // 6. Get Issue Details (GET /api/issues/:id)
  const fetchIssueDetails = async (id: any) => {
    const res = await fetch(`${API_BASE_URL}/issues/${id}`, { credentials: 'include' });
    return res.json();
  };

  // 7. Create Issue (POST /api/issues)
  const createIssue = async (payload: any) => {
    const res = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) fetchIssues();
    return data;
  };

  // 8. Update Issue (PUT /api/issues/:id)
  const updateIssue = async (id: any, payload: any) => {
    const res = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) fetchIssues();
    return data;
  };

  // 9. Delete Issue (DELETE /api/issues/:id)
  const deleteIssue = async (id: any) => {
    const res = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) fetchIssues();
    return data;
  };

  return (
    <Contextdata.Provider
      value={{
        user,
        issues,
        register,
        login,
        logout,
        fetchCurrentUser,
        fetchIssues,
        fetchIssueDetails,
        createIssue,
        updateIssue,
        deleteIssue,
      }}
    >
      {children}
    </Contextdata.Provider>
  );
};

export default ContextProvider;