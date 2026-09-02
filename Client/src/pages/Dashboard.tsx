import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContextData } from '../context/ContextProvider';

const Dashboard: React.FC = () => {
  const { user, issues, fetchIssues, logout, deleteIssue } = useContextData();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssues = async () => {
      await fetchIssues();
      setLoading(false);
    };
    loadIssues();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out.');
    navigate('/login');
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this issue?')) {
      const res = await deleteIssue(id);
      if (res?.success) {
        toast.success('Issue deleted successfully.');
      } else {
        toast.error(res?.message || 'Failed to delete issue.');
      }
    }
  };

  const filteredIssues = issues.filter((issue: any) => {
    const matchesSearch =
      issue.title?.toLowerCase().includes(search.toLowerCase()) ||
      issue.description?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || issue.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === 'all' || issue.priority?.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'badge-high';
      case 'medium':
        return 'badge-medium';
      default:
        return 'badge-low';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'badge-open';
      case 'in_progress':
      case 'in progress':
        return 'badge-in-progress';
      default:
        return 'badge-closed';
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <span style={{ fontSize: '1.5rem' }}>❖</span> Mini Issue Tracker
        </div>
        <div className="navbar-user">
          <span style={{ fontSize: '0.9rem', color: '#a3a3a3' }}>
            Logged in as <strong style={{ color: '#ffffff' }}>{user?.name || user?.email}</strong>
          </span>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem' }}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="container">
        <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Your Issues</h1>
            <p style={{ color: '#a3a3a3', fontSize: '0.9rem' }}>
              Manage and track project tasks and issues
            </p>
          </div>
          <Link to="/issues/new" className="btn btn-primary">
            + Create New Issue
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <div
          className="card"
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
          }}
        >
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search issues by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed / Resolved</option>
            </select>

            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Issues List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#a3a3a3' }}>
            Loading your issues...
          </div>
        ) : filteredIssues.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: 'center', padding: '3rem 1.5rem', borderColor: '#262626' }}
          >
            <h3 style={{ marginBottom: '0.5rem', color: '#a3a3a3' }}>No issues found</h3>
            <p style={{ color: '#737373', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              {issues.length === 0
                ? "You haven't created any issues yet."
                : 'No issues match your current filters.'}
            </p>
            {issues.length === 0 && (
              <Link to="/issues/new" className="btn btn-primary">
                Create First Issue
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredIssues.map((issue: any) => (
              <div
                key={issue.id}
                className="card"
                style={{ cursor: 'pointer', transition: 'border-color 0.2s ease' }}
                onClick={() => navigate(`/issues/${issue.id}`)}
              >
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                  <div className="flex-gap">
                    <span className={`badge ${getStatusBadgeClass(issue.status)}`}>
                      {issue.status?.replace('_', ' ')}
                    </span>
                    <span className={`badge ${getPriorityBadgeClass(issue.priority)}`}>
                      {issue.priority} priority
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#737373' }}>
                    ID: #{issue.id}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
                  {issue.title}
                </h3>
                <p
                  style={{
                    color: '#a3a3a3',
                    fontSize: '0.925rem',
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {issue.description}
                </p>

                <div className="flex-between" style={{ paddingTop: '0.75rem', borderTop: '1px solid #1c1c1c' }}>
                  <span style={{ fontSize: '0.8rem', color: '#737373' }}>
                    Created: {issue.created_at ? new Date(issue.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                  <div className="flex-gap" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/issues/${issue.id}`} className="btn btn-outline-green" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                      View / Edit
                    </Link>
                    <button
                      onClick={(e) => handleDelete(issue.id, e)}
                      className="btn btn-danger"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
