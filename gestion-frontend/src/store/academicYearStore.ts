// src/store/academicYearStore.ts
import { create } from "zustand";
import api from "../services/api";

export interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AcademicYearState {
  academicYears: AcademicYear[];
  currentAcademicYear: AcademicYear | null;
  loading: boolean;
  error: string | null;
  fetchAcademicYears: () => Promise<void>;
  setCurrentAcademicYear: (year: AcademicYear) => void;
  getAcademicYearById: (id: string) => AcademicYear | null;
}

export const useAcademicYearStore = create<AcademicYearState>((set, get) => ({
  academicYears: [],
  currentAcademicYear: null,
  loading: false,
  error: null,

  fetchAcademicYears: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/academic-years");

      console.log("📅 API Response academic years:", {
        status: response.status,
        data: response.data,
        isArray: Array.isArray(response.data),
        hasData: !!response.data?.data,
      });

      let yearsData = [];

      // Gérer différents formats de réponse
      if (response.data?.success && response.data.data) {
        // Si data contient directement un tableau
        if (Array.isArray(response.data.data)) {
          yearsData = response.data.data;
        }
        // Si data est un objet avec une propriété years
        else if (
          response.data.data.years &&
          Array.isArray(response.data.data.years)
        ) {
          yearsData = response.data.data.years;
        }
        // Si data est un objet avec une propriété academicYears
        else if (
          response.data.data.academicYears &&
          Array.isArray(response.data.data.academicYears)
        ) {
          yearsData = response.data.data.academicYears;
        }
        // Si data est un objet et nous devons extraire les valeurs
        else if (
          typeof response.data.data === "object" &&
          response.data.data !== null
        ) {
          const allValues = Object.values(response.data.data);
          yearsData = allValues.filter(
            (item) => item && typeof item === "object" && "id" in item
          );
        }
      }
      // Structure alternative directe
      else if (Array.isArray(response.data)) {
        yearsData = response.data;
      } else if (
        response.data?.academicYears &&
        Array.isArray(response.data.academicYears)
      ) {
        yearsData = response.data.academicYears;
      } else if (response.data?.years && Array.isArray(response.data.years)) {
        yearsData = response.data.years;
      }

      console.log("Extracted academic years:", yearsData);

      const currentYear =
        yearsData.find((y: AcademicYear) => y.isCurrent) ||
        yearsData[0] ||
        null;

      set({
        academicYears: yearsData,
        currentAcademicYear: currentYear,
        loading: false,
      });
    } catch (error: any) {
      console.error(" Error fetching academic years:", error);
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement des années académiques",
        loading: false,
      });
    }
  },

  setCurrentAcademicYear: (year) => {
    set({ currentAcademicYear: year });
  },

  getAcademicYearById: (id) => {
    const { academicYears } = get();
    return academicYears.find((year) => year.id === id) || null;
  },
}));
