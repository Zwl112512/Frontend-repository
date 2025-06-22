import { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/AdminUserList.css';

interface User {
  _id: string;
  username?: string;
  email?: string;
  role: 'user' | 'admin';
  isBanned?: boolean;
}

const AdminUserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.users || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const handleRoleChange = async (id: string, newRole: 'user' | 'admin') => {
    try {
      await api.put(`/users/${id}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    } catch {
      alert('Failed to update role');
    }
  };

  const toggleBan = async (id: string, isBanned = false) => {
    try {
      await api.put(`/users/${id}`, { isBanned: !isBanned });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBanned: !isBanned } : u))
      );
    } catch {
      alert('Failed to update status');
    }
  };

  const filtered = users.filter((u) => {
    const name = u.username || '';
    const mail = u.email || '';
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      mail.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="admin-container">
      <h1 className="admin-title">User Management</h1>

      <input
        className="admin-search"
        placeholder="Search by username or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-300 mb-2">
            Total: {filtered.length} users
          </p>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username || '-'}</td>
                    <td>{user.email || '-'}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value as 'user' | 'admin')
                        }
                        className="admin-select"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      {user.isBanned ? (
                        <span className="admin-status-banned">Banned</span>
                      ) : (
                        <span className="admin-status-active">Active</span>
                      )}
                    </td>
<td>
  <div className="admin-action-group">
    <button
      onClick={() => handleDelete(user._id)}
      className="admin-action-btn admin-action-delete"
    >
      Delete
    </button>
    <button
      onClick={() => toggleBan(user._id, user.isBanned)}
      className="admin-action-btn admin-action-ban"
    >
      {user.isBanned ? 'Unban' : 'Ban'}
    </button>
  </div>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="admin-page-btn"
            >
              Previous
            </button>
            <span>
              Page {page} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="admin-page-btn"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUserList;
