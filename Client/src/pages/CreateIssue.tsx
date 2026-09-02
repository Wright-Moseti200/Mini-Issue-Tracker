import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useContextData } from '../context/ContextProvider';

const CreateIssue: React.FC = () => {
  const { createIssue } = useContextData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Both Title and Description are required.');
      return;
    }

    setLoading(true);
    try {
      const data = await createIssue(formData);
      if (data.success) {
        navigate('/');
      } else {
        setError(data.message || 'Failed to create issue.');
      }
    } catch {
      setError('An error occurred while creating the issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="navbar">
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: '#22c55e' }}>
            ❖ Mini Issue Tracker
          </Link>
        </div>
        <Link to="/" className="btn btn-secondary">
          Back to Issues
        </Link>
      </header>

      <main className="container" style={{ maxWidth: '700px' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create New Issue</h2>
          <p style={{ color: '#a3a3a3', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Fill out the details below to log a new task or problem
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Issue Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                placeholder="e.g. Fix authentication timeout bug"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                placeholder="Provide detailed information about the issue..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed / Resolved</option>
                </select>
              </div>
            </div>

            <div className="flex-gap" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <Link to="/" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Issue'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateIssue;
