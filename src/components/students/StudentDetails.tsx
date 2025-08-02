import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Heart, AlertTriangle, Edit, Trash2, BookOpen, Award, Users } from 'lucide-react';
import { Student } from '../../types/academic';
import { useAcademicStore } from '../../store/academicStore';
import { getStudentEnrollmentInfo } from '../../utils/enrollmentUtils';

interface StudentDetailsProps {
  student: Student;
  onClose: () => void;
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
}

export const StudentDetails = ({ student, onClose, onEdit, onDelete }: StudentDetailsProps) => {
  const { getStudentGrades, enrollments, getStudentGuardians, getStudentPayments, getStudentRetakes } = useAcademicStore();
  const [activeTab, setActiveTab] = useState<'info' | 'grades' | 'payments' | 'retakes' | 'guardians'>('info');
  
  const grades = getStudentGrades(student.id);
  const enrollmentInfo = getStudentEnrollmentInfo(student, enrollments);
  const guardians = getStudentGuardians(student.id);
  const payments = getStudentPayments(student.id);
  const retakes = getStudentRetakes(student.id);

  const getStatusBadge = (status: Student['status']) => {
    const config = {
      'Active': { variant: 'default' as const, label: 'Actif' },
      'Inactive': { variant: 'secondary' as const, label: 'Inactif' },
      'Graduated': { variant: 'outline' as const, label: 'Diplômé' }
    };
    
    const { variant, label } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.grade, 0);
    return Math.round((total / grades.length) * 100) / 100;
  };

  const getGradeStatusColor = (status: string) => {
    switch (status) {
      case 'Validé': return 'text-green-600';
      case 'À reprendre': return 'text-red-600';
      case 'En cours': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-auto">
      {/* En-tête avec photo et infos principales */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
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
            
            {/* Actions */}
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(student)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
              )}
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer l'étudiant <strong>{student.firstName} {student.lastName}</strong> ?
                        Cette action est irréversible et supprimera toutes les données associées (notes, paiements, etc.).
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(student.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation par onglets */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'info', label: 'Informations', icon: User },
          { id: 'grades', label: 'Notes', icon: BookOpen, count: grades.length },
          { id: 'payments', label: 'Paiements', icon: Award, count: payments.length },
          { id: 'retakes', label: 'Rattrapages', icon: AlertTriangle, count: retakes.length },
          { id: 'guardians', label: 'Tuteurs', icon: Users, count: guardians.length }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== undefined && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {tab.count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'info' && (
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
                <label className="text-sm font-medium text-muted-foreground">Moyenne Générale</label>
                <p className="font-medium text-lg">{calculateGPA()}/20</p>
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

          {/* Informations médicales */}
          {(student.allergies || student.disabilities) && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Informations Médicales
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      )}

      {activeTab === 'grades' && (
        <Card>
          <CardHeader>
            <CardTitle>Notes et Évaluations</CardTitle>
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
          </CardHeader>
          <CardContent>
            {grades.length > 0 ? (
              <div className="space-y-3">
                {grades.map((grade) => (
                  <div key={grade.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">UE: {grade.ueId}</p>
                      <p className="text-sm text-muted-foreground">
                        {grade.semester} - {grade.academicYear} ({grade.session})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{grade.grade}/20</p>
                      <p className={`text-sm ${getGradeStatusColor(grade.status)}`}>
                        {grade.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Aucune note enregistrée</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Autres onglets similaires pour payments, retakes, guardians */}
      {activeTab === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des Paiements</CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{payment.type}</p>
                      <p className="text-sm text-muted-foreground">{payment.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{payment.amount} HTG</p>
                      <Badge variant={payment.status === 'Payé' ? 'default' : 'destructive'}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Aucun paiement enregistré</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};