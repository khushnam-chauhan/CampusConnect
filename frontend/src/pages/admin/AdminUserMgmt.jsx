import React, { useState, useEffect } from 'react';
import './AdminUserManagement.css';

const AdminUserManagement = ({ fetchUsers, updateUser, deleteUser, changeUserRole }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeUserId, setActiveUserId] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchUsers({
        role: roleFilter !== 'all' ? roleFilter : null,
        search: searchTerm || null
      });
      setUsers(response.data);
      setError(null);
      setSelectedUsers([]);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      await updateUser(userId, userData);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, ...userData } : user
      ));
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update user.');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
      } catch (err) {
        setError('Failed to delete user.');
        console.error(err);
      }
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await changeUserRole(userId, newRole);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError(`Failed to change user role to ${newRole}.`);
      console.error(err);
    }
  };

  const toggleUserDetails = (userId) => {
    setActiveUserId(activeUserId === userId ? null : userId);
    setEditingUser(null);
  };

  const startEditUser = (user) => {
    setEditingUser(user._id);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const handleFormSubmit = (e, userId) => {
    e.preventDefault();
    handleUpdateUser(userId, userForm);
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user._id));
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
      try {
        await Promise.all(selectedUsers.map(id => deleteUser(id)));
        setUsers(users.filter(user => !selectedUsers.includes(user._id)));
        setSelectedUsers([]);
      } catch (err) {
        setError('Failed to delete some users.');
        console.error(err);
      }
    }
  };

  const handleBulkChangeRole = async (newRole) => {
    if (window.confirm(`Are you sure you want to change the role of ${selectedUsers.length} users to ${newRole}?`)) {
      try {
        await Promise.all(selectedUsers.map(id => changeUserRole(id, newRole)));
        setUsers(users.map(user => 
          selectedUsers.includes(user._id) 
            ? { ...user, role: newRole } 
            : user
        ));
        setSelectedUsers([]);
      } catch (err) {
        setError(`Failed to change role to ${newRole} for some users.`);
        console.error(err);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const sortUsers = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    setUsers([...users].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    }));
  };

  return (
    <div className="admin-user-management">
      <h2>User Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="control-panel">
        <div className="filter-controls">
          <label>
            Role:
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Users</option>
              <option value="student">Students</option>
              <option value="employee">Employees</option>
              <option value="employer">Employers</option>
              <option value="admin">Admins</option>
            </select>
          </label>
          
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by name, email, or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          
          <button onClick={loadUsers} className="refresh-button">
            Refresh
          </button>
        </div>
        
        {selectedUsers.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedUsers.length} selected</span>
            <div className="bulk-role-change">
              <select 
                onChange={(e) => e.target.value && handleBulkChangeRole(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Change Role</option>
                <option value="student">Student</option>
                <option value="employee">Employee</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button onClick={handleBulkDelete} className="delete-button">
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="no-items">No users found.</div>
      ) : (
        <div className="user-list">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th onClick={() => sortUsers('name')}>
                  Name
                  {sortConfig.key === 'name' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => sortUsers('email')}>
                  Email
                  {sortConfig.key === 'email' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => sortUsers('role')}>
                  Role
                  {sortConfig.key === 'role' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => sortUsers('status')}>
                  Status
                  {sortConfig.key === 'status' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => sortUsers('createdAt')}>
                  Created
                  {sortConfig.key === 'createdAt' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <React.Fragment key={user._id}>
                  <tr className={`user-row ${user.status}`}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <button 
                        onClick={() => toggleUserDetails(user._id)} 
                        className="details-button"
                      >
                        {activeUserId === user._id ? 'Hide' : 'View'}
                      </button>
                      <button 
                        onClick={() => startEditUser(user)} 
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)} 
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {activeUserId === user._id && !editingUser && (
                    <tr className="details-row">
                      <td colSpan="7">
                        <div className="user-details">
                          <div className="detail-section">
                            <h4>User Information</h4>
                            <div className="detail-grid">
                              <div>
                                <p><strong>ID:</strong> {user._id}</p>
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                              </div>
                              <div>
                                <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>Status:</strong> {user.status}</p>
                              </div>
                            </div>
                          </div>
                          
                          {user.role === 'student' && user.studentInfo && (
                            <div className="detail-section">
                              <h4>Student Information</h4>
                              <div className="detail-grid">
                                <div>
                                  <p><strong>Roll Number:</strong> {user.studentInfo.rollNumber}</p>
                                  <p><strong>Department:</strong> {user.studentInfo.department}</p>
                                  <p><strong>Year:</strong> {user.studentInfo.year}</p>
                                </div>
                                <div>
                                  <p><strong>GPA:</strong> {user.studentInfo.gpa}</p>
                                  <p><strong>Graduation Year:</strong> {user.studentInfo.graduationYear}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {user.role === 'employee' && user.employeeInfo && (
                            <div className="detail-section">
                              <h4>Employee Information</h4>
                              <div className="detail-grid">
                                <div>
                                  <p><strong>Employee ID:</strong> {user.employeeInfo.employeeId}</p>
                                  <p><strong>Department:</strong> {user.employeeInfo.department}</p>
                                </div>
                                <div>
                                  <p><strong>Position:</strong> {user.employeeInfo.position}</p>
                                  <p><strong>Join Date:</strong> {new Date(user.employeeInfo.joinDate).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {user.role === 'employer' && user.employerInfo && (
                            <div className="detail-section">
                              <h4>Employer Information</h4>
                              <div className="detail-grid">
                                <div>
                                  <p><strong>Company:</strong> {user.employerInfo.companyName}</p>
                                  <p><strong>Industry:</strong> {user.employerInfo.industry}</p>
                                </div>
                                <div>
                                  <p><strong>Position:</strong> {user.employerInfo.position}</p>
                                  <p><strong>Verified:</strong> {user.employerInfo.isVerified ? 'Yes' : 'No'}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="detail-section">
                            <h4>Activity</h4>
                            <div className="detail-grid">
                              <div>
                                <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                                <p><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</p>
                              </div>
                              <div>
                                <p><strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                                <p><strong>Login Count:</strong> {user.loginCount || 0}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="role-change-section">
                            <h4>Change Role</h4>
                            <div className="role-buttons">
                              <button 
                                onClick={() => handleChangeRole(user._id, 'student')}
                                className={`role-button ${user.role === 'student' ? 'active' : ''}`}
                                disabled={user.role === 'student'}
                              >
                                Student
                              </button>
                              <button 
                                onClick={() => handleChangeRole(user._id, 'employee')}
                                className={`role-button ${user.role === 'employee' ? 'active' : ''}`}
                                disabled={user.role === 'employee'}
                              >
                                Employee
                              </button>
                              <button 
                                onClick={() => handleChangeRole(user._id, 'employer')}
                                className={`role-button ${user.role === 'employer' ? 'active' : ''}`}
                                disabled={user.role === 'employer'}
                              >
                                Employer
                              </button>
                              <button 
                                onClick={() => handleChangeRole(user._id, 'admin')}
                                className={`role-button ${user.role === 'admin' ? 'active' : ''}`}
                                disabled={user.role === 'admin'}
                              >
                                Admin
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {editingUser === user._id && (
                    <tr className="details-row">
                      <td colSpan="7">
                        <form onSubmit={(e) => handleFormSubmit(e, user._id)} className="edit-form">
                          <h4>Edit User</h4>
                          <div className="form-grid">
                            <div className="form-group">
                              <label htmlFor="name">Name</label>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={userForm.name}
                                onChange={handleFormChange}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="email">Email</label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={userForm.email}
                                onChange={handleFormChange}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="phone">Phone</label>
                              <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={userForm.phone}
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="status">Status</label>
                              <select
                                id="status"
                                name="status"
                                value={userForm.status}
                                onChange={handleFormChange}
                                required
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-actions">
                            <button type="submit" className="save-button">Save Changes</button>
                            <button type="button" onClick={cancelEdit} className="cancel-button">Cancel</button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;