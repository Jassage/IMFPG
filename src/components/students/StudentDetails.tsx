
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAcademicStore } from '../../store/academicStore';
import { Student } from '../../types/academic';
import { X, Mail, Phone, MapPin, Calendar, Heart, AlertTriangle, BookOpen } from 'lucide-react';

interface StudentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit?: (student: Student) => void;
}

export const StudentDetails = ({ isOpen, onClose, student, onEdit }: StudentDetailsProps) => {
  const { getStudentGrades, ues, grades } = useAcademicStore();

  if (!isOpen || !student) return null;

  const studentGrades = getStudentGrades(student.id);
  const failedGrades = studentGrades.filter(g => g.status === 'À reprendre');
  const validatedGrades = studentGrades.filter(g => g.status === 'Validé');

  const getStatusBadge = () => {
    if (failedGrades.length > 0) {
      return <Badge variant="destructive">Reprises ({failedGrades.length})</Badge>;
    }
    return <Badge variant="default">En règle</Badge>;
  };

  const getUETitle = (ueId: string) => {
    const ue = ues.find(u => u.id === ueId);
    return ue ? `${ue.code} - ${ue.title}` : 'UE inconnue';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              {student.photo ? (
                <img src={student.photo} alt={`${student.firstName} ${student.lastName}`} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-muted-foreground">
                  {student.firstName[0]}{student.lastName[0]}
                </span>
              )}
            </div>
            <div>
              <CardTitle className="text-2xl">
                {student.firstName} {student.lastName}
              </CardTitle>
              <p className="text-muted-foreground">{student.studentId}</p>
              {getStatusBadge()}
            </div>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(student)}>
                Modifier
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Né(e) le {new Date(student.dateOfBirth).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{student.placeOfBirth}</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Adresse</p>
              <p>{student.address}</p>
            </div>
          </div>

          <Separator />

          {/* Informations académiques */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informations académiques</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Faculté</p>
                <p className="font-medium">{student.faculty}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Niveau</p>
                <p className="font-medium">{student.level}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Année académique</p>
                <p className="font-medium">{student.academicYear}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                  {student.status === 'Active' ? 'Actif' : student.status === 'Inactive' ? 'Inactif' : 'Diplômé'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations médicales */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Informations médicales
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Groupe sanguin</p>
                <p className="font-medium">{student.bloodGroup || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Allergies</p>
                <p>{student.allergies || 'Aucune allergie connue'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Handicaps/Besoins spéciaux</p>
                <p>{student.disabilities || 'Aucun handicap connu'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Résultats académiques */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Résultats académiques
            </h3>
            
            {studentGrades.length === 0 ? (
              <p className="text-muted-foreground">Aucune note enregistrée</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-2xl text-green-600">{validatedGrades.length}</p>
                    <p className="text-muted-foreground">UE validées</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-2xl text-red-600">{failedGrades.length}</p>
                    <p className="text-muted-foreground">UE à reprendre</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-2xl">{studentGrades.length}</p>
                    <p className="text-muted-foreground">Total UE</p>
                  </div>
                </div>

                {failedGrades.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center text-red-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      UE à reprendre
                    </h4>
                    <div className="space-y-2">
                      {failedGrades.map((grade) => (
                        <div key={grade.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                          <span className="text-sm">{getUETitle(grade.ueId)}</span>
                          <Badge variant="destructive">{grade.grade}/20</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validatedGrades.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-green-600">UE validées</h4>
                    <div className="space-y-2">
                      {validatedGrades.slice(0, 5).map((grade) => (
                        <div key={grade.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                          <span className="text-sm">{getUETitle(grade.ueId)}</span>
                          <Badge variant="default">{grade.grade}/20</Badge>
                        </div>
                      ))}
                      {validatedGrades.length > 5 && (
                        <p className="text-sm text-muted-foreground text-center">
                          ... et {validatedGrades.length - 5} autres UE validées
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
