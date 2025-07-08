
import { useEffect } from 'react';
import { useAcademicStore } from '../store/academicStore';
import { Student, UE, Grade } from '../types/academic';

export const useDemoData = () => {
  const { addStudent, addUE, addGrade, students, ues, grades } = useAcademicStore();

  useEffect(() => {
    // Éviter de dupliquer les données
    if (students.length > 0) return;

    // Données d'exemple - Étudiants
    const demoStudents: Student[] = [
      {
        id: '1',
        firstName: 'Marie',
        lastName: 'Dupont',
        studentId: 'ETD-2024-001',
        email: 'marie.dupont@university.ga',
        phone: '+241 01 23 45 67',
        dateOfBirth: '2003-05-15',
        placeOfBirth: 'Libreville',
        address: '123 Avenue de la Paix, Libreville',
        faculty: 'Informatique',
        level: 'L2',
        academicYear: '2024-2025',
        status: 'Active',
        bloodGroup: 'O+',
      },
      {
        id: '2',
        firstName: 'Jean',
        lastName: 'Mbeng',
        studentId: 'ETD-2024-002',
        email: 'jean.mbeng@university.ga',
        phone: '+241 02 34 56 78',
        dateOfBirth: '2002-08-22',
        placeOfBirth: 'Port-Gentil',
        address: '456 Boulevard Omar Bongo, Port-Gentil',
        faculty: 'Informatique',
        level: 'L3',
        academicYear: '2024-2025',
        status: 'Active',
        bloodGroup: 'A+',
      },
    ];

    // Données d'exemple - UE
    const demoUEs: UE[] = [
      {
        id: 'ue1',
        code: 'INFO-201',
        title: 'Programmation Orientée Objet',
        credits: 6,
        type: 'Obligatoire',
        passingGrade: 10,
        faculty: 'Informatique',
        level: 'L2',
        semester: 'S1',
        prerequisites: ['INFO-101'],
      },
      {
        id: 'ue2',
        code: 'MATH-201',
        title: 'Mathématiques Discrètes',
        credits: 4,
        type: 'Obligatoire',
        passingGrade: 10,
        faculty: 'Informatique',
        level: 'L2',
        semester: 'S1',
        prerequisites: [],
      },
      {
        id: 'ue3',
        code: 'INFO-301',
        title: 'Base de Données Avancées',
        credits: 6,
        type: 'Obligatoire',
        passingGrade: 10,
        faculty: 'Informatique',
        level: 'L3',
        semester: 'S1',
        prerequisites: ['INFO-201'],
      },
    ];

    // Données d'exemple - Notes
    const demoGrades: Grade[] = [
      {
        id: 'grade1',
        studentId: '1',
        ueId: 'ue1',
        grade: 8.5,
        status: 'À reprendre',
        session: 'Normale',
        semester: 'S1',
        academicYear: '2024-2025',
      },
      {
        id: 'grade2',
        studentId: '1',
        ueId: 'ue2',
        grade: 14,
        status: 'Validé',
        session: 'Normale',
        semester: 'S1',
        academicYear: '2024-2025',
      },
      {
        id: 'grade3',
        studentId: '2',
        ueId: 'ue3',
        grade: 16,
        status: 'Validé',
        session: 'Normale',
        semester: 'S1',
        academicYear: '2024-2025',
      },
    ];

    // Initialiser les données
    demoStudents.forEach(addStudent);
    demoUEs.forEach(addUE);
    demoGrades.forEach(addGrade);
  }, [addStudent, addUE, addGrade, students.length]);
};
