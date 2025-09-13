// Generic API service with JWT handling and error management
class ApiService {
  constructor(baseURL = 'https://pixel-vault-ct82.onrender.com/api') {
    this.baseURL = baseURL;
  }

  // Get token from localStorage
  getToken() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData).token : null;
  }

  // Get headers with authorization
  getHeaders(customHeaders = {}) {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders
    };
  }

  // Handle response and errors
  async handleResponse(response) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('user');
      window.location.href = '/auth';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // Generic GET request
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  // Generic POST request
  async post(endpoint, data = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  // Generic PUT request
  async put(endpoint, data = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  // Generic DELETE request
  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  // File upload with FormData
  async uploadFiles(endpoint, formData) {
    const token = this.getToken();
    const headers = {
      ...(token && { Authorization: `Bearer ${token}` })
      // Don't set Content-Type for FormData - browser will set it with boundary
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    });

    return this.handleResponse(response);
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      console.error('API health check failed:', error);
      return { success: false, message: 'API unavailable' };
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;