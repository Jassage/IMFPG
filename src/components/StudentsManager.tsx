import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAcademicStore } from '../store/academicStore';
import { Student } from '../types/academic';
import { StudentForm } from './students/StudentForm';
import { StudentDetails } from './students/StudentDetails';

export const StudentsManager = () => {
  const { students, getStudentGrades, deleteStudent } = useAcademicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.faculty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentStatus = (studentId: string) => {
    const grades = getStudentGrades(studentId);
    const failedGrades = grades.filter(g => g.status === 'À reprendre');
    
    if (failedGrades.length > 0) {
      return { status: 'Reprises', count: failedGrades.length, variant: 'destructive' as const };
    }
    return { status: 'En règle', count: 0, variant: 'default' as const };
  };

  const handleNewStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleEditFromDetails = (student: Student) => {
    setShowDetails(false);
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = (student: Student) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant ${student.firstName} ${student.lastName} ? Cette action est irréversible.`)) {
      deleteStudent(student.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Étudiants</h2>
          <p className="text-muted-foreground">
            {students.length} étudiant{students.length > 1 ? 's' : ''} inscrit{students.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleNewStudent}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nouvel Étudiant
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{students.length}</div>
            <div className="text-sm text-muted-foreground">Total étudiants</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {students.filter(s => s.status === 'Active').length}
            </div>
            <div className="text-sm text-muted-foreground">Actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {students.filter(s => s.status === 'Graduated').length}
            </div>
            <div className="text-sm text-muted-foreground">Diplômés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {students.filter(s => {
                const grades = getStudentGrades(s.id);
                return grades.some(g => g.status === 'À reprendre');
              }).length}
            </div>
            <div className="text-sm text-muted-foreground">Avec reprises</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Rechercher un étudiant</span>
          </CardTitle>
          <input
            type="text"
            placeholder="Nom, prénom, numéro étudiant ou faculté..."
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
                      <div className="flex items-center space-x-2">
                        <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                          {student.status === 'Active' ? 'Actif' : student.status === 'Inactive' ? 'Inactif' : 'Diplômé'}
                        </Badge>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.status}
                          {statusInfo.count > 0 && ` (${statusInfo.count})`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(student)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditStudent(student)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteStudent(student)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
            <p className="text-muted-foreground">
              {searchTerm ? 'Aucun étudiant trouvé pour cette recherche' : 'Aucun étudiant inscrit'}
            </p>
            {!searchTerm && (
              <Button className="mt-4" onClick={handleNewStudent}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter le premier étudiant
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <StudentForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        student={editingStudent}
        onSuccess={handleFormSuccess}
      />

      <StudentDetails
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        student={selectedStudent}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
};
