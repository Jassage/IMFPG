// store/studentStore.ts - VERSION CORRIGÉE
import { create } from "zustand";
import { Student } from "@/types/academic";
import api from "@/services/api";
import { Toast } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";

interface StudentFilters {
  status?: string;
  classId?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StudentManagementState {
  // État
  students: Student[];
  currentStudent: Student | null;
  loading: boolean;
  error: string | null;

  // Filtres et pagination
  filters: StudentFilters;
  pagination: Pagination;

  // Actions
  setFilters: (filters: Partial<StudentFilters>) => void;
  fetchStudents: (params?: {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
    classId?: string;
  }) => Promise<void>;
  fetchStudentById: (id: string) => Promise<Student>;
  createStudent: (studentData: CreateStudentData) => Promise<Student>;
  updateStudent: (
    id: string,
    studentData: Partial<Student>
  ) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  updateStudentStatus: (
    id: string,
    status: Student["status"],
    reason?: string
  ) => Promise<Student>;
  assignStudentToClass: (
    studentId: string,
    classId: string
  ) => Promise<Student>;
  getStatistics: () => Promise<any>;
  importStudents: (students: any[]) => Promise<any>;
  exportStudents: (filters?: any) => Promise<any>;
  clearError: () => void;
  clearStudents: () => void;
}

interface CreateStudentData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  photo?: string;
  bloodGroup?: string;
  allergies?: string;
  disabilities?: string;
  status?: Student["status"];
  sexe?: string;
  classId?: string;
  createUserAccount?: boolean;
  guardians?: any[];
}

