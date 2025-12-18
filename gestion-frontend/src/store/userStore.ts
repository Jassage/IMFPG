import { create } from "zustand";
import { User } from "../types/academic";
import api from "../services/api";

interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UserManagementState {
  // État
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;

  // Filtres et pagination
  filters: UserFilters;
  pagination: Pagination;

  // Actions
  setFilters: (filters: Partial<UserFilters>) => void;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User>;
  createUser: (userData: CreateUserData) => Promise<User>;
  updateUser: (
    id: string,
    userData: Partial<User> & { password?: string }
  ) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  updateUserStatus: (
    id: string,
    status: string,
    reason?: string
  ) => Promise<User>;
  updateUserRole: (id: string, role: string) => Promise<User>;
  activateUser: (id: string) => Promise<User>;
  resetPassword: (id: string) => Promise<void>;
  sendResetPasswordEmail: (email: string) => Promise<void>;
  clearError: () => void;
  clearUsers: () => void;
  hardDeleteUser: (id: string) => Promise<void>;
  getUserDependencies: (id: string) => Promise<any>;
}

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
  password?: string;
  avatar?: string;
}

export const useUserStore = create<UserManagementState>((set, get) => ({
  users: [],
  currentUser: null,
  loading: false,
  error: null,

  filters: {
    search: "",
    role: "",
    status: "",
    page: 1,
    limit: 20,
  },

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters, page: 1 },
    }));
    get().fetchUsers();
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();

      
      const response = await api.get(`/auth/users`, {
        params: {
          search: filters.search || undefined,
          role: filters.role || undefined,
          status: filters.status || undefined,
          page: filters.page || 1,
          limit: filters.limit || 20,
        },
      });

      const { users, pagination } = response.data.data;

      set({
        users,
        loading: false,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.totalUsers,
          totalPages: pagination.totalPages,
        },
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement des utilisateurs",
        loading: false,
      });
    }
  },

  fetchUserById: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/auth/users/${id}`);
      const user = response.data.data.user;

      set({ loading: false, currentUser: user });
      return user;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      throw error;
    }
  },

  createUser: async (userData: CreateUserData) => {
    set({ loading: true, error: null });
    try {
  
      const response = await api.post("/auth/users", userData);
      const newUser = response.data.data.user;

      set((state) => ({
        users: [newUser, ...state.users],
        loading: false,
      }));

      return newUser;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de création",
        loading: false,
      });
      throw error;
    }
  },

  updateUser: async (
    id: string,
    userData: Partial<User> & { password?: string }
  ) => {
    set({ loading: true, error: null });
    try {
     
      const { password, ...updateData } = userData;

      const response = await api.put(`/auth/users/${id}`, updateData);
      const updatedUser = response.data.data.user;

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
        currentUser:
          state.currentUser?.id === id ? updatedUser : state.currentUser,
        loading: false,
      }));

      return updatedUser;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de modification",
        loading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
   
      await api.delete(`/auth/users/${id}`);

      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, status: "Inactif" } : user
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de désactivation",
        loading: false,
      });
      throw error;
    }
  },

  updateUserStatus: async (id: string, status: string, reason?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/auth/users/${id}/status`, {
        status,
        reason,
      });
      const updatedUser = response.data.data.user;

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
        loading: false,
      }));

      return updatedUser;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du changement de statut",
        loading: false,
      });
      throw error;
    }
  },

  updateUserRole: async (id: string, role: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/auth/users/${id}/role`, { role });
      const updatedUser = response.data.data.user;

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
        loading: false,
      }));

      return updatedUser;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Erreur lors du changement de rôle",
        loading: false,
      });
      throw error;
    }
  },

  activateUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/auth/users/${id}/activate`);
      const updatedUser = response.data.data.user;

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
        loading: false,
      }));

      return updatedUser;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Erreur lors de la réactivation",
        loading: false,
      });
      throw error;
    }
  },

  resetPassword: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // Envoyer un email de réinitialisation
      await api.post(`/auth/users/${id}/reset-password`);

      set({ loading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors de la réinitialisation du mot de passe",
        loading: false,
      });
      throw error;
    }
  },
  hardDeleteUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/auth/users/${id}/hard-delete`);

      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors de la suppression",
        loading: false,
      });
      throw error;
    }
  },

  getUserDependencies: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/auth/users/${id}/dependencies`);
      set({ loading: false });
      return response.data.data.dependencies;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur de chargement",
        loading: false,
      });
      throw error;
    }
  },

  sendResetPasswordEmail: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/forgot-password", { email });
      set({ loading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Erreur lors de l'envoi de l'email",
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearUsers: () => set({ users: [], currentUser: null, error: null }),
}));

export default useUserStore;
