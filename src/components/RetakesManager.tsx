
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAcademicStore } from '../store/academicStore';
import { Calendar } from 'lucide-react';
import { RetakeScheduler } from './RetakeScheduler';
import { RetakeStats } from './retakes/RetakeStats';
import { RetakeTable } from './retakes/RetakeTable';
import { Student, Grade, Retake } from '../types/academic';

interface StudentRetakeInfo {
  student: Student;
  failedGrades: Grade[];
  scheduledRetakes: Retake[];
}

export const RetakesManager = () => {
  const { students, ues, grades, retakes } = useAcademicStore();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);

  // Obtenir les étudiants avec des UE à reprendre
  const getStudentsWithRetakes = (): StudentRetakeInfo[] => {
    const studentsWithRetakes: StudentRetakeInfo[] = [];

    students.forEach(student => {
      const studentGrades = grades.filter(g => g.studentId === student.id);
      const failedGrades = studentGrades.filter(g => g.status === 'À reprendre');
      const scheduledRetakes = retakes.filter(r => r.studentId === student.id);

      if (failedGrades.length > 0) {
        studentsWithRetakes.push({
          student,
          failedGrades,
          scheduledRetakes
        });
      }
    });

    return studentsWithRetakes;
  };

  const studentsWithRetakes = getStudentsWithRetakes();

  const handleProgrammerClick = (studentId: string) => {
    setSelectedStudent(studentId);
    setShowScheduler(true);
  };

  const handleCloseScheduler = () => {
    setShowScheduler(false);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Reprises</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowScheduler(true)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Programmer Reprises
          </Button>
        </div>
      </div>

      <RetakeStats 
        studentsWithRetakesCount={studentsWithRetakes.length}
        retakes={retakes}
      />

      <RetakeTable 
        studentsWithRetakes={studentsWithRetakes}
        ues={ues}
        retakes={retakes}
        onProgrammerClick={handleProgrammerClick}
      />

      {showScheduler && (
        <RetakeScheduler
          isOpen={showScheduler}
          onClose={handleCloseScheduler}
          selectedStudentId={selectedStudent}
        />
      )}
    </div>
  );
};