export const useStudentStore = create<StudentManagementState>((set, get) => ({
  students: [],
  currentStudent: null,
  loading: false,
  error: null,

  filters: {
    status: "",
    classId: "",
  },

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  fetchStudents: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const { search = "", page = 1, limit = 20, status, classId } = params;

      console.log("📡 Fetching students with params:", {
        search,
        page,
        limit,
        status: status || filters.status,
        classId: classId || filters.classId,
      });

      const response = await api.get("/students", {
        params: {
          search: search || undefined,
          status: status || filters.status || undefined,
          classId: classId || filters.classId || undefined,
          page,
          limit,
        },
      });

      console.log("✅ API Response complete:", response.data);

      const responseData = response.data;

      // CORRECTION CRITIQUE : Structure de la réponse
      let studentsList: Student[] = [];
      let paginationData: Partial<Pagination> = {};

      if (responseData.success) {
        // La réponse a deux structures possibles :
        // 1. responseData.data.students & responseData.data.pagination
        // 2. responseData.data directement

        if (responseData.data && responseData.data.data) {
          // Structure imbriquée : data.data
          studentsList = responseData.data.data || [];
          paginationData = responseData.data.pagination || {};
        } else if (responseData.data && Array.isArray(responseData.data)) {
          // Structure simple : data est directement le tableau
          studentsList = responseData.data;
          paginationData = responseData.pagination || {};
        } else {
          // Autre structure
          studentsList =
            responseData.data?.students || responseData.students || [];
          paginationData =
            responseData.data?.pagination || responseData.pagination || {};
        }
      }

      console.log("📊 Students parsed:", studentsList);
      console.log("📊 Pagination parsed:", paginationData);

      set({
        students: studentsList,
        loading: false,
        pagination: {
           page,
          limit,
          total:studentsList.length,
          totalPages: paginationData.totalPages || 1,
        },
      });
    } catch (error: any) {
      console.error("❌ Error fetching students:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur lors du chargement des étudiants";

      set({
        error: errorMessage,
        loading: false,
      });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  },
  fetchStudentById: async (id: string) => {
    set({ loading: true });
    try {
      console.log("📡 Fetching student by ID:", id);

      const response = await api.get(`/students/${id}`);
      console.log("✅ Student details response:", response.data);

      const responseData = response.data;

      // CORRECTION ICI : Structure de réponse corrigée
      let student: Student;

      if (responseData.success && responseData.data) {
        student = responseData.data.student || responseData.data;
      } else {
        student = responseData.data || responseData;
      }

      if (!student) {
        throw new Error("Aucune donnée d'étudiant trouvée");
      }

      set({
        loading: false,
        currentStudent: student,
        error: null,
      });

      return student;
    } catch (error: any) {
      console.error("❌ Error fetching student by ID:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur de chargement";

      set({
        error: errorMessage,
        loading: false,
      });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  },

  createStudent: async (studentData: CreateStudentData) => {
    set({ loading: true, error: null });
    try {
      console.log("📤 Creating student with data:", studentData);

      const dataToSend = {
        ...studentData,
        status: studentData.status || "Active",
      };

      const response = await api.post("/students", dataToSend);
      console.log("✅ Create student response:", response.data);

      const responseData = response.data;
      let newStudent: Student;

      // CORRECTION ICI : Structure de réponse corrigée
      if (responseData.success && responseData.data) {
        newStudent = responseData.data.student || responseData.data;
      } else {
        newStudent = responseData.data || responseData;
      }

      if (!newStudent) {
        throw new Error("Aucune donnée d'étudiant retournée");
      }

      set((state) => ({
        students: [newStudent, ...state.students],
        loading: false,
      }));

      toast({
        title: "Succès",
        description: "Étudiant créé avec succès",
      });

      return newStudent;
    } catch (error: any) {
      console.error("❌ Error creating student:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur de création";

      set({
        error: errorMessage,
        loading: false,
      });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  },

  updateStudent: async (id: string, studentData: Partial<Student>) => {
    set({ loading: true, error: null });
    try {
      console.log("📝 Updating student:", id, studentData);

      const response = await api.put(`/students/${id}`, studentData);
      console.log("✅ Update student response:", response.data);

      const responseData = response.data;
      let updatedStudent: Student;

      // CORRECTION ICI : Structure de réponse corrigée
      if (responseData.success && responseData.data) {
        updatedStudent = responseData.data.student || responseData.data;
      } else {
        updatedStudent = responseData.data || responseData;
      }

      if (!updatedStudent) {
        throw new Error("Aucune donnée d'étudiant retournée");
      }

      set((state) => ({
        students: state.students.map((student) =>
          student.id === id ? updatedStudent : student
        ),
        currentStudent:
          state.currentStudent?.id === id
            ? updatedStudent
            : state.currentStudent,
        loading: false,
      }));

      toast({
        title: "Succès",
        description: "Étudiant mis à jour avec succès",
      });

      return updatedStudent;
    } catch (error: any) {
      console.error("❌ Error updating student:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur de modification";

      set({
        error: errorMessage,
        loading: false,
      });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  },

  deleteStudent: async (id: string) => {
    set({ loading: true, error: null });
    try {
      console.log("🗑️ Deleting student:", id);

      await api.delete(`/students/${id}`);

      set((state) => ({
        students: state.students.filter((student) => student.id !== id),
        loading: false,
      }));

      toast({
        title: "Succès",
        description: "Étudiant supprimé avec succès",
      });
    } catch (error: any) {
      console.error("❌ Error deleting student:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur de suppression";

      set({
        error: errorMessage,
        loading: false,
      });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  },

  updateStudentStatus: async (
    id: string,
    status: Student["status"],
    reason?: string
  ) => {
    set({ loading: true, error: null });
    try {
      console.log("🔄 Updating student status:", id, status);

      const response = await api.put(`/students/${id}/status`, {
        status,
        reason,
      });
      console.log("✅ Update status response:", response.data);

      const responseData = response.data;
      let updatedStudent: Student;

      // CORRECTION ICI : Structure de réponse corrigée
      if (responseData.success && responseData.data) {
        updatedStudent = responseData.data.student || responseData.data;
      } else {
        updatedStudent = responseData.data || responseData;
      }

      if (!updatedStudent) {
        throw new Error("Aucune donnée d'étudiant retournée");
      }

      set((state) => ({
        students: state.students.map((student) =>
          student.id === id ? updatedStudent : student
        ),
        loading: false,
      }));

      toast({
        title: "Succès",
        description: "Statut de l'étudiant mis à jour avec succès",
      });

      return updatedStudent;
    } catch (error: any) {
      console.error("❌ Error updating student status:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur lors du changement de statut";

      set({
        error: errorMessage,
        loading: false,
      });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  },

  assignStudentToClass: async (studentId: string, classId: string) => {
    set({ loading: true, error: null });
    try {
      console.log("🏫 Assigning student to class:", studentId, classId);

      const response = await api.put(`/students/${studentId}/assign-class`, {
        classId,
      });
      console.log("✅ Assign class response:", response.data);

      const responseData = response.data;
      let updatedStudent: Student;

      // CORRECTION ICI : Structure de réponse corrigée
      if (responseData.success && responseData.data) {
        updatedStudent = responseData.data.student || responseData.data;
      } else {
        updatedStudent = responseData.data || responseData;
      }

      if (!updatedStudent) {
        throw new Error("Aucune donnée d'étudiant retournée");
      }

      set((state) => ({
        students: state.students.map((student) =>
          student.id === studentId ? updatedStudent : student
        ),
        loading: false,
      }));

      toast({
        title: "Succès",
        description: "Étudiant affecté à la classe avec succès",
      });

      return updatedStudent;
    } catch (error: any) {
      console.error("❌ Error assigning student to class:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur lors de l'affectation à la classe";

      set({
        error: errorMessage,
        loading: false,
      });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  },

  getStatistics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/students/statistics");
      console.log("📊 Statistics response:", response.data);

      const responseData = response.data;

      // CORRECTION ICI : Structure de réponse corrigée
      if (responseData.success && responseData.data) {
        const statistics = responseData.data.statistics || responseData.data;
        set({ loading: false });
        return statistics;
      } else {
        set({ loading: false });
        return responseData.data || responseData;
      }
    } catch (error: any) {
      console.error("❌ Error fetching statistics:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur lors de la récupération des statistiques";

      set({
        error: errorMessage,
        loading: false,
      });

      throw error;
    }
  },

  importStudents: async (students: any[]) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/students/import", { students });
      console.log("📥 Import response:", response.data);

      const responseData = response.data;
      set({ loading: false });

      // CORRECTION ICI : Structure de réponse corrigée
      if (responseData.success && responseData.data) {
        return responseData.data;
      } else {
        return responseData;
      }
    } catch (error: any) {
      console.error("❌ Error importing students:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur lors de l'import";

      set({
        error: errorMessage,
        loading: false,
      });

      throw error;
    }
  },

  exportStudents: async (filters?: any) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/students/export", {
        params: filters,
        responseType: "blob",
      });
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      console.error("❌ Error exporting students:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur lors de l'export";

      set({
        error: errorMessage,
        loading: false,
      });

      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearStudents: () => set({ students: [], currentStudent: null, error: null }),
}));

export default useStudentStore;
