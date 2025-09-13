// API Base Configuration
import apiService from './api.js';
// const API_BASE = 'http://localhost:5001/api';
const API_BASE = 'https://pixel-vault-ct82.onrender.com/api';
class AuthService {
  constructor() {
    this.token = null;
    this.user = null;
    this.initializeFromStorage();
  }

  // Initialize service from localStorage
  initializeFromStorage() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        this.user = parsedData;
        this.token = parsedData.token;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearStorage();
      }
    }
  }

  // Make authenticated API requests
  async apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle 401 responses by clearing auth data
      if (response.status === 401) {
        this.clearAuth();
        throw new Error('Session expired. Please login again.');
      }

      // Handle other HTTP errors
      if (!response.ok && !data.success) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      // Network errors or other issues
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  }

  // Register new user
  async register(username, email, password, confirmPassword) {
    try {
      // Client-side validation
      if (!username || !email || !password || !confirmPassword) {
        throw new Error('All fields are required');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await this.apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password
        })
      });

      if (response.success) {
        this.setAuthData(response.user);
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message };
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Client-side validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const response = await this.apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      });

      if (response.success) {
        this.setAuthData(response.user);
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  }

  // Google OAuth login
  // Replace the existing googleLogin method with this:
  // Google OAuth login
  async googleLogin(idToken) {
    try {
      if (!idToken) {
        throw new Error('Google ID token is required');
      }
  
      const response = await this.apiRequest('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential: idToken })
      });
  
      if (response.success) {
        this.setAuthData(response.user);
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, message: error.message };
    }
  }
  

  // Get current user
  async getCurrentUser() {
    try {
      if (!this.token) {
        throw new Error('No authentication token found');
      }

      // Check if token is expired
      if (this.isTokenExpired()) {
        throw new Error('Token has expired');
      }

      const response = await this.apiRequest('/auth/me');
      
      if (response.success) {
        // Update stored user data with fresh info
        const updatedUser = { ...this.user, ...response.user };
        this.setAuthData(updatedUser);
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Failed to get current user');
      }
    } catch (error) {
      console.error('Get current user error:', error);
      this.clearAuth();
      return { success: false, message: error.message };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword, confirmNewPassword) {
    try {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        throw new Error('All fields are required');
      }

      if (newPassword !== confirmNewPassword) {
        throw new Error('New passwords do not match');
      }

      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      const response = await this.apiRequest('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      return response;
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: error.message };
    }
  }

  // Logout user
  logout() {
    this.clearAuth();
    return { success: true, message: 'Logged out successfully' };
  }

  // Set authentication data
  setAuthData(user) {
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: user.token,
      loginTime: Date.now()
    };

    this.user = userData;
    this.token = user.token;
    localStorage.setItem('user', JSON.stringify(userData));
  }

  // Clear authentication data
  clearAuth() {
    this.user = null;
    this.token = null;
    this.clearStorage();
  }

  // Clear localStorage
  clearStorage() {
    localStorage.removeItem('user');
  }

  // Update user data (after profile updates)
  updateUserData(updates) {
    if (!this.user) return false;

    const updatedData = {
      ...this.user,
      ...updates,
      token: this.user.token // Keep the token
    };

    this.user = updatedData;
    localStorage.setItem('user', JSON.stringify(updatedData));
    return true;
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!(this.token && this.user && !this.isTokenExpired());
  }

  // Get current user
  getUser() {
    return this.user;
  }

  // Get current token
  getToken() {
    return this.token;
  }

  // Check user role
  hasRole(role) {
    return this.user?.role === role;
  }

  // Role helper functions
  isAdmin() {
    return this.hasRole('Admin');
  }

  isEditor() {
    return this.hasRole('Editor');
  }

  isVisitor() {
    return this.hasRole('Visitor');
  }

  isEditorOrAdmin() {
    return this.isEditor() || this.isAdmin();
  }

  // Check if user can edit a resource
  canEdit(resourceOwnerId = null) {
    if (!this.user) return false;
    
    // Admin can edit everything
    if (this.user.role === 'Admin') return true;
    
    // Owner can edit their own content
    if (resourceOwnerId && this.user.id === resourceOwnerId) return true;
    
    // Editor can edit if no specific owner is set
    if (!resourceOwnerId && (this.user.role === 'Editor' || this.user.role === 'Admin')) return true;
    
    return false;
  }

  // Check if user can upload
  canUpload() {
    return this.isEditorOrAdmin();
  }

  // Check if user can create albums
  canCreateAlbums() {
    return this.isEditorOrAdmin();
  }

  // Check if user can delete
  canDelete(resourceOwnerId = null) {
    if (!this.user) return false;
    
    // Admin can delete everything
    if (this.user.role === 'Admin') return true;
    
    // Owner can delete their own content
    if (resourceOwnerId && this.user.id === resourceOwnerId) return true;
    
    return false;
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    const errors = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (!/[A-Za-z]/.test(password)) {
      errors.push('Password must contain at least one letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check token expiration
  isTokenExpired() {
    if (!this.token) return true;

    try {
      // JWT tokens have 3 parts separated by dots
      const tokenParts = this.token.split('.');
      if (tokenParts.length !== 3) return true;

      // Decode the payload (second part)
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Check if token is expired (with 5 minute buffer)
      const now = Date.now() / 1000;
      const buffer = 5 * 60; // 5 minutes
      return payload.exp < (now + buffer);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Get user role display name
  getRoleDisplay() {
    switch (this.user?.role) {
      case 'Admin':
        return 'Administrator';
      case 'Editor':
        return 'Editor';
      case 'Visitor':
        return 'Visitor';
      default:
        return 'Unknown';
    }
  }

  // Auto-refresh token if needed
  async checkAndRefreshToken() {
    if (this.isTokenExpired()) {
      console.warn('Token expired, clearing authentication');
      this.clearAuth();
      return false;
    }
    return true;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;