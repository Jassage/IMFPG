
import { useState } from 'react';
import { Plus, FileText, Search, Edit, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAcademicStore } from '../store/academicStore';

export const GradesManager = () => {
  const { students, ues, grades } = useAcademicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const filteredGrades = grades.filter(grade => {
    const student = students.find(s => s.id === grade.studentId);
    const ue = ues.find(u => u.id === grade.ueId);
    
    const matchesSearch = student && (
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ue && ue.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const matchesSemester = !selectedSemester || grade.semester === selectedSemester;
    const matchesStatus = !selectedStatus || grade.status === selectedStatus;
    
    return matchesSearch && matchesSemester && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      'Validé': { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'À reprendre': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      'En cours': { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800' }
    };
    
    const { variant } = config[status as keyof typeof config] || { variant: 'secondary' as const };
    return <Badge variant={variant}>{status}</Badge>;
  };

  const getGradeColor = (grade: number, passingGrade: number) => {
    if (grade >= passingGrade) return 'text-green-600 font-semibold';
    if (grade >= passingGrade - 2) return 'text-orange-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Notes</h2>
          <p className="text-muted-foreground">
            Consultez et gérez les notes des étudiants
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Note
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Notes</p>
                <p className="text-2xl font-bold">{grades.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Validées</p>
                <p className="text-2xl font-bold text-green-600">
                  {grades.filter(g => g.status === 'Validé').length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">À Reprendre</p>
                <p className="text-2xl font-bold text-red-600">
                  {grades.filter(g => g.status === 'À reprendre').length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold">✗</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Cours</p>
                <p className="text-2xl font-bold text-blue-600">
                  {grades.filter(g => g.status === 'En cours').length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher étudiant ou UE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les semestres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les semestres</SelectItem>
                <SelectItem value="S1">Semestre 1</SelectItem>
                <SelectItem value="S2">Semestre 2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="Validé">Validé</SelectItem>
                <SelectItem value="À reprendre">À reprendre</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Liste des Notes ({filteredGrades.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>UE</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.map((grade) => {
                const student = students.find(s => s.id === grade.studentId);
                const ue = ues.find(u => u.id === grade.ueId);
                
                return (
                  <TableRow key={grade.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {student?.firstName} {student?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student?.studentId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ue?.code}</p>
                        <p className="text-sm text-muted-foreground">
                          {ue?.title}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={getGradeColor(grade.grade, ue?.passingGrade || 10)}>
                        {grade.grade.toFixed(2)}/20
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{grade.session}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(grade.status)}
                    </TableCell>
                    <TableCell>{grade.semester}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredGrades.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune note trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
