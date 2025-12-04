import { create } from 'zustand';
import api from '../api/client';

export type User = {
  id: number;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  fetchUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  modalOpen: false,
  setModalOpen: (open) => set({ modalOpen: open }),
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/api/user');
      set({ user: res.data, loading: false });
    } catch (e: any) {
      set({ user: null, loading: false, error: e?.message || 'Failed to fetch user' });
    }
  },
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await api.get('/sanctum/csrf-cookie');
      await api.post('/api/login', { email, password });
      const me = await api.get('/api/user');
      set({ user: me.data, loading: false, modalOpen: false });
    } catch (e: any) {
      set({ error: e?.response?.data?.message || 'Login failed', loading: false });
    }
  },
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      await api.get('/sanctum/csrf-cookie');
      await api.post('/api/register', { name, email, password, password_confirmation: password });
      const me = await api.get('/api/user');
      set({ user: me.data, loading: false, modalOpen: false });
    } catch (e: any) {
      set({ error: e?.response?.data?.message || 'Register failed', loading: false });
    }
  },
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await api.post('/api/logout');
      set({ user: null, loading: false });
    } catch (e: any) {
      set({ error: e?.message || 'Logout failed', loading: false });
    }
  },
}));
