
import { useEffect } from 'react';
import { useAcademicStore } from '../store/academicStore';

export const useDemoData = () => {
  const { students, ues, grades, retakes, addStudent, addUE, addGrade, addRetake } = useAcademicStore();

  useEffect(() => {
    // Vérifier si les données existent déjà
    if (students.length > 0) return;

    // Ajouter des étudiants de démonstration
    const demoStudents = [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Martin',
        studentId: '2024001',
        email: 'alice.martin@universite.fr',
        phone: '+33 1 23 45 67 89',
        dateOfBirth: '2000-05-15',
        placeOfBirth: 'Paris, France',
        address: '123 Rue de la République, 75001 Paris',
        bloodGroup: 'A+',
        allergies: 'Aucune',
        disabilities: '',
        faculty: 'Informatique',
        level: 'L3',
        academicYear: '2024-2025',
        status: 'Active' as const
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Dupont',
        studentId: '2024002', 
        email: 'bob.dupont@universite.fr',
        phone: '+33 1 23 45 67 90',
        dateOfBirth: '1999-12-03',
        placeOfBirth: 'Lyon, France',
        address: '456 Avenue des Sciences, 69000 Lyon',
        bloodGroup: 'O-',
        allergies: 'Arachides',
        disabilities: '',
        faculty: 'Informatique',
        level: 'L3',
        academicYear: '2024-2025',
        status: 'Active' as const
      },
      {
        id: '3',
        firstName: 'Claire',
        lastName: 'Bernard',
        studentId: '2024003',
        email: 'claire.bernard@universite.fr',
        phone: '+33 1 23 45 67 91',
        dateOfBirth: '2001-08-22',
        placeOfBirth: 'Marseille, France',
        address: '789 Boulevard de l\'Université, 13000 Marseille',
        bloodGroup: 'B+',
        allergies: '',
        disabilities: 'Dyslexie',
        faculty: 'Mathématiques',
        level: 'L2',
        academicYear: '2024-2025',
        status: 'Active' as const
      }
    ];

    // Ajouter des UE de démonstration
    const demoUEs = [
      {
        id: 'ue1',
        code: 'INFO101',
        title: 'Programmation Orientée Objet',
        credits: 6,
        type: 'Obligatoire' as const,
        passingGrade: 10,
        faculty: 'Informatique',
        level: 'L3',
        semester: 'S1' as const,
        prerequisites: []
      },
      {
        id: 'ue2',
        code: 'INFO102',
        title: 'Base de Données',
        credits: 6,
        type: 'Obligatoire' as const,
        passingGrade: 10,
        faculty: 'Informatique',
        level: 'L3',
        semester: 'S1' as const,
        prerequisites: []
      },
      {
        id: 'ue3',
        code: 'MATH201',
        title: 'Analyse Fonctionnelle',
        credits: 8,
        type: 'Obligatoire' as const,
        passingGrade: 10,
        faculty: 'Mathématiques',
        level: 'L2',
        semester: 'S1' as const,
        prerequisites: []
      }
    ];

    // Ajouter des notes de démonstration
    const demoGrades = [
      {
        id: 'grade1',
        studentId: '1',
        ueId: 'ue1',
        grade: 16.5,
        status: 'Validé' as const,
        session: 'Normale' as const,
        semester: 'S1',
        academicYear: '2024-2025'
      },
      {
        id: 'grade2',
        studentId: '1',
        ueId: 'ue2',
        grade: 12.0,
        status: 'Validé' as const,
        session: 'Normale' as const,
        semester: 'S1',
        academicYear: '2024-2025'
      },
      {
        id: 'grade3',
        studentId: '2',
        ueId: 'ue1',
        grade: 8.5,
        status: 'À reprendre' as const,
        session: 'Normale' as const,
        semester: 'S1',
        academicYear: '2024-2025'
      },
      {
        id: 'grade4',
        studentId: '3',
        ueId: 'ue3',
        grade: 14.0,
        status: 'Validé' as const,
        session: 'Normale' as const,
        semester: 'S1',
        academicYear: '2024-2025'
      }
    ];

    // Ajouter des reprises de démonstration
    const demoRetakes = [
      {
        id: 'retake1',
        studentId: '2',
        ueId: 'ue1',
        originalGrade: 8.5,
        retakeGrade: undefined,
        scheduledSemester: 'S2',
        status: 'Programmé' as const
      }
    ];

    // Initialiser les données
    demoStudents.forEach(student => addStudent(student));
    demoUEs.forEach(ue => addUE(ue));
    demoGrades.forEach(grade => addGrade(grade));
    demoRetakes.forEach(retake => addRetake(retake));

  }, [students.length, addStudent, addUE, addGrade, addRetake]);
};
