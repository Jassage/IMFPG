import { create } from "zustand";
import api from "../services/api";
import { Student, Enrollment, Guardian } from "../types/academic";

type AcademicStore = {
  students: Student[];
  enrollments: Enrollment[];
  guardians: Guardian[];
  loading: boolean;
  error: string | null;
  importResults: any[];

  // Actions principales
  fetchStudents: () => Promise<void>;
  addStudent: (student: Omit<Student, "id">, photoFile?: File) => Promise<void>;
  updateStudent: (
    id: string,
    student: Partial<Student>,
    photoFile?: File
  ) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;

  // Nouvelles actions pour l'importation et les photos
  importStudents: (file: File) => Promise<any>;
  updateStudentPhoto: (studentId: string, photoFile: File) => Promise<void>;
  downloadImportTemplate: () => Promise<void>;

  // Getters
  getStudentGuardians: (studentId: string) => Promise<Guardian[]>;
  getStudentGrades: (studentId: string) => any[];
  getStudentRetakes: (studentId: string) => any[];
};

export const useAcademicStore = create<AcademicStore>((set, get) => ({
  students: [],
  enrollments: [],
  guardians: [],
  loading: false,
  error: null,
  importResults: [],

  fetchStudents: async () => {
    set({ loading: true, error: null });
    try {
      const [studentsRes, enrollmentsRes, guardiansRes] = await Promise.all([
        api.get("/students"),
        api.get("/enrollments"),
        api.get("/guardians"),
      ]);
      set({
        students: studentsRes.data,
        enrollments: enrollmentsRes.data,
        guardians: guardiansRes.data,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      set({ error: "Erreur lors du chargement", loading: false });
    }
  },

  addStudent: async (student, photoFile) => {
    set({ loading: true });
    try {
      const formData = new FormData();

      // Ajouter les données de l'étudiant
      const studentData = {
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        email: student.email,
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString()
          : null,
        phone: student.phone || "",
        placeOfBirth: student.placeOfBirth || "",
        address: student.address || "",
        bloodGroup: student.bloodGroup || "",
        allergies: student.allergies || "",
        disabilities: student.disabilities || "",
        status: student.status || "Active",
        guardians: JSON.stringify(
          student.guardians?.map((guardian) => ({
            firstName: guardian.firstName,
            lastName: guardian.lastName,
            relationship: guardian.relationship,
            phone: guardian.phone,
            email: guardian.email || null,
            address: guardian.address || null,
            isPrimary: guardian.isPrimary,
          })) || []
        ),
      };

      // Ajouter les données au FormData
      Object.entries(studentData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Ajouter la photo si elle existe
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await api.post("/students", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        students: [...state.students, response.data],
        loading: false,
      }));
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Erreur lors de la création",
        loading: false,
      });
      throw error;
    }
  },

  updateStudent: async (id, student, photoFile) => {
    set({ loading: true });
    try {
      const formData = new FormData();

      // Ajouter les données modifiables
      const cleanData = {
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        email: student.email,
        phone: student.phone,
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString()
          : null,
        placeOfBirth: student.placeOfBirth,
        address: student.address,
        bloodGroup: student.bloodGroup,
        allergies: student.allergies,
        disabilities: student.disabilities,
        status: student.status,
      };

      Object.entries(cleanData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Ajouter la photo si elle existe
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await api.put(`/students/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Mettre à jour le store
      set((state) => ({
        students: state.students.map((s) =>
          s.id === id ? { ...s, ...response.data } : s
        ),
        loading: false,
      }));

      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Erreur lors de la modification",
        loading: false,
      });
      throw error;
    }
  },

  updateStudentPhoto: async (studentId, photoFile) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      formData.append("photo", photoFile);

      const response = await api.patch(
        `/students/${studentId}/photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Mettre à jour la photo dans le store
      set((state) => ({
        students: state.students.map((s) =>
          s.id === studentId ? { ...s, photo: response.data.photo } : s
        ),
        loading: false,
      }));

      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors de la mise à jour de la photo",
        loading: false,
      });
      throw error;
    }
  },

  importStudents: async (file) => {
    set({ loading: true, error: null });
    console.log("Envoi du fichier au backend...");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/students/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({
        importResults: response.data.results,
        loading: false,
      });

      // Recharger la liste des étudiants après l'import
      await get().fetchStudents();

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erreur lors de l'importation";
      set({
        error: errorMessage,
        loading: false,
        importResults: [],
      });
      throw new Error(errorMessage);
    }
  },

  downloadImportTemplate: async () => {
    try {
      const response = await api.get("/students/import/template", {
        responseType: "blob",
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "template-import-etudiants.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du téléchargement du template",
      });
      throw error;
    }
  },

  deleteStudent: async (id) => {
    try {
      await api.delete(`/students/${id}`);
      await get().fetchStudents();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  getStudentGuardians: async (studentId: string) => {
    return get().guardians.filter((p) => p.studentId === studentId);
  },

  getStudentGrades: (studentId: string) => {
    return get().students.find((s) => s.id === studentId)?.grades || [];
  },

  getStudentRetakes: (studentId: string) => {
    return get().students.find((s) => s.id === studentId)?.retakes || [];
  },
}));
