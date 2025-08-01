import { useState, useRef } from 'react';
import { User, Download, Printer, QrCode, Calendar, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAcademicStore } from '../store/academicStore';
import { Student } from '../types/academic';

export const StudentCardGenerator = () => {
  const { students, faculties } = useAcademicStore();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);

  const filteredStudents = students.filter(student => 
    (selectedFaculty === '' || selectedFaculty === 'ALL_FACULTIES' || student.faculty === selectedFaculty) &&
    student.status === 'Active'
  );

  const handlePrint = () => {
    if (cardRef.current) {
      const printContent = cardRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const generateQRCode = (studentData: Student) => {
    const data = `${studentData.studentId}|${studentData.firstName}|${studentData.lastName}|${studentData.faculty}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data)}`;
  };

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Génération de Cartes d'Étudiant</h2>
          <p className="text-muted-foreground">
            Créez et imprimez les cartes d'identité des étudiants
          </p>
        </div>
      </div>

      {/* Sélection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Sélection d'Étudiant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Aperçu de la carte */}
      {selectedStudentData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Aperçu de la Carte</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handlePrint} size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div 
                ref={cardRef}
                className="w-[350px] h-[220px] bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg overflow-hidden relative print:shadow-none"
              >
                {/* En-tête */}
                <div className="bg-white/10 p-3 text-center border-b border-white/20">
                  <h3 className="text-white font-bold text-sm">UNIVERSITÉ SAINT JOSEPH</h3>
                  <p className="text-white/90 text-xs">DE PÉTIONVILLE</p>
                </div>

                {/* Contenu principal */}
                <div className="p-4 flex gap-4 h-full">
                  {/* Photo */}
                  <div className="w-16 h-20 bg-white/20 rounded-md flex items-center justify-center">
                    <User className="h-10 w-10 text-white/70" />
                  </div>

                  {/* Informations */}
                  <div className="flex-1 text-white space-y-1">
                    <h4 className="font-bold text-sm">
                      {selectedStudentData.firstName} {selectedStudentData.lastName}
                    </h4>
                    <p className="text-xs text-white/90">ID: {selectedStudentData.studentId}</p>
                    <p className="text-xs text-white/90">{selectedStudentData.faculty}</p>
                    <p className="text-xs text-white/90">Niveau: {selectedStudentData.level}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">2023-2024</span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="w-16 h-16 bg-white rounded-md p-1">
                    <img 
                      src={generateQRCode(selectedStudentData)}
                      alt="QR Code"
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Code-barres simulé */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-white/10 flex items-center justify-center">
                  <div className="text-white text-xs font-mono">
                    |||| | |||| || | |||||| | |||
                  </div>
                </div>

                {/* Badge de statut */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="text-xs">
                    {selectedStudentData.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des étudiants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Étudiants Actifs ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-h-96 overflow-y-auto">
            {filteredStudents.map((student) => (
              <div 
                key={student.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedStudent === student.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => setSelectedStudent(student.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {student.studentId} • {student.faculty} • {student.level}
                    </p>
                  </div>
                  <Badge variant="outline">{student.status}</Badge>
                </div>
              </div>
            ))}
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun étudiant trouvé</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};