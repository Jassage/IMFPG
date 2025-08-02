import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, UserPlus, Eye, Trash2 } from 'lucide-react';
import { useAcademicStore } from '../../store/academicStore';
import { Student, Enrollment } from '../../types/academic';

interface EnrollmentFormProps {
  student: Student;
  enrollment?: Enrollment | null;
  onClose: () => void;
}

const EnrollmentForm = ({ student, enrollment, onClose }: EnrollmentFormProps) => {
  const { addEnrollment, updateEnrollment, faculties } = useAcademicStore();
  
  const [formData, setFormData] = useState({
    faculty: '',
    level: '',
    academicYear: '2024-2025',
    status: 'Active' as 'Active' | 'Suspended' | 'Completed'
  });

  useEffect(() => {
    if (enrollment) {
      setFormData({
        faculty: enrollment.faculty || '',
        level: enrollment.level || '',
        academicYear: enrollment.academicYear || '2024-2025',
        status: enrollment.status || 'Active'
      });
    }
  }, [enrollment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.faculty && formData.level && formData.academicYear) {
      const enrollmentData: Enrollment = {
        id: enrollment?.id || crypto.randomUUID(),
        studentId: student.id,
        enrollmentDate: enrollment?.enrollmentDate || new Date().toISOString(),
        ...formData
      };

      if (enrollment) {
        updateEnrollment(enrollment.id, enrollmentData);
      } else {
        addEnrollment(enrollmentData);
      }
      
      onClose();
    }
  };

  const validFaculties = faculties.filter(faculty => 
    faculty.name && 
    typeof faculty.name === 'string' && 
    faculty.name.trim().length > 0
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold">{student.firstName} {student.lastName}</h3>
        <p className="text-sm text-muted-foreground">ID: {student.studentId}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="faculty">Faculté *</Label>
          <Select value={formData.faculty || undefined} onValueChange={(value) => setFormData({...formData, faculty: value || ''})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une faculté" />
            </SelectTrigger>
            <SelectContent>
              {validFaculties.map((faculty) => (
                <SelectItem key={faculty.id} value={faculty.name}>
                  {faculty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Niveau *</Label>
          <Select value={formData.level || undefined} onValueChange={(value) => setFormData({...formData, level: value || ''})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L1">L1</SelectItem>
              <SelectItem value="L2">L2</SelectItem>
              <SelectItem value="L3">L3</SelectItem>
              <SelectItem value="M1">M1</SelectItem>
              <SelectItem value="M2">M2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="academicYear">Année Académique *</Label>
          <Select value={formData.academicYear} onValueChange={(value) => setFormData({...formData, academicYear: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
              <SelectItem value="2025-2026">2025-2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as 'Active' | 'Suspended' | 'Completed'})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Actif</SelectItem>
              <SelectItem value="Suspended">Suspendu</SelectItem>
              <SelectItem value="Completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit">
          {enrollment ? 'Modifier' : 'Immatriculer'}
        </Button>
      </div>
    </form>
  );
};

export const EnrollmentManager = () => {
  const { students, enrollments, deleteEnrollment, getStudentEnrollments } = useAcademicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [isEnrollmentFormOpen, setIsEnrollmentFormOpen] = useState(false);

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnrollStudent = (student: Student) => {
    setSelectedStudent(student);
    setSelectedEnrollment(null);
    setIsEnrollmentFormOpen(true);
  };

  const handleEditEnrollment = (student: Student, enrollment: Enrollment) => {
    setSelectedStudent(student);
    setSelectedEnrollment(enrollment);
    setIsEnrollmentFormOpen(true);
  };

  const handleDeleteEnrollment = (enrollmentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette immatriculation ?')) {
      deleteEnrollment(enrollmentId);
    }
  };

  const getEnrollmentStatusBadge = (status: Enrollment['status']) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default">Actif</Badge>;
      case 'Suspended':
        return <Badge variant="destructive">Suspendu</Badge>;
      case 'Completed':
        return <Badge variant="secondary">Terminé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestion des Immatriculations</h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un étudiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredStudents.map((student) => {
          const studentEnrollments = getStudentEnrollments(student.id);
          
          return (
            <Card key={student.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {student.firstName} {student.lastName}
                    </CardTitle>
                    <CardDescription>
                      ID: {student.studentId} • Email: {student.email}
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleEnrollStudent(student)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nouvelle Immatriculation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {studentEnrollments.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium">Immatriculations:</h4>
                    {studentEnrollments.map((enrollment) => (
                      <div key={enrollment.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">{enrollment.faculty} - {enrollment.level}</p>
                            <p className="text-sm text-muted-foreground">
                              Année: {enrollment.academicYear} • 
                              Inscrit le: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                            </p>
                          </div>
                          {getEnrollmentStatusBadge(enrollment.status)}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditEnrollment(student, enrollment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteEnrollment(enrollment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucune immatriculation pour cet étudiant</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Aucun étudiant trouvé</p>
        </div>
      )}

      <Dialog open={isEnrollmentFormOpen} onOpenChange={setIsEnrollmentFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEnrollment ? 'Modifier l\'immatriculation' : 'Nouvelle immatriculation'}
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <EnrollmentForm
              student={selectedStudent}
              enrollment={selectedEnrollment}
              onClose={() => setIsEnrollmentFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};