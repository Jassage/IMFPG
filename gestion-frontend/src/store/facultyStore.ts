import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { FacultyWithLevels } from '../types/academic';

interface FacultyState {
  faculties: FacultyWithLevels[];
  loading: boolean;
  error: string | null;
  fetchFaculties: (params?: { search?: string; status?: string }) => Promise<void>;
  addFaculty: (faculty: Omit<FacultyWithLevels, 'id' | 'createdAt' | 'updatedAt' | 'levels' | 'studentsCount' | 'coursesCount' | 'assignments' | '_count'>) => Promise<FacultyWithLevels>;
  updateFaculty: (id: string, faculty: Partial<Omit<FacultyWithLevels, 'id' | 'createdAt' | 'updatedAt' | 'levels' | 'studentsCount' | 'coursesCount' | 'assignments' | '_count'>>) => Promise<void>;
  deleteFaculty: (id: string) => Promise<void>;
  getFacultyById: (id: string) => FacultyWithLevels | undefined;
  getFacultyStats: () => Promise<{
    total: number;
    active: number;
    inactive: number;
    byStatus: Array<{ status: string; count: number }>;
  }>;
}

export const useFacultyStore = create<FacultyState>()(
  persist(
    (set, get) => ({
      faculties: [],
      loading: false,
      error: null,

      fetchFaculties: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const queryParams = new URLSearchParams();
          if (params.search) queryParams.append('search', params.search);
          if (params.status) queryParams.append('status', params.status);
          queryParams.append('includeLevels', 'true');

          const response = await api.get(`/faculties?${queryParams.toString()}`);
          set({ faculties: response.data, loading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Erreur lors du chargement des facultés',
            loading: false 
          });
        }
      },

      addFaculty: async (faculty) => {
        set({ loading: true });
        try {
          // Ajouter les valeurs par défaut pour les champs optionnels
          const payload = {
            ...faculty,
            studentsCount: 0, // Valeur par défaut
            coursesCount: 0   // Valeur par défaut
          };

          const response = await api.post('/faculties', payload);
          const newFaculty = response.data.faculty || response.data;
          
          set((state) => ({ 
            faculties: [...state.faculties, newFaculty],
            loading: false 
          }));
          return newFaculty;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Erreur lors de la création de la faculté';
          set({ 
            error: errorMessage,
            loading: false 
          });
          throw new Error(errorMessage);
        }
      },

      updateFaculty: async (id, updates) => {
        set({ loading: true });
        try {
          const response = await api.put(`/faculties/${id}`, updates);
          const updatedFaculty = response.data.faculty || response.data;
          
          set((state) => ({
            faculties: state.faculties.map(f => 
              f.id === id ? { ...f, ...updatedFaculty } : f
            ),
            loading: false
          }));
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour de la faculté';
          set({ 
            error: errorMessage,
            loading: false 
          });
          throw new Error(errorMessage);
        }
      },

      deleteFaculty: async (id) => {
        set({ loading: true });
        try {
          await api.delete(`/faculties/${id}`);
          set((state) => ({
            faculties: state.faculties.filter(f => f.id !== id),
            loading: false
          }));
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression de la faculté';
          set({ 
            error: errorMessage,
            loading: false 
          });
          throw new Error(errorMessage);
        }
      },

      getFacultyById: (id) => {
        return get().faculties.find(f => f.id === id);
      },

      getFacultyStats: async () => {
        try {
          const response = await api.get('/faculties/stats');
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Erreur lors de la récupération des statistiques';
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: 'faculty-storage',
      partialize: (state) => ({ faculties: state.faculties }),
    }
  )
);

// Fonction utilitaire pour l'initialisation
export const initializeFacultyStore = async () => {
  const { fetchFaculties, faculties } = useFacultyStore.getState();
  if (faculties.length === 0) {
    await fetchFaculties();
  }
};