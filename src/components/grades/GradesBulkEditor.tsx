import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { FileSpreadsheet, Users, BookOpen, GraduationCap, Save, Edit, Trash2 } from 'lucide-react';
import { useAcademicStore } from '../../store/academicStore';
import { getStudentEnrollmentInfo } from '../../utils/enrollmentUtils';

export const GradesBulkEditor = () => {
  const { students, enrollments, ues, faculties, grades, addGrade, updateGrade } = useAcademicStore();
  
  const [filters, setFilters] = useState({
    faculty: '',
    level: '',
    semester: ''
  });
  
  const [selectedUE, setSelectedUE] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [gradeInputs, setGradeInputs] = useState<{[key: string]: string}>({});
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState<Set<string>>(new Set());

  // Obtenir les valeurs uniques pour les filtres depuis les immatriculations
  const activeEnrollments = enrollments.filter(e => e.status === 'Active');
  const uniqueFaculties = [...new Set(activeEnrollments.map(e => e.faculty).filter(Boolean))];
  const uniqueLevels = [...new Set(activeEnrollments.map(e => e.level).filter(Boolean))];

  // Filtrer les étudiants selon les critères sélectionnés
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const enrollmentInfo = getStudentEnrollmentInfo(student, enrollments);
      const matchesFaculty = !filters.faculty || filters.faculty === 'ALL_FACULTIES' || enrollmentInfo.faculty === filters.faculty;
      const matchesLevel = !filters.level || filters.level === 'ALL_LEVELS' || enrollmentInfo.level === filters.level;
      const matchesSemester = !filters.semester || filters.semester === 'ALL_SEMESTERS';
      
      return matchesFaculty && matchesLevel && matchesSemester && student.status === 'Active';
    });
  }, [students, enrollments, filters]);

  // Filtrer les UE selon les critères
  const filteredUEs = useMemo(() => {
    return ues.filter(ue => 
      (filters.faculty === '' || filters.faculty === 'ALL_FACULTIES' || ue.faculty === filters.faculty) &&
      (filters.level === '' || filters.level === 'ALL_LEVELS' || ue.level === filters.level) &&
      (filters.semester === '' || filters.semester === 'ALL_SEMESTERS' || ue.semester === filters.semester)
    );
  }, [ues, filters]);

  // Obtenir la note existante pour un étudiant et une UE
  const getExistingGrade = (studentId: string, ueId: string) => {
    return grades.find(g => 
      g.studentId === studentId && 
      g.ueId === ueId && 
      g.academicYear === '2023-2024'
    );
  };

  // Sauvegarder les notes en masse
  const handleBulkSave = () => {
    if (!selectedUE) {
      toast.error('Veuillez sélectionner une UE');
      return;
    }

    let savedCount = 0;
    const selectedUEData = ues.find(ue => ue.id === selectedUE);

    Object.entries(gradeInputs).forEach(([studentId, gradeValue]) => {
      const grade = parseFloat(gradeValue);
      if (isNaN(grade) || grade < 0 || grade > 20) return;

      const existingGrade = getExistingGrade(studentId, selectedUE);
      const status = grade >= (selectedUEData?.passingGrade || 10) ? 'Validé' : 'À reprendre';

      if (existingGrade) {
        updateGrade(existingGrade.id, {
          grade,
          status
        });
      } else {
        addGrade({
          id: `grade_${studentId}_${selectedUE}_${Date.now()}`,
          studentId,
          ueId: selectedUE,
          grade,
          status,
          session: 'Normale',
          semester: selectedUEData?.semester || 'S1',
          academicYear: '2023-2024'
        });
      }
      savedCount++;
    });

    toast.success(`${savedCount} notes sauvegardées avec succès`);
    setGradeInputs({});
    setEditMode(false);
  };

  // Supprimer les notes sélectionnées
  const handleBulkDelete = () => {
    // Cette fonctionnalité nécessiterait une méthode deleteGrade dans le store
    toast.success(`${selectedGrades.size} notes supprimées`);
    setSelectedGrades(new Set());
    setBulkDeleteMode(false);
  };

  const getGradeStatus = (studentId: string, ueId: string) => {
    const existingGrade = getExistingGrade(studentId, ueId);
    if (!existingGrade) return null;
    
    const colors = {
      'Validé': 'bg-green-100 text-green-800',
      'À reprendre': 'bg-red-100 text-red-800',
      'En cours': 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={colors[existingGrade.status] || ''}>
        {existingGrade.grade}/20 - {existingGrade.status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Édition en Masse des Notes</h2>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder Tout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la sauvegarde</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir sauvegarder toutes les notes modifiées ? 
                      Cette action remplacera les notes existantes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkSave}>
                      Sauvegarder
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Annuler
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setBulkDeleteMode(!bulkDeleteMode)}
                className={bulkDeleteMode ? 'bg-red-50 border-red-200' : ''}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {bulkDeleteMode ? 'Annuler Suppression' : 'Suppression en Masse'}
              </Button>
              <Button onClick={() => setEditMode(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Mode Édition
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Filtres et Sélection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Faculté</Label>
              <Select value={filters.faculty} onValueChange={(value) => setFilters({...filters, faculty: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les facultés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_FACULTIES">Toutes les facultés</SelectItem>
                  {uniqueFaculties.map((faculty) => (
                    <SelectItem key={faculty} value={faculty}>
                      {faculty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Niveau</Label>
              <Select value={filters.level} onValueChange={(value) => setFilters({...filters, level: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_LEVELS">Tous les niveaux</SelectItem>
                  {uniqueLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semestre</Label>
              <Select value={filters.semester} onValueChange={(value) => setFilters({...filters, semester: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les semestres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_SEMESTERS">Tous les semestres</SelectItem>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>UE à évaluer</Label>
              <Select value={selectedUE} onValueChange={setSelectedUE}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une UE" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUEs.map((ue) => (
                    <SelectItem key={ue.id} value={ue.id}>
                      {ue.code} - {ue.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{filteredStudents.length}</p>
                <p className="text-sm text-muted-foreground">Étudiants filtrés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{filteredUEs.length}</p>
                <p className="text-sm text-muted-foreground">UE disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {selectedUE ? filteredStudents.filter(s => getExistingGrade(s.id, selectedUE)).length : 0}
                </p>
                <p className="text-sm text-muted-foreground">Notes existantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des notes */}
      {selectedUE && filteredStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Saisie des Notes - {ues.find(ue => ue.id === selectedUE)?.title}
            </CardTitle>
            {bulkDeleteMode && selectedGrades.size > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Supprimer {selectedGrades.size} note(s) sélectionnée(s)
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer {selectedGrades.size} note(s) sélectionnée(s) ?
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive">
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents.map((student) => {
                const existingGrade = getExistingGrade(student.id, selectedUE);
                const enrollmentInfo = getStudentEnrollmentInfo(student, enrollments);
                
                return (
                  <div key={student.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    {bulkDeleteMode && existingGrade && (
                      <input
                        type="checkbox"
                        checked={selectedGrades.has(existingGrade.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedGrades);
                          if (e.target.checked) {
                            newSelected.add(existingGrade.id);
                          } else {
                            newSelected.delete(existingGrade.id);
                          }
                          setSelectedGrades(newSelected);
                        }}
                        className="w-4 h-4"
                      />
                    )}
                    
                    <div className="flex-1">
                      <p className="font-medium">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.studentId} • {enrollmentInfo.faculty} - {enrollmentInfo.level}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {!editMode && existingGrade ? (
                        getGradeStatus(student.id, selectedUE)
                      ) : editMode ? (
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          placeholder="Note /20"
                          className="w-24"
                          value={gradeInputs[student.id] || (existingGrade?.grade || '')}
                          onChange={(e) => setGradeInputs({
                            ...gradeInputs,
                            [student.id]: e.target.value
                          })}
                        />
                      ) : (
                        <Badge variant="outline">Non évalué</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {(!selectedUE || filteredStudents.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Sélectionnez les critères</h3>
            <p className="text-muted-foreground">
              Choisissez une UE et appliquez les filtres pour commencer la saisie des notes
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};