
import { useState, useEffect } from 'react';
import { Plus, Save, X, Edit, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAcademicStore } from '../../store/academicStore';
import { Grade } from '../../types/academic';

export const GradesBulkEditor = () => {
  const { students, ues, grades, faculties, addGrade, updateGrade } = useAcademicStore();
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2023-2024');
  const [selectedUE, setSelectedUE] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [gradeInputs, setGradeInputs] = useState<{[key: string]: string}>({});

  // Filtrer les étudiants selon les critères
  const filteredStudents = students.filter(student => 
    (selectedFaculty === '' || selectedFaculty === 'ALL_FACULTIES' || student.faculty === selectedFaculty) &&
    (selectedLevel === '' || selectedLevel === 'ALL_LEVELS' || student.level === selectedLevel) &&
    student.status === 'Active'
  );

  // Filtrer les UE selon les critères
  const filteredUEs = ues.filter(ue => 
    (selectedFaculty === '' || selectedFaculty === 'ALL_FACULTIES' || ue.faculty === selectedFaculty) &&
    (selectedLevel === '' || selectedLevel === 'ALL_LEVELS' || ue.level === selectedLevel) &&
    (selectedSemester === '' || selectedSemester === 'ALL_SEMESTERS' || ue.semester === selectedSemester)
  );

  // Obtenir les niveaux disponibles pour la faculté sélectionnée
  const availableLevels = selectedFaculty && selectedFaculty !== 'ALL_FACULTIES'
    ? [...new Set(students.filter(s => s.faculty === selectedFaculty).map(s => s.level))]
    : [...new Set(students.map(s => s.level))];

  // Obtenir les notes existantes pour les étudiants et UE sélectionnés
  const getExistingGrade = (studentId: string, ueId: string) => {
    return grades.find(g => 
      g.studentId === studentId && 
      g.ueId === ueId && 
      g.academicYear === selectedAcademicYear
    );
  };

  const handleGradeChange = (studentId: string, value: string) => {
    setGradeInputs(prev => ({
      ...prev,
      [`${studentId}-${selectedUE}`]: value
    }));
  };

  const calculateStatus = (grade: number, passingGrade: number): Grade['status'] => {
    if (grade >= passingGrade) return 'Validé';
    return 'À reprendre';
  };

  const handleSaveGrades = () => {
    if (!selectedUE) return;

    const ue = ues.find(u => u.id === selectedUE);
    if (!ue) return;

    Object.entries(gradeInputs).forEach(([key, value]) => {
      const [studentId] = key.split('-');
      const gradeValue = parseFloat(value);
      
      if (!isNaN(gradeValue) && gradeValue >= 0 && gradeValue <= 20) {
        const existingGrade = getExistingGrade(studentId, selectedUE);
        const status = calculateStatus(gradeValue, ue.passingGrade);
        
        if (existingGrade) {
          updateGrade(existingGrade.id, {
            grade: gradeValue,
            status,
            session: 'Normale',
            semester: selectedSemester
          });
        } else {
          addGrade({
            id: `grade-${Date.now()}-${studentId}-${selectedUE}`,
            studentId,
            ueId: selectedUE,
            grade: gradeValue,
            status,
            session: 'Normale',
            semester: selectedSemester,
            academicYear: selectedAcademicYear
          });
        }
      }
    });

    setEditMode(false);
    setGradeInputs({});
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setGradeInputs({});
  };

  useEffect(() => {
    if (selectedUE && editMode) {
      const initialInputs: {[key: string]: string} = {};
      filteredStudents.forEach(student => {
        const existingGrade = getExistingGrade(student.id, selectedUE);
        if (existingGrade) {
          initialInputs[`${student.id}-${selectedUE}`] = existingGrade.grade.toString();
        }
      });
      setGradeInputs(initialInputs);
    }
  }, [selectedUE, editMode, filteredStudents.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Édition de Notes en Masse</h2>
          <p className="text-muted-foreground">
            Sélectionnez les critères et l'UE pour ajouter ou modifier les notes
          </p>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de Sélection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Faculté</label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les facultés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_FACULTIES">Toutes les facultés</SelectItem>
                  {faculties.map(faculty => (
                    <SelectItem key={faculty.id} value={faculty.name}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Niveau</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_LEVELS">Tous les niveaux</SelectItem>
                  {availableLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_SEMESTERS">Tous les semestres</SelectItem>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Année Académique</label>
              <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">UE</label>
              <Select value={selectedUE} onValueChange={setSelectedUE}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une UE" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUEs.map(ue => (
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

      {/* Résumé des sélections */}
      {(selectedFaculty || selectedLevel || selectedSemester || selectedUE) && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {selectedFaculty && (
                <Badge variant="secondary">Faculté: {selectedFaculty}</Badge>
              )}
              {selectedLevel && (
                <Badge variant="secondary">Niveau: {selectedLevel}</Badge>
              )}
              {selectedSemester && (
                <Badge variant="secondary">Semestre: {selectedSemester}</Badge>
              )}
              {selectedUE && (
                <Badge variant="secondary">
                  UE: {ues.find(u => u.id === selectedUE)?.code}
                </Badge>
              )}
              <Badge variant="outline">
                {filteredStudents.length} étudiants trouvés
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table des notes */}
      {selectedUE && filteredStudents.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Notes - {ues.find(u => u.id === selectedUE)?.code}
              </CardTitle>
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <Button onClick={handleSaveGrades} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit} size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditMode(true)} size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Éditer
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>ID Étudiant</TableHead>
                  <TableHead>Note Actuelle</TableHead>
                  <TableHead>Statut</TableHead>
                  {editMode && <TableHead>Nouvelle Note</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map(student => {
                  const existingGrade = getExistingGrade(student.id, selectedUE);
                  const ue = ues.find(u => u.id === selectedUE);
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>
                        {existingGrade ? (
                          <span className={
                            existingGrade.grade >= (ue?.passingGrade || 10)
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }>
                            {existingGrade.grade.toFixed(2)}/20
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Non noté</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {existingGrade ? (
                          <Badge 
                            variant={existingGrade.status === 'Validé' ? 'default' : 'destructive'}
                          >
                            {existingGrade.status}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">En attente</Badge>
                        )}
                      </TableCell>
                      {editMode && (
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            placeholder="Note /20"
                            value={gradeInputs[`${student.id}-${selectedUE}`] || ''}
                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedUE && filteredStudents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>Aucun étudiant trouvé avec les critères sélectionnés</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
