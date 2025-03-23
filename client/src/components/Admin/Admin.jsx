import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Updated URL with correct port 3000
      const response = await axios.get('http://localhost:3000/admin-api/userauthors');
      
      const allUsers = response.data.payload || [];
      console.log(allUsers);
      
      // Filter out admin users first
      const nonAdminUsers = allUsers.filter(user => user.role?.toLowerCase() !== 'admin');
      
      // Then filter by active status
      const active = nonAdminUsers.filter(user => user.isActive !== false);
      const blocked = nonAdminUsers.filter(user => user.isActive === false);
      
      setUsers(active);
      setBlockedUsers(blocked);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
      setLoading(false);
    }
  };

  const handleToggleStatus = async (email, newActiveStatus) => {
    try {
      // No authentication required
      const data = encodeURIComponent(email);
      console.log(data);
      // Changed from status to isActive in the request body
      await axios.put(`http://localhost:3000/admin-api/userauthors/${data}/status`,
        { isActive: newActiveStatus }
      );
          
      // Refresh users after status change
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Failed to update user status. Please try again.');
    }
  };
  return (
    <div className="bg-{#1c1b1a} min-vh-100">
      {/* Admin Navbar */}
      <nav className="navbar navbar-dark order-secondary mb-4">
        <div className="container">
          <h1 className="navbar-brand fw-bold">Admin</h1>
        </div>
      </nav>

      {/* User Management Section */}
      <div className="container">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError(null)}></button>
          </div>
        )}

        <div className="mb-4">
          <ul className="nav nav-tabs border-bottom border-secondary">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'users' ? 'active text-warning' : 'text-secondary'}`}
                onClick={() => setActiveTab('users')}
              >
                Users ({users.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'blocked' ? 'active text-warning' : 'text-secondary'}`}
                onClick={() => setActiveTab('blocked')}
              >
                Blocked Users ({blockedUsers.length})
              </button>
            </li>
          </ul>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-light mt-2">Loading users...</p>
          </div>
        ) : (
          <div>
            {activeTab === 'users' ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 text-light mb-0">Active Users</h2>
                  <button 
                    onClick={fetchUsers} 
                    className="btn btn-outline-light btn-sm"
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                  </button>
                </div>
                
                {users.length === 0 ? (
                  <p className="text-secondary">No active users found.</p>
                ) : (
                  <div className="card bg-dark border-secondary">
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-dark table-hover table-striped mb-0">
                          <thead>
                            <tr>
                              <th className="text-uppercase small">Name</th>
                              <th className="text-uppercase small">Email</th>
                              <th className="text-uppercase small">Role</th>
                              <th className="text-uppercase small">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map(user => (
                              <tr key={user._id}>
                                <td>{user.firstName || user.name || 'N/A'}</td>
                                <td>{user.email}</td>
                                <td>
                                  <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                    {user.role || 'user'}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleToggleStatus(user.email, false)}
                                    className="btn btn-sm btn-danger"
                                    disabled={loading}
                                  >
                                    Block
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 text-light mb-0">Blocked Users</h2>
                  <button 
                    onClick={fetchUsers} 
                    className="btn btn-outline-light btn-sm"
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                  </button>
                </div>
                
                {blockedUsers.length === 0 ? (
                  <p className="text-secondary">No blocked users found.</p>
                ) : (
                  <div className="card bg-dark border-secondary">
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-dark table-hover table-striped mb-0">
                          <thead>
                            <tr>
                              <th className="text-uppercase small">Name</th>
                              <th className="text-uppercase small">Email</th>
                              <th className="text-uppercase small">Role</th>
                              <th className="text-uppercase small">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {blockedUsers.map(user => (
                              <tr key={user._id}>
                                <td>{user.firstName || user.name || 'N/A'}</td>
                                <td>{user.email}</td>
                                <td>
                                  <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                    {user.role || 'user'}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleToggleStatus(user.email, true)}
                                    className="btn btn-sm btn-success"
                                    disabled={loading}
                                  >
                                    Unblock
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get appropriate badge class based on role
function getRoleBadgeClass(role) {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'bg-danger';
    case 'author':
      return 'bg-primary';
    case 'editor':
      return 'bg-info';
    case 'reader':
      return 'bg-success';
    default:
      return 'bg-secondary';
  }
}

export default Admin;