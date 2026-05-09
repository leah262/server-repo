import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { usersApi } from '../services/api';
import '../styles/forms.css';

function Info() {
  const { user, login } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveInfo = async () => {
    try {
      const updated = await usersApi.update(user.id, formData);
      const updatedUser = { ...user, ...updated };
      login(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setEditMode(false);
      alert('Information updated successfully');
    } catch (error) {
      alert('Failed to update information');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await usersApi.changePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
      alert('Password changed successfully');
    } catch (error) {
      console.error('Password change error:', error);
      alert('Failed to change password. Check your current password.');
    }
  };

  if (!user) return null;

  return (
    <div className="login-page">
      <div className="container form-container">
        <h2>My Information</h2>

        <div className="info-section">
          <h3>Personal Details</h3>
          {editMode ? (
            <div>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-buttons">
                <button onClick={handleSaveInfo} className="save-btn">Save</button>
                <button onClick={() => {
                  setEditMode(false);
                  setFormData({ name: user.name, email: user.email });
                }} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <button onClick={() => setEditMode(true)} className="edit-btn">Edit Information</button>
            </div>
          )}
        </div>

        <div className="info-section">
          <h3>Security</h3>
          {!showPasswordChange ? (
            <button onClick={() => setShowPasswordChange(true)} className="secondary-btn">
              Change Password
            </button>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Current Password:</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="save-btn">Change Password</button>
                <button type="button" onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }} className="cancel-btn">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Info;
