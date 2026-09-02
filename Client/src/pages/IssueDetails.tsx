import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContextData } from '../context/ContextProvider';

const IssueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchIssueDetails, updateIssue, deleteIssue } = useContextData();

  const [issue, setIssue] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
  });

  useEffect(() => {
    const loadDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchIssueDetails(id);
        if (data && data.success && data.issue) {
          setIssue(data.issue);
          setEditForm({
            title: data.issue.title || '',
            description: data.issue.description || '',
            priority: data.issue.priority || 'medium',
            status: data.issue.status || 'open',
          });
        } else {
          toast.error(data?.message || 'Issue not found or unauthorized.');
        }
      } catch {
        toast.error('Failed to fetch issue details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!editForm.title.trim() || !editForm.description.trim()) {
      toast.error('Title and Description cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      const data = await updateIssue(id, editForm);
      if (data.success) {
        toast.success('Issue updated successfully!');
        if (data.issue) {
          setIssue(data.issue);
        } else {
          setIssue({ ...issue, ...editForm });
        }
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Failed to update issue.');
      }
    } catch {
      toast.error('An error occurred while updating the issue.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this issue?')) {
      const data = await deleteIssue(id);
      if (data.success) {
        toast.success('Issue deleted successfully.');
        navigate('/');
      } else {
        toast.error(data.message || 'Failed to delete issue.');
      }
    }
  };

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
      <header className="navbar">
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: '#22c55e' }}>
            ❖ Mini Issue Tracker
          </Link>
        </div>
        <Link to="/" className="btn btn-secondary">
          ← Back to Dashboard
        </Link>
      </header>

      <main className="container" style={{ maxWidth: '800px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#a3a3a3' }}>
            Loading issue details...
          </div>
        ) : issue ? (
          <div className="card" style={{ padding: '2rem' }}>
            {!isEditing ? (
              /* Display View Mode */
              <div>
                <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
                  <div className="flex-gap">
                    <span className={`badge ${getStatusBadgeClass(issue.status)}`}>
                      {issue.status?.replace('_', ' ')}
                    </span>
                    <span className={`badge ${getPriorityBadgeClass(issue.priority)}`}>
                      {issue.priority} Priority
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#737373' }}>
                    Issue #{issue.id}
                  </span>
                </div>

                <h1 style={{ fontSize: '1.85rem', marginBottom: '1rem', color: '#ffffff' }}>
                  {issue.title}
                </h1>

                <div
                  style={{
                    backgroundColor: '#000000',
                    border: '1px solid #1f1f1f',
                    borderRadius: '6px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    color: '#d4d4d4',
                    whiteSpace: 'pre-wrap',
                    fontSize: '1rem',
                  }}
                >
                  {issue.description}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid #1c1c1c',
                    fontSize: '0.85rem',
                    color: '#737373',
                  }}
                >
                  <div>
                    Created: {issue.created_at ? new Date(issue.created_at).toLocaleString() : 'N/A'}
                  </div>
                  <div className="flex-gap">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-primary"
                    >
                      Edit Issue
                    </button>
                    <button onClick={handleDelete} className="btn btn-danger">
                      Delete Issue
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Form Mode */
              <form onSubmit={handleUpdate}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>Edit Issue #{issue.id}</h2>

                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    value={editForm.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    value={editForm.description}
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
                      value={editForm.priority}
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
                      value={editForm.status}
                      onChange={handleChange}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed / Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="flex-gap" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#a3a3a3' }}>Issue not found.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Back to Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default IssueDetails;
