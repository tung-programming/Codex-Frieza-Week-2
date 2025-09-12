import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import authService from '../services/AuthService.js';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already logged in
        if (authService.isLoggedIn()) {
          const user = authService.getUser();
          const token = authService.getToken();

          // Verify token is still valid with server
          try {
            const response = await authService.getCurrentUser();
            
            if (response.success) {
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: {
                  user: response.user,
                  token
                }
              });
            } else {
              // Token invalid, clear auth
              authService.clearAuth();
              dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
          } catch (error) {
            // Network error or server error - keep local auth but don't fail
            console.warn('Could not verify auth with server:', error);
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user, token }
            });
          }
        } else {
          // No existing auth
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.clearAuth();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    initializeAuth();
  }, []); // Only run once on mount

  // Memoized functions to prevent re-renders
  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const response = await authService.login(email, password);
      
      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.user,
            token: authService.getToken()
          }
        });
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message || 'Login failed'
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  }, []);

  const register = useCallback(async (username, email, password, confirmPassword) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const response = await authService.register(username, email, password, confirmPassword);
      
      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.user,
            token: authService.getToken()
          }
        });
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message || 'Registration failed'
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  }, []);

  const googleLogin = useCallback(async (idToken) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const response = await authService.googleLogin(idToken);
      
      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.user,
            token: authService.getToken()
          }
        });
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message || 'Google login failed'
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Google login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const updateUser = useCallback((userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData
    });
    authService.updateUserData(userData);
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword, confirmNewPassword) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword, confirmNewPassword);
      return response;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, []);

  // Role and permission helpers (memoized)
  const hasRole = useCallback((role) => authService.hasRole(role), []);
  const isAdmin = useCallback(() => authService.isAdmin(), []);
  const isEditor = useCallback(() => authService.isEditor(), []);
  const isVisitor = useCallback(() => authService.isVisitor(), []);
  const isEditorOrAdmin = useCallback(() => authService.isEditorOrAdmin(), []);
  const canEdit = useCallback((itemUserId = null) => authService.canEdit(itemUserId), []);
  const canUpload = useCallback(() => authService.canUpload(), []);
  const canCreateAlbums = useCallback(() => authService.canCreateAlbums(), []);
  const canDelete = useCallback((itemUserId = null) => authService.canDelete(itemUserId), []);
  const getRoleDisplay = useCallback(() => authService.getRoleDisplay(), []);

  // Auto-logout on token expiration
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const interval = setInterval(() => {
      if (authService.isTokenExpired()) {
        console.warn('Token expired, logging out automatically');
        authService.logout();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    // State
    ...state,
    
    // Actions
    login,
    register,
    googleLogin,
    logout,
    clearError,
    updateUser,
    changePassword,
    
    // Role checks
    hasRole,
    isAdmin,
    isEditor,
    isVisitor,
    isEditorOrAdmin,
    
    // Permission checks
    canEdit,
    canUpload,
    canCreateAlbums,
    canDelete,
    
    // Utilities
    getRoleDisplay
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;