// Nouveau store: assignmentTemplateStore.ts
import api from "@/services/api";
import { create } from "zustand";

interface AssignmentTemplateState {
  templates: any[];
  loading: boolean;
  error: string | null;

  // Actions
  copyAssignments: (data: {
    sourceFacultyId: string;
    sourceLevel: string;
    targetFacultyId: string;
    targetLevel: string;
    academicYearId: string;
    modifications?: any;
  }) => Promise<any>;

  createTemplate: (data: {
    name: string;
    description: string;
    facultyId: string;
    level: string;
    assignments: any[];
  }) => Promise<any>;

  getTemplates: () => Promise<any[]>;
  applyTemplate: (templateId: string, targetData: any) => Promise<any>;
}

export const useAssignmentTemplateStore = create<AssignmentTemplateState>(
  (set, get) => ({
    templates: [],
    loading: false,
    error: null,

    copyAssignments: async (data) => {
      set({ loading: true, error: null });
      try {
        const response = await api.post("/course-assignments/copy", data);
        set({ loading: false });
        return response.data;
      } catch (error: any) {
        set({ loading: false, error: error.message });
        throw error;
      }
    },

    createTemplate: async (data) => {
      set({ loading: true, error: null });
      try {
        const response = await api.post("/assignment-templates", data);
        set({ loading: false });
        return response.data;
      } catch (error: any) {
        set({ loading: false, error: error.message });
        throw error;
      }
    },

    getTemplates: async () => {
      set({ loading: true, error: null });
      try {
        const response = await api.get("/assignment-templates");
        set({ templates: response.data.data, loading: false });
        return response.data.data;
      } catch (error: any) {
        set({ loading: false, error: error.message });
        throw error;
      }
    },

    applyTemplate: async (templateId: string, targetData: any) => {
      set({ loading: true, error: null });
      try {
        const response = await api.post(
          `/assignment-templates/${templateId}/apply`,
          targetData
        );
        set({ loading: false });
        return response.data;
      } catch (error: any) {
        set({ loading: false, error: error.message });
        throw error;
      }
    },
  })
);
