
import { useState } from 'react';
import { Plus, Search, Edit, Trash2, UserCheck, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAcademicStore } from '../store/academicStore';
import { StudentForm } from './students/StudentForm';
import { StudentDetails } from './students/StudentDetails';
import { Student } from '../types/academic';
import { getStudentEnrollmentInfo } from '../utils/enrollmentUtils';

export const StudentsManager = () => {
  const { students, enrollments, deleteStudent } = useAcademicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      deleteStudent(studentId);
    }
  };

  const getStatusBadge = (status: Student['status']) => {
    const variants = {
      'Active': 'default',
      'Inactive': 'secondary',
      'Graduated': 'outline'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Étudiants</h2>
          <p className="text-muted-foreground">
            Gérez les informations des étudiants
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedStudent(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Étudiant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedStudent ? 'Modifier Étudiant' : 'Nouvel Étudiant'}
              </DialogTitle>
            </DialogHeader>
            <StudentForm 
              student={selectedStudent} 
              onClose={() => {
                setIsFormOpen(false);
                setSelectedStudent(null);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Liste des Étudiants ({filteredStudents.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {student.firstName} {student.lastName}
                          </h3>
                          {getStatusBadge(student.status)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>ID: {student.studentId} • {student.email}</p>
                          <p>
                            {(() => {
                              const enrollmentInfo = getStudentEnrollmentInfo(student, enrollments);
                              return `${enrollmentInfo.faculty} - ${enrollmentInfo.level} (${enrollmentInfo.academicYear})`;
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(student)}
                      >
                        <GraduationCap className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStudent(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun étudiant trouvé</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'Étudiant</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <StudentDetails 
              student={selectedStudent} 
              onClose={() => {
                setIsDetailsOpen(false);
                setSelectedStudent(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
