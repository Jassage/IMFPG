// store/studentStore.ts - VERSION CORRIGÉE
import { create } from "zustand";
import { Student } from "@/types/academic";
import api from "@/services/api";
import * as XLSX from "xlsx";
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
    studentData: Partial<Student>,
  ) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  updateStudentStatus: (
    id: string,
    status: Student["status"],
    reason?: string,
  ) => Promise<Student>;
  assignStudentToClass: (
    studentId: string,
    classId: string,
  ) => Promise<Student>;
  getStatistics: () => Promise<any>;
  importStudents: (fileOrArray: File | any[]) => Promise<any>;
  downloadImportTemplate: () => Promise<void>;
  exportStudents: (filters?: any) => Promise<any>;
  clearError: () => void;
  clearStudents: () => void;
  findStudentByEmail: (email: string) => Promise<Student | null>;
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

      const response = await api.get("/students", {
        params: {
          search: search || undefined,
          status: status || filters.status || undefined,
          classId: classId || filters.classId || undefined,
          page,
          limit,
        },
      });

      const responseData = response.data;

      // Structure de la réponse
      let studentsList: Student[] = [];
      let paginationData: Partial<Pagination> = {};

      if (responseData.success) {
        // La réponse a deux structures possibles :

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

      set({
        students: studentsList,
        loading: false,
        pagination: {
          page,
          limit,
          total: studentsList.length,
          totalPages: paginationData.totalPages || 1,
        },
      });
    } catch (error: any) {
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
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/students/${id}`);

      const responseData = response.data;

      let student: Student | null = null;

      // La réponse contient directement l'étudiant
      if (responseData?.id) {
        student = responseData as Student;
      }
      // Option 2: La réponse est { success: true, data: student }
      else if (responseData?.success && responseData?.data) {
        student = responseData.data as Student;

        // Si c'est encore un objet imbriqué (data.student)
        if (student && typeof student === "object" && "student" in student) {
          student = (student as any).student as Student;
        }
      }
      //La réponse est { data: student }
      else if (responseData?.data && responseData.data.id) {
        student = responseData.data as Student;
      }

      // Mettre à jour le store
      set({
        currentStudent: student,
        loading: false,
        error: null,
      });

      return student;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Impossible de charger les données de l'étudiant";

      set({
        error: errorMessage,
        loading: false,
        currentStudent: null,
      });

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  },

  // Dans votre studentStore.ts, ajoutez :
  // Dans studentStore.ts, ajouter cette méthode :
  findStudentByEmail: async (email: string) => {
    set({ loading: true, error: null });

    try {
      // Chercher par email
      const response = await api.get(
        `/students?email=${encodeURIComponent(email)}`,
      );

      let student = null;

      if (
        response.data?.data?.students &&
        response.data.data.students.length > 0
      ) {
        student = response.data.data.students[0];
      } else if (response.data?.students && response.data.students.length > 0) {
        student = response.data.students[0];
      }

      set({ loading: false });
      return student;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Erreur de recherche",
      });
      return null;
    }
  },

  // studentStore.ts - Version corrigée

  createStudent: async (studentData: any) => {
    set({ loading: true, error: null });
    try {
      let response;

      // Vérifier si c'est un FormData
      if (studentData instanceof FormData) {
        response = await api.post("/students", studentData, {
          headers: {
            // NE PAS définir Content-Type manuellement
            // Laisser axios le définir automatiquement avec le boundary
          },
        });
      } else {
        response = await api.post("/students", studentData);
      }

      const responseData = response.data;
      let newStudent: Student;

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
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erreur de création";

      set({
        error: errorMessage,
        loading: false,
      });

      throw error;
    }
  },

  updateStudent: async (id: string, studentData: any) => {
    set({ loading: true, error: null });
    try {
      let response;
      if (studentData instanceof FormData) {
        console.log("📤 Envoi FormData pour update");

        // AFFICHER LE CONTENU DU FORMDATA POUR DEBUG
        for (let pair of studentData.entries()) {
          console.log(
            `FormData entry: ${pair[0]} =`,
            pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1],
          );
        }

        response = await api.put(`/students/${id}`, studentData, {
          headers: {
            // NE PAS DÉFINIR Content-Type - laisser axios le gérer
          },
          // Important pour les gros fichiers
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        });
      } else {
        response = await api.put(`/students/${id}`, studentData);
      }
      let dataToSend = studentData;

      console.log("📤 updateStudent appelé avec:", {
        id,
        isFormData: studentData instanceof FormData,
        contentType:
          studentData instanceof FormData
            ? "multipart/form-data"
            : "application/json",
      });

      if (studentData instanceof FormData) {
        // Log les clés du FormData
        const keys: string[] = [];
        for (const pair of studentData.entries()) {
          keys.push(pair[0]);
        }
        console.log("📋 FormData keys:", keys);
      }
      // Si ce n'est pas du FormData, nettoyer les données
      if (!(studentData instanceof FormData)) {
        dataToSend = { ...studentData };

        // CORRECTION: Supprimer les champs undefined et les objets vides
        Object.keys(dataToSend).forEach((key) => {
          if (dataToSend[key] === undefined) {
            delete dataToSend[key];
          }
          // Supprimer les objets vides (comme photo: {})
          if (
            dataToSend[key] &&
            typeof dataToSend[key] === "object" &&
            !Array.isArray(dataToSend[key]) &&
            Object.keys(dataToSend[key]).length === 0
          ) {
            delete dataToSend[key];
          }
        });

        // Supprimer les champs qui ne doivent pas être mis à jour
        delete dataToSend.id;
        delete dataToSend.createdAt;
        delete dataToSend.updatedAt;
        delete dataToSend.studentCode;
        delete dataToSend._count;
        delete dataToSend.enrollments;
        delete dataToSend.guardians; // Les gardiens sont gérés séparément
      }

      if (dataToSend instanceof FormData) {
        response = await api.put(`/students/${id}`, dataToSend, {
          headers: {
            // Laisser axios définir le Content-Type
          },
        });
      } else {
        response = await api.put(`/students/${id}`, dataToSend);
      }

      const responseData = response.data;
      let updatedStudent: Student;

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
          student.id === id ? updatedStudent : student,
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

  // studentStore.ts - Version corrigée de deleteStudent
  deleteStudent: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/students/${id}`);

      // Vérifier la réponse
      const responseData = response.data;

      if (responseData?.success === false) {
        throw new Error(
          responseData.message || "Erreur lors de la suppression",
        );
      }

      // IMPORTANT: Mettre à jour l'état local en filtrant l'étudiant supprimé
      set((state) => ({
        students: state.students.filter((student) => student.id !== id),
        loading: false,
        error: null,
      }));

      toast({
        title: "Succès",
        description: responseData?.message || "Étudiant supprimé avec succès",
      });
    } catch (error: any) {
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
    reason?: string,
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/students/${id}/status`, {
        status,
        reason,
      });

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
          student.id === id ? updatedStudent : student,
        ),
        loading: false,
      }));

      toast({
        title: "Succès",
        description: "Statut de l'étudiant mis à jour avec succès",
      });

      return updatedStudent;
    } catch (error: any) {
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
      const response = await api.put(`/students/${studentId}/assign-class`, {
        classId,
      });

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
          student.id === studentId ? updatedStudent : student,
        ),
        loading: false,
      }));

      toast({
        title: "Succès",
        description: "Étudiant affecté à la classe avec succès",
      });

      return updatedStudent;
    } catch (error: any) {
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

  importStudents: async (fileOrArray: File | any[]) => {
    set({ loading: true, error: null });
    try {
      // Le composant passe un fichier : on le parse ici en tableau d'objets.
      let students: any[];
      if (Array.isArray(fileOrArray)) {
        students = fileOrArray;
      } else if (fileOrArray && fileOrArray.name?.match(/\.json$/i)) {
        const text = await fileOrArray.text();
        const parsed = JSON.parse(text);
        students = Array.isArray(parsed) ? parsed : parsed.students || [];
      } else {
        const buffer = await (fileOrArray as File).arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        students = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      }

      if (!students || students.length === 0) {
        throw new Error("Le fichier ne contient aucune ligne exploitable");
      }

      const response = await api.post("/students/import", { students });
      const data = response.data?.data || response.data || {};
      set({ loading: false });

      // Normaliser vers la forme attendue par le composant : { results: [...] }
      const created = data.created || [];
      const errors = data.errors || [];
      const results = [
        ...created.map((s: any, i: number) => ({
          index: i + 1,
          studentId: s.studentCode || s.email || "",
          status: "success" as const,
          message: "Importé avec succès",
          data: s,
        })),
        ...errors.map((e: any, i: number) => ({
          index: created.length + i + 1,
          studentId: e.student?.email || e.student?.studentId || "",
          status: "error" as const,
          message: e.error || "Erreur",
          data: e.student,
        })),
      ];

      // Rafraîchir la liste des élèves après import
      try {
        await get().fetchStudents();
      } catch {
        // non bloquant
      }

      return {
        results,
        summary: { success: data.success, failed: data.failed },
      };
    } catch (error: any) {
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

  downloadImportTemplate: async () => {
    // Génère un template Excel avec les colonnes réellement exploitées par
    // l'import backend, plus une ligne d'exemple.
    const headers = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dateOfBirth",
      "placeOfBirth",
      "address",
      "sexe",
      "cin",
      "bloodGroup",
      "status",
    ];
    const example = {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.ht",
      phone: "+50912345678",
      dateOfBirth: "2010-09-15",
      placeOfBirth: "Pignon",
      address: "Rue principale",
      sexe: "Masculin",
      cin: "",
      bloodGroup: "O+",
      status: "Active",
    };
    const worksheet = XLSX.utils.json_to_sheet([example], { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Élèves");
    XLSX.writeFile(workbook, "template-import-eleves.xlsx");
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
