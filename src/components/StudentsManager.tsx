
import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAcademicStore } from '../store/academicStore';
import { Student } from '../types/academic';

export const StudentsManager = () => {
  const { students, getStudentGrades } = useAcademicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentStatus = (studentId: string) => {
    const grades = getStudentGrades(studentId);
    const failedGrades = grades.filter(g => g.status === 'À reprendre');
    
    if (failedGrades.length > 0) {
      return { status: 'Reprises', count: failedGrades.length, variant: 'destructive' as const };
    }
    return { status: 'En règle', count: 0, variant: 'default' as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Étudiants</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Étudiant
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Rechercher un étudiant</span>
          </CardTitle>
          <input
            type="text"
            placeholder="Nom, prénom ou numéro étudiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {filteredStudents.map((student) => {
          const statusInfo = getStudentStatus(student.id);
          return (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      {student.photo ? (
                        <img src={student.photo} alt={`${student.firstName} ${student.lastName}`} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold text-muted-foreground">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {student.studentId} • {student.faculty} - {student.level}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.email} • {student.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={statusInfo.variant}>
                      {statusInfo.status}
                      {statusInfo.count > 0 && ` (${statusInfo.count})`}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Aucun étudiant trouvé</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
