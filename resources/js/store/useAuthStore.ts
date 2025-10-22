import { create } from 'zustand';
import { User } from '~/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,

  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
  }),

  clearAuth: () => set(initialState),
}));
