// Auth store for managing authentication state
export interface AuthState {
  token: string | null;
  role: 'PLATFORM_ADMIN' | 'RESELLER_ADMIN' | 'CLIENT_ADMIN' | null;
  username: string | null;
  isAuthenticated: boolean;
}

// This can be enhanced with Zustand or other state management
export const authStore = {
  getAuthState: (): AuthState => {
    if (typeof window === 'undefined') {
      return {
        token: null,
        role: null,
        username: null,
        isAuthenticated: false,
      };
    }

    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole') as AuthState['role'];
    const username = localStorage.getItem('username');

    return {
      token,
      role,
      username,
      isAuthenticated: !!token,
    };
  },

  setAuthState: (state: Partial<AuthState>) => {
    if (state.token) localStorage.setItem('authToken', state.token);
    if (state.role) localStorage.setItem('userRole', state.role);
    if (state.username) localStorage.setItem('username', state.username);
  },

  clearAuthState: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
  },
};
