import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAcademicStore } from '../store/academicStore';
import { AlertTriangle, Calendar, CheckCircle, Clock } from 'lucide-react';
import { RetakeScheduler } from './RetakeScheduler';
import { Student, UE, Grade, Retake } from '../types/academic';

interface StudentRetakeInfo {
  student: Student;
  failedGrades: Grade[];
  scheduledRetakes: Retake[];
}

export const RetakesManager = () => {
  const { students, ues, grades, retakes, getStudent } = useAcademicStore();
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

  const getUEInfo = (ueId: string): UE | undefined => {
    return ues.find(ue => ue.id === ueId);
  };

  const getRetakeStatus = (studentId: string, ueId: string): string => {
    const retake = retakes.find(r => r.studentId === studentId && r.ueId === ueId);
    return retake?.status || 'Non programmé';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Programmé': return 'default';
      case 'En cours': return 'secondary';
      case 'Terminé': return 'outline';
      default: return 'destructive';
    }
  };

  const studentsWithRetakes = getStudentsWithRetakes();

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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Étudiants avec reprises
              </p>
              <p className="text-2xl font-bold">{studentsWithRetakes.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Reprises programmées
              </p>
              <p className="text-2xl font-bold">
                {retakes.filter(r => r.status === 'Programmé').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Reprises terminées
              </p>
              <p className="text-2xl font-bold">
                {retakes.filter(r => r.status === 'Terminé').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Tableau des reprises */}
      <Card>
        <CardHeader>
          <CardTitle>Étudiants avec UE à reprendre</CardTitle>
        </CardHeader>
        <CardContent>
          {studentsWithRetakes.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">Aucune reprise en attente</p>
              <p className="text-muted-foreground">Tous les étudiants sont à jour</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>UE Échouée</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Statut Reprise</TableHead>
                  <TableHead>Semestre Programmé</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsWithRetakes.map(({ student, failedGrades }) => 
                  failedGrades.map((grade) => {
                    const ue = getUEInfo(grade.ueId);
                    const retakeStatus = getRetakeStatus(student.id, grade.ueId);
                    const retake = retakes.find(r => r.studentId === student.id && r.ueId === grade.ueId);
                    
                    return (
                      <TableRow key={`${student.id}-${grade.ueId}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-muted-foreground">{student.studentId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{ue?.code}</p>
                            <p className="text-sm text-muted-foreground">{ue?.title}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            {grade.grade}/20
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(retakeStatus)}>
                            {retakeStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {retake?.scheduledSemester || '-'}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(student.id);
                              setShowScheduler(true);
                            }}
                          >
                            Programmer
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de programmation des reprises */}
      {showScheduler && (
        <RetakeScheduler
          isOpen={showScheduler}
          onClose={() => {
            setShowScheduler(false);
            setSelectedStudent(null);
          }}
          selectedStudentId={selectedStudent}
        />
      )}
    </div>
  );
};
