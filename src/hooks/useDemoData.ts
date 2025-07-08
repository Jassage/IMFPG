import { useEffect } from 'react';
import { useAcademicStore } from '../store/academicStore';
import { Student, UE, Grade, Retake } from '../types/academic';

export const useDemoData = () => {
  const { addStudent, addUE, addGrade, addRetake, students, ues, grades } = useAcademicStore();

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
      {
        id: '3',
        firstName: 'Sarah',
        lastName: 'Ndong',
        studentId: 'ETD-2024-003',
        email: 'sarah.ndong@university.ga',
        phone: '+241 03 45 67 89',
        dateOfBirth: '2003-11-10',
        placeOfBirth: 'Franceville',
        address: '789 Rue de la République, Franceville',
        faculty: 'Informatique',
        level: 'L2',
        academicYear: '2024-2025',
        status: 'Active',
        bloodGroup: 'B+',
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
      {
        id: 'ue4',
        code: 'INFO-202',
        title: 'Structures de Données',
        credits: 5,
        type: 'Obligatoire',
        passingGrade: 10,
        faculty: 'Informatique',
        level: 'L2',
        semester: 'S2',
        prerequisites: ['INFO-201'],
      },
    ];

    // Données d'exemple - Notes avec plus d'échecs
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
      {
        id: 'grade4',
        studentId: '3',
        ueId: 'ue1',
        grade: 7.5,
        status: 'À reprendre',
        session: 'Normale',
        semester: 'S1',
        academicYear: '2024-2025',
      },
      {
        id: 'grade5',
        studentId: '3',
        ueId: 'ue2',
        grade: 9.0,
        status: 'À reprendre',
        session: 'Normale',
        semester: 'S1',
        academicYear: '2024-2025',
      },
    ];

    // Données d'exemple - Reprises
    const demoRetakes: Retake[] = [
      {
        id: 'retake1',
        studentId: '1',
        ueId: 'ue1',
        originalGrade: 8.5,
        scheduledSemester: 'S2-2024-2025',
        status: 'Programmé'
      },
    ];

    // Initialiser les données
    demoStudents.forEach(addStudent);
    demoUEs.forEach(addUE);
    demoGrades.forEach(addGrade);
    demoRetakes.forEach(addRetake);
  }, [addStudent, addUE, addGrade, addRetake, students.length]);
};
