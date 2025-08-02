
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Heart, AlertTriangle } from 'lucide-react';
import { Student } from '../../types/academic';
import { useAcademicStore } from '../../store/academicStore';
import { getStudentEnrollmentInfo } from '../../utils/enrollmentUtils';

interface StudentDetailsProps {
  student: Student;
  onClose: () => void;
}

export const StudentDetails = ({ student }: StudentDetailsProps) => {
  const { getStudentGrades, enrollments } = useAcademicStore();
  const grades = getStudentGrades(student.id);
  const enrollmentInfo = getStudentEnrollmentInfo(student, enrollments);

  const getStatusBadge = (status: Student['status']) => {
    const config = {
      'Active': { variant: 'default' as const, label: 'Actif' },
      'Inactive': { variant: 'secondary' as const, label: 'Inactif' },
      'Graduated': { variant: 'outline' as const, label: 'Diplômé' }
    };
    
    const { variant, label } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec photo et infos principales */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">
                  {student.firstName} {student.lastName}
                </h2>
                {getStatusBadge(student.status)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>ID: {student.studentId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations académiques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Informations Académiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Faculté</label>
              <p className="font-medium">{enrollmentInfo.faculty}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Niveau</label>
              <p className="font-medium">{enrollmentInfo.level}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Année Académique</label>
              <p className="font-medium">{enrollmentInfo.academicYear}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nombre de Notes</label>
              <p className="font-medium">{grades.length} évaluations</p>
            </div>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Lieu de Naissance</label>
              <p className="font-medium">{student.placeOfBirth}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Adresse</label>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="font-medium">{student.address}</p>
              </div>
            </div>
            {student.bloodGroup && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Groupe Sanguin</label>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <p className="font-medium">{student.bloodGroup}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informations médicales */}
      {(student.allergies || student.disabilities) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Informations Médicales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {student.allergies && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Allergies</label>
                <p className="font-medium">{student.allergies}</p>
              </div>
            )}
            {student.disabilities && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Handicaps / Besoins Spéciaux</label>
                <p className="font-medium">{student.disabilities}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Résumé des notes */}
      {grades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé des Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {grades.filter(g => g.status === 'Validé').length}
                </p>
                <p className="text-sm text-muted-foreground">Validées</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {grades.filter(g => g.status === 'À reprendre').length}
                </p>
                <p className="text-sm text-muted-foreground">À reprendre</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {grades.filter(g => g.status === 'En cours').length}
                </p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
