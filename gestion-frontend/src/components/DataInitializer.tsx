// components/DataInitializer.tsx
import { useEffect } from "react";
import { useSubjectStore } from "@/store/subjectStore";
import { useAcademicYearStore } from "@/store/academicYearStore";

export const DataInitializer = () => {
  const { fetchSubjects } = useSubjectStore();
  const { fetchAcademicYears } = useAcademicYearStore();

  useEffect(() => {
    // Charger les données essentielles au démarrage
    const loadEssentialData = async () => {
      try {
        await Promise.all([fetchSubjects(), fetchAcademicYears()]);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données initiales:",
          error
        );
      }
    };

    loadEssentialData();
  }, [fetchSubjects, fetchAcademicYears]);

  return null;
};
