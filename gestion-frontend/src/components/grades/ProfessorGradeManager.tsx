// components/grades/ProfessorGradeManager.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Download, Upload, Save, X, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ProfessorGradeManager = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedEvaluation, setSelectedEvaluation] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const classes = [
    { id: '1', name: 'Terminale A' },
    { id: '2', name: '1ère C' },
    { id: '3', name: 'Terminale D' },
  ];

  const subjects = [
    { id: '1', name: 'Mathématiques' },
    { id: '2', name: 'Physique' },
    { id: '3', name: 'Informatique' },
  ];

  const evaluations = [
    { id: '1', name: 'Contrôle 1', type: 'test', coefficient: 1 },
    { id: '2', name: 'Devoir Maison 1', type: 'homework', coefficient: 1 },
    { id: '3', name: 'Examen Semestriel', type: 'exam', coefficient: 2 },
  ];

  const fetchStudents = async () => {
    if (!selectedClass || !selectedSubject) {
      toast({
        title: "Information manquante",
        description: "Veuillez sélectionner une classe et une matière",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setStudents([
        { id: '1', name: 'Jean Dupont', grade: '15.5', status: 'submitted' },
        { id: '2', name: 'Marie Martin', grade: '', status: 'pending' },
        { id: '3', name: 'Pierre Dubois', grade: '12.0', status: 'submitted' },
        { id: '4', name: 'Sophie Bernard', grade: '', status: 'pending' },
        { id: '5', name: 'Luc Petit', grade: '18.0', status: 'submitted' },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleGradeChange = (studentId: string, value: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, grade: value, status: value ? 'submitted' : 'pending' }
        : student
    ));
  };

  const saveGrades = () => {
    toast({
      title: "Succès",
      description: "Les notes ont été sauvegardées avec succès",
    });
  };

  const exportGrades = () => {
    toast({
      title: "Export",
      description: "Export des notes en cours...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saisie des Notes</h1>
          <p className="text-muted-foreground">
            Saisissez et gérez les notes de vos élèves
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportGrades}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={saveGrades}>
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres de saisie</CardTitle>
          <CardDescription>
            Sélectionnez la classe, la matière et le type d'évaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Classe</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Matière</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subj => (
                    <SelectItem key={subj.id} value={subj.id}>
                      {subj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Évaluation</Label>
              <Select value={selectedEvaluation} onValueChange={setSelectedEvaluation}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'évaluation" />
                </SelectTrigger>
                <SelectContent>
                  {evaluations.map(evaluation => (
                    <SelectItem key={evaluation.id} value={evaluation.id}>
                      {evaluation.name} (Coeff: {evaluation.coefficient})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            className="mt-4" 
            onClick={fetchStudents}
            disabled={!selectedClass || !selectedSubject || loading}
          >
            <Filter className="mr-2 h-4 w-4" />
            Charger les élèves
          </Button>
        </CardContent>
      </Card>

      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Liste des élèves</CardTitle>
            <CardDescription>
              Saisissez les notes pour chaque élève
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="grades">
              <TabsList className="mb-4">
                <TabsTrigger value="grades">Saisie des notes</TabsTrigger>
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
              </TabsList>

              <TabsContent value="grades">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      <TableHead>Note /20</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Commentaire</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={student.grade}
                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          {student.status === 'submitted' ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Saisie
                            </Badge>
                          ) : (
                            <Badge variant="outline">En attente</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Commentaire optionnel"
                            className="w-48"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Voir le détail de l'élève
                              toast({
                                title: "Détail",
                                description: `Profil de ${student.name}`,
                              });
                            }}
                          >
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="stats">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      Statistiques des notes en cours de développement...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      Historique des notes en cours de développement...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};