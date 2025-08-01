import { useState, useRef } from 'react';
import { FileText, Download, Printer, GraduationCap, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAcademicStore } from '../store/academicStore';

export const TranscriptGenerator = () => {
  const { students, grades, ues, faculties } = useAcademicStore();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('2023-2024');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const transcriptRef = useRef<HTMLDivElement>(null);

  const filteredStudents = students.filter(student => 
    selectedFaculty === '' || selectedFaculty === 'ALL_FACULTIES' || student.faculty === selectedFaculty
  );

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  const getStudentGrades = () => {
    if (!selectedStudent) return [];
    
    return grades.filter(grade => 
      grade.studentId === selectedStudent &&
      grade.academicYear === selectedYear &&
      (selectedSemester === '' || selectedSemester === 'ALL_SEMESTERS' || grade.semester === selectedSemester)
    );
  };

  const getUEDetails = (ueId: string) => {
    return ues.find(ue => ue.id === ueId);
  };

  const calculateGPA = (gradesList: typeof grades) => {
    if (gradesList.length === 0) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    gradesList.forEach(grade => {
      const ue = getUEDetails(grade.ueId);
      if (ue) {
        totalPoints += grade.grade * ue.credits;
        totalCredits += ue.credits;
      }
    });
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const calculateCreditsEarned = (gradesList: typeof grades) => {
    let totalCredits = 0;
    gradesList.forEach(grade => {
      if (grade.status === 'Validé') {
        const ue = getUEDetails(grade.ueId);
        if (ue) totalCredits += ue.credits;
      }
    });
    return totalCredits;
  };

  const handlePrint = () => {
    if (transcriptRef.current) {
      const printContent = transcriptRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const studentGrades = getStudentGrades();
  const gpa = calculateGPA(studentGrades);
  const creditsEarned = calculateCreditsEarned(studentGrades);
  const totalCreditsAttempted = studentGrades.reduce((total, grade) => {
    const ue = getUEDetails(grade.ueId);
    return total + (ue?.credits || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Génération de Bulletins</h2>
          <p className="text-muted-foreground">
            Créez et imprimez les bulletins de notes des étudiants
          </p>
        </div>
      </div>

      {/* Sélection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Paramètres du Bulletin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <label className="text-sm font-medium">Étudiant</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un étudiant" />
                </SelectTrigger>
                <SelectContent>
                  {filteredStudents.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} - {student.studentId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
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
              <label className="text-sm font-medium">Année Académique</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
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
          </div>
        </CardContent>
      </Card>

      {/* Aperçu du bulletin */}
      {selectedStudentData && studentGrades.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bulletin de Notes</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handlePrint} size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              ref={transcriptRef}
              className="bg-white p-8 border rounded-lg print:shadow-none print:border-none"
            >
              {/* En-tête officiel */}
              <div className="text-center border-b pb-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">UNIVERSITÉ SAINT JOSEPH</h1>
                <p className="text-lg text-gray-600">DE PÉTIONVILLE</p>
                <p className="text-sm text-gray-500 mt-2">Port-au-Prince, Haïti</p>
                <h2 className="text-xl font-semibold mt-4 text-blue-700">BULLETIN DE NOTES OFFICIEL</h2>
              </div>

              {/* Informations étudiant */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">INFORMATIONS ÉTUDIANT</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Nom:</span> {selectedStudentData.lastName}</p>
                    <p><span className="font-medium">Prénom:</span> {selectedStudentData.firstName}</p>
                    <p><span className="font-medium">ID Étudiant:</span> {selectedStudentData.studentId}</p>
                    <p><span className="font-medium">Email:</span> {selectedStudentData.email}</p>
                    <p><span className="font-medium">Téléphone:</span> {selectedStudentData.phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">INFORMATIONS ACADÉMIQUES</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Faculté:</span> {selectedStudentData.faculty}</p>
                    <p><span className="font-medium">Niveau:</span> {selectedStudentData.level}</p>
                    <p><span className="font-medium">Année Académique:</span> {selectedYear}</p>
                    <p><span className="font-medium">Statut:</span> {selectedStudentData.status}</p>
                    <p><span className="font-medium">Date d'émission:</span> {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>

              {/* Tableau des notes */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">RELEVÉ DE NOTES</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Code UE</TableHead>
                      <TableHead className="font-semibold">Intitulé</TableHead>
                      <TableHead className="font-semibold text-center">Crédits</TableHead>
                      <TableHead className="font-semibold text-center">Note/20</TableHead>
                      <TableHead className="font-semibold text-center">Statut</TableHead>
                      <TableHead className="font-semibold text-center">Session</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentGrades.map((grade) => {
                      const ue = getUEDetails(grade.ueId);
                      return (
                        <TableRow key={grade.id}>
                          <TableCell className="font-medium">{ue?.code}</TableCell>
                          <TableCell>{ue?.title}</TableCell>
                          <TableCell className="text-center">{ue?.credits}</TableCell>
                          <TableCell className="text-center font-semibold">
                            <span className={grade.grade >= (ue?.passingGrade || 10) ? 'text-green-600' : 'text-red-600'}>
                              {grade.grade.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={grade.status === 'Validé' ? 'default' : 'destructive'} className="text-xs">
                              {grade.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">{grade.session}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Résumé académique */}
              <div className="grid grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold">Moyenne Générale</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{gpa.toFixed(2)}/20</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold">Crédits Validés</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{creditsEarned}/{totalCreditsAttempted}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <GraduationCap className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-semibold">Mention</span>
                  </div>
                  <p className="text-lg font-bold text-purple-700">
                    {gpa >= 16 ? 'Très Bien' : gpa >= 14 ? 'Bien' : gpa >= 12 ? 'Assez Bien' : gpa >= 10 ? 'Passable' : 'Insuffisant'}
                  </p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t">
                <div className="text-center">
                  <div className="border-t border-gray-400 pt-2 mt-12">
                    <p className="font-semibold">Le Directeur Académique</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t border-gray-400 pt-2 mt-12">
                    <p className="font-semibold">Le Registraire</p>
                  </div>
                </div>
              </div>

              {/* Cachet officiel */}
              <div className="text-center mt-6 text-xs text-gray-500">
                <p>Document officiel généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
                <p>Université Saint Joseph de Pétionville - Port-au-Prince, Haïti</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si aucune note */}
      {selectedStudentData && studentGrades.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune note trouvée pour les critères sélectionnés</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};