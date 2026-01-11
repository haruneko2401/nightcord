import { Platform } from 'react-native';

// API service for backend communication
// For React Native, use your computer's IP address instead of localhost
// Find your IP: Windows (ipconfig) or Mac/Linux (ifconfig)
// Example: 'http://192.168.1.100:3000/api'
const API_BASE_URL = __DEV__ 
  ? (Platform.OS === 'web' 
      ? 'http://localhost:3000/api' 
      : 'http://192.168.2.9:3000/api') // IP address của máy tính
  : 'https://your-production-api.com/api';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Check if API_BASE_URL is configured
    if (API_BASE_URL.includes('YOUR_IP_ADDRESS')) {
      throw new Error('Vui lòng cấu hình API_BASE_URL trong src/services/api.js. Thay YOUR_IP_ADDRESS bằng IP máy tính của bạn.');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add token if available
    const token = await getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);
    
    // Check if response is JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Server response is not JSON: ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Only log error once, not spam
    if (error.message && !error.message.includes('Network request failed')) {
      console.error('API Error:', error.message);
    }
    
    // Provide helpful error messages
    if (error.message && error.message.includes('Network request failed')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra:\n1. Backend server đang chạy (cd server && npm start)\n2. API URL đã được cấu hình đúng trong src/services/api.js\n3. Firewall không chặn kết nối');
    }
    
    throw error;
  }
}

// Token storage helpers (using AsyncStorage for React Native)
let tokenCache = null;
let AsyncStorage = null;

// Lazy load AsyncStorage
async function getAsyncStorage() {
  if (!AsyncStorage) {
    try {
      AsyncStorage = require('@react-native-async-storage/async-storage').default;
    } catch (error) {
      console.warn('AsyncStorage not available, using in-memory storage');
    }
  }
  return AsyncStorage;
}

async function getStoredToken() {
  if (tokenCache) return tokenCache;
  
  try {
    const storage = await getAsyncStorage();
    if (storage) {
      tokenCache = await storage.getItem('authToken');
    }
    return tokenCache;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

async function setStoredToken(token) {
  tokenCache = token;
  try {
    const storage = await getAsyncStorage();
    if (storage) {
      await storage.setItem('authToken', token);
    }
  } catch (error) {
    console.error('Error storing token:', error);
  }
}

async function removeStoredToken() {
  tokenCache = null;
  try {
    const storage = await getAsyncStorage();
    if (storage) {
      await storage.removeItem('authToken');
    }
  } catch (error) {
    console.error('Error removing token:', error);
  }
}

// Auth API functions
export const authAPI = {
  // Register
  async register(userData) {
    const { email, username, password, displayName, month, day, year } = userData;
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        username,
        password,
        displayName,
        month,
        day,
        year,
      }),
    });

    if (response.success && response.token) {
      await setStoredToken(response.token);
    }

    return response;
  },

  // Login
  async login(email, password) {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.token) {
      await setStoredToken(response.token);
    }

    return response;
  },

  // Forgot password
  async forgotPassword(email) {
    return await apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  async resetPassword(token, newPassword) {
    return await apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },

  // Verify token
  async verifyToken() {
    return await apiCall('/auth/verify', {
      method: 'GET',
    });
  },

  // Logout
  async logout() {
    await removeStoredToken();
    return { success: true };
  },
};

// Servers API functions
export const serversAPI = {
  // Create server
  async createServer(name, type) {
    return await apiCall('/servers/create', {
      method: 'POST',
      body: JSON.stringify({ name, type }),
    });
  },

  // Get user's servers
  async getServers() {
    return await apiCall('/servers', {
      method: 'GET',
    });
  },

  // Get channels for a server
  async getChannels(serverId) {
    return await apiCall(`/servers/${serverId}/channels`, {
      method: 'GET',
    });
  },

  // Create channel
  async createChannel(serverId, name, type) {
    return await apiCall(`/servers/${serverId}/channels`, {
      method: 'POST',
      body: JSON.stringify({ name, type }),
    });
  },
};

// Messages API functions
export const messagesAPI = {
  // Send message
  async sendMessage(channelId, content) {
    return await apiCall('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ channelId, content }),
    });
  },

  // Get messages for a channel
  async getMessages(channelId) {
    return await apiCall(`/messages/${channelId}`, {
      method: 'GET',
    });
  },
};

export { getStoredToken, setStoredToken, removeStoredToken };

