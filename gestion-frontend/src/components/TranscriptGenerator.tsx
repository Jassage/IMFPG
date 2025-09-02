import { useState, useRef } from "react";
import {
  FileText,
  Download,
  Printer,
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  BarChart3,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAcademicStore } from "../store/academicStore";
import { motion, AnimatePresence } from "framer-motion";

export const TranscriptGenerator = () => {
  const { students, grades, ues, faculties } = useAcademicStore();
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("2023-2024");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSessions, setExpandedSessions] = useState<
    Record<string, boolean>
  >({
    S1: true,
    S2: true,
  });

  const transcriptRef = useRef<HTMLDivElement>(null);

  const filteredStudents = students.filter(
    (student) =>
      selectedFaculty === "" ||
      selectedFaculty === "ALL_FACULTIES" ||
      student.faculty === selectedFaculty
  );

  const selectedStudentData = students.find((s) => s.id === selectedStudent);

  // Obtenir toutes les notes de l'étudiant pour l'année sélectionnée
  const getStudentGrades = () => {
    if (!selectedStudent) return [];

    return grades.filter(
      (grade) =>
        grade.studentId === selectedStudent &&
        grade.academicYear === selectedYear
    );
  };

  const getUEDetails = (ueId: string) => {
    return ues.find((ue) => ue.id === ueId);
  };

  // Calculer la moyenne pour une session spécifique
  const calculateSessionGPA = (gradesList: typeof grades, semester: string) => {
    const sessionGrades = gradesList.filter(
      (grade) => grade.semester === semester
    );
    if (sessionGrades.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    sessionGrades.forEach((grade) => {
      const ue = getUEDetails(grade.ueId);
      if (ue) {
        totalPoints += grade.grade * ue.credits;
        totalCredits += ue.credits;
      }
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  // Calculer la moyenne annuelle
  const calculateAnnualGPA = (gradesList: typeof grades) => {
    if (gradesList.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    gradesList.forEach((grade) => {
      const ue = getUEDetails(grade.ueId);
      if (ue) {
        totalPoints += grade.grade * ue.credits;
        totalCredits += ue.credits;
      }
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  // Calculer les crédits obtenus pour une session
  const calculateSessionCredits = (
    gradesList: typeof grades,
    semester: string
  ) => {
    const sessionGrades = gradesList.filter(
      (grade) => grade.semester === semester
    );
    let totalCredits = 0;

    sessionGrades.forEach((grade) => {
      if (grade.status === "Validé") {
        const ue = getUEDetails(grade.ueId);
        if (ue) totalCredits += ue.credits;
      }
    });

    return totalCredits;
  };

  // Calculer les crédits totaux pour une session
  const calculateSessionTotalCredits = (
    gradesList: typeof grades,
    semester: string
  ) => {
    const sessionGrades = gradesList.filter(
      (grade) => grade.semester === semester
    );
    return sessionGrades.reduce((total, grade) => {
      const ue = getUEDetails(grade.ueId);
      return total + (ue?.credits || 0);
    }, 0);
  };

  // Obtenir les crédits totaux annuels
  const calculateAnnualCredits = (gradesList: typeof grades) => {
    let totalCredits = 0;
    gradesList.forEach((grade) => {
      if (grade.status === "Validé") {
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

  const toggleSession = (session: string) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [session]: !prev[session],
    }));
  };

  const studentGrades = getStudentGrades();
  const annualGPA = calculateAnnualGPA(studentGrades);
  const annualCredits = calculateAnnualCredits(studentGrades);
  const totalAnnualCredits = studentGrades.reduce((total, grade) => {
    const ue = getUEDetails(grade.ueId);
    return total + (ue?.credits || 0);
  }, 0);

  // Calculs pour chaque session
  const session1GPA = calculateSessionGPA(studentGrades, "S1");
  const session2GPA = calculateSessionGPA(studentGrades, "S2");
  const session1Credits = calculateSessionCredits(studentGrades, "S1");
  const session2Credits = calculateSessionCredits(studentGrades, "S2");
  const session1TotalCredits = calculateSessionTotalCredits(
    studentGrades,
    "S1"
  );
  const session2TotalCredits = calculateSessionTotalCredits(
    studentGrades,
    "S2"
  );

  // Filtrer les notes par session
  const session1Grades = studentGrades.filter(
    (grade) => grade.semester === "S1"
  );
  const session2Grades = studentGrades.filter(
    (grade) => grade.semester === "S2"
  );

  const getMention = (gpa: number) => {
    if (gpa >= 16) return "Très Bien";
    if (gpa >= 14) return "Bien";
    if (gpa >= 12) return "Assez Bien";
    if (gpa >= 10) return "Passable";
    return "Insuffisant";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Génération de Bulletins
          </h2>
          <p className="text-muted-foreground">
            Créez et imprimez les bulletins de notes des étudiants
          </p>
        </div>
      </div>

      {/* Sélection */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FileText className="h-5 w-5" />
            Paramètres du Bulletin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Faculté</label>
              <Select
                value={selectedFaculty}
                onValueChange={setSelectedFaculty}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Toutes les facultés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_FACULTIES">
                    Toutes les facultés
                  </SelectItem>
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.name}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Étudiant</label>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Sélectionner un étudiant" />
                </SelectTrigger>
                <SelectContent>
                  {filteredStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} -{" "}
                      {student.studentId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Année Académique</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex items-end">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!selectedStudentData || studentGrades.length === 0}
                onClick={() =>
                  transcriptRef.current?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Voir le bulletin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résumé statistique */}
      {selectedStudentData && studentGrades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé Académique</CardTitle>
            <CardDescription>
              Performance de {selectedStudentData.firstName}{" "}
              {selectedStudentData.lastName} pour l'année {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="session1">Session 1</TabsTrigger>
                <TabsTrigger value="session2">Session 2</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-700">
                            Moyenne Annuelle
                          </p>
                          <p className="text-3xl font-bold text-blue-900">
                            {annualGPA.toFixed(2)}/20
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            {getMention(annualGPA)}
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-200">
                          <BarChart3 className="h-6 w-6 text-blue-700" />
                        </div>
                      </div>
                      <Progress
                        value={(annualGPA / 20) * 100}
                        className="h-2 mt-4"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-700">
                            Crédits Obtenus
                          </p>
                          <p className="text-3xl font-bold text-green-900">
                            {annualCredits}/{totalAnnualCredits}
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            {(
                              (annualCredits / totalAnnualCredits) *
                              100
                            ).toFixed(0)}
                            % de réussite
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-green-200">
                          <Target className="h-6 w-6 text-green-700" />
                        </div>
                      </div>
                      <Progress
                        value={(annualCredits / totalAnnualCredits) * 100}
                        className="h-2 mt-4"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-700">
                            Unités d'Enseignement
                          </p>
                          <p className="text-3xl font-bold text-purple-900">
                            {studentGrades.length}
                          </p>
                          <p className="text-sm text-purple-700 mt-1">
                            Sur {ues.length} au total
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-200">
                          <BookOpen className="h-6 w-6 text-purple-700" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Session 1</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Moyenne:</span>
                          <Badge
                            variant={
                              session1GPA >= 10 ? "default" : "destructive"
                            }
                            className="text-lg"
                          >
                            {session1GPA.toFixed(2)}/20
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Crédits:</span>
                          <span>
                            {session1Credits}/{session1TotalCredits}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Mention:</span>
                          <span>{getMention(session1GPA)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Session 2</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Moyenne:</span>
                          <Badge
                            variant={
                              session2GPA >= 10 ? "default" : "destructive"
                            }
                            className="text-lg"
                          >
                            {session2GPA.toFixed(2)}/20
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Crédits:</span>
                          <span>
                            {session2Credits}/{session2TotalCredits}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Mention:</span>
                          <span>{getMention(session2GPA)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="session1">
                <SessionDetails
                  grades={session1Grades}
                  getUEDetails={getUEDetails}
                  session="S1"
                  gpa={session1GPA}
                  creditsEarned={session1Credits}
                  totalCredits={session1TotalCredits}
                />
              </TabsContent>

              <TabsContent value="session2">
                <SessionDetails
                  grades={session2Grades}
                  getUEDetails={getUEDetails}
                  session="S2"
                  gpa={session2GPA}
                  creditsEarned={session2Credits}
                  totalCredits={session2TotalCredits}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Aperçu du bulletin */}
      {selectedStudentData && studentGrades.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bulletin de Notes Complet</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={handlePrint}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
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
                <h1 className="text-2xl font-bold text-gray-800">
                  UNIVERSITÉ SAINT JOSEPH
                </h1>
                <p className="text-lg text-gray-600">DE PÉTIONVILLE</p>
                <p className="text-sm text-gray-500 mt-2">
                  Port-au-Prince, Haïti
                </p>
                <h2 className="text-xl font-semibold mt-4 text-blue-700">
                  BULLETIN DE NOTES OFFICIEL - {selectedYear}
                </h2>
              </div>

              {/* Informations étudiant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    INFORMATIONS ÉTUDIANT
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Nom:</span>{" "}
                      {selectedStudentData.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Prénom:</span>{" "}
                      {selectedStudentData.firstName}
                    </p>
                    <p>
                      <span className="font-medium">ID Étudiant:</span>{" "}
                      {selectedStudentData.studentId}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedStudentData.email}
                    </p>
                    <p>
                      <span className="font-medium">Téléphone:</span>{" "}
                      {selectedStudentData.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    INFORMATIONS ACADÉMIQUES
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Faculté:</span>{" "}
                      {selectedStudentData.faculty}
                    </p>
                    <p>
                      <span className="font-medium">Niveau:</span>{" "}
                      {selectedStudentData.level}
                    </p>
                    <p>
                      <span className="font-medium">Année Académique:</span>{" "}
                      {selectedYear}
                    </p>
                    <p>
                      <span className="font-medium">Statut:</span>{" "}
                      {selectedStudentData.status}
                    </p>
                    <p>
                      <span className="font-medium">Date d'émission:</span>{" "}
                      {new Date().toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Résumé académique annuel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold">Moyenne Annuelle</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    {annualGPA.toFixed(2)}/20
                  </p>
                  <p className="text-sm text-blue-600">
                    {getMention(annualGPA)}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold">Crédits Validés</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">
                    {annualCredits}/{totalAnnualCredits}
                  </p>
                  <p className="text-sm text-green-600">
                    {((annualCredits / totalAnnualCredits) * 100).toFixed(0)}%
                    de réussite
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <GraduationCap className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-semibold">Statut Annuel</span>
                  </div>
                  <p className="text-lg font-bold text-purple-700">
                    {annualGPA >= 10 ? "Validé" : "Non Validé"}
                  </p>
                </div>
              </div>

              {/* Détails des sessions */}
              <div className="space-y-6">
                {/* Session 1 */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSession("S1")}
                  >
                    <h3 className="font-semibold text-lg">
                      Session 1 - Résultats
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          Moyenne:{" "}
                          <span
                            className={
                              session1GPA >= 10
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {session1GPA.toFixed(2)}/20
                          </span>
                        </p>
                        <p className="text-sm">
                          Crédits: {session1Credits}/{session1TotalCredits}
                        </p>
                      </div>
                      {expandedSessions["S1"] ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedSessions["S1"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="font-semibold">
                                Code UE
                              </TableHead>
                              <TableHead className="font-semibold">
                                Intitulé
                              </TableHead>
                              <TableHead className="font-semibold text-center">
                                Crédits
                              </TableHead>
                              <TableHead className="font-semibold text-center">
                                Note/20
                              </TableHead>
                              <TableHead className="font-semibold text-center">
                                Statut
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {session1Grades.map((grade) => {
                              const ue = getUEDetails(grade.ueId);
                              return (
                                <TableRow key={grade.id}>
                                  <TableCell className="font-medium">
                                    {ue?.code}
                                  </TableCell>
                                  <TableCell>{ue?.title}</TableCell>
                                  <TableCell className="text-center">
                                    {ue?.credits}
                                  </TableCell>
                                  <TableCell className="text-center font-semibold">
                                    <span
                                      className={
                                        grade.grade >= (ue?.passingGrade || 10)
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      {grade.grade.toFixed(2)}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant={
                                        grade.status === "Validé"
                                          ? "default"
                                          : "destructive"
                                      }
                                      className="text-xs"
                                    >
                                      {grade.status}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Session 2 */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSession("S2")}
                  >
                    <h3 className="font-semibold text-lg">
                      Session 2 - Résultats
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          Moyenne:{" "}
                          <span
                            className={
                              session2GPA >= 10
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {session2GPA.toFixed(2)}/20
                          </span>
                        </p>
                        <p className="text-sm">
                          Crédits: {session2Credits}/{session2TotalCredits}
                        </p>
                      </div>
                      {expandedSessions["S2"] ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedSessions["S2"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="font-semibold">
                                Code UE
                              </TableHead>
                              <TableHead className="font-semibold">
                                Intitulé
                              </TableHead>
                              <TableHead className="font-semibold text-center">
                                Crédits
                              </TableHead>
                              <TableHead className="font-semibold text-center">
                                Note/20
                              </TableHead>
                              <TableHead className="font-semibold text-center">
                                Statut
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {session2Grades.map((grade) => {
                              const ue = getUEDetails(grade.ueId);
                              return (
                                <TableRow key={grade.id}>
                                  <TableCell className="font-medium">
                                    {ue?.code}
                                  </TableCell>
                                  <TableCell>{ue?.title}</TableCell>
                                  <TableCell className="text-center">
                                    {ue?.credits}
                                  </TableCell>
                                  <TableCell className="text-center font-semibold">
                                    <span
                                      className={
                                        grade.grade >= (ue?.passingGrade || 10)
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      {grade.grade.toFixed(2)}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant={
                                        grade.status === "Validé"
                                          ? "default"
                                          : "destructive"
                                      }
                                      className="text-xs"
                                    >
                                      {grade.status}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-6 border-t">
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
                <p>
                  Document officiel généré le{" "}
                  {new Date().toLocaleDateString("fr-FR")} à{" "}
                  {new Date().toLocaleTimeString("fr-FR")}
                </p>
                <p>
                  Université Saint Joseph de Pétionville - Port-au-Prince, Haïti
                </p>
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

// Composant pour afficher les détails d'une session
const SessionDetails = ({
  grades,
  getUEDetails,
  session,
  gpa,
  creditsEarned,
  totalCredits,
}: any) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Moyenne {session}
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {gpa.toFixed(2)}/20
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Crédits Obtenus
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {creditsEarned}/{totalCredits}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Unités d'Enseignement
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {grades.length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Code UE</TableHead>
            <TableHead className="font-semibold">Intitulé</TableHead>
            <TableHead className="font-semibold text-center">Crédits</TableHead>
            <TableHead className="font-semibold text-center">Note/20</TableHead>
            <TableHead className="font-semibold text-center">Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((grade: any) => {
            const ue = getUEDetails(grade.ueId);
            return (
              <TableRow key={grade.id}>
                <TableCell className="font-medium">{ue?.code}</TableCell>
                <TableCell>{ue?.title}</TableCell>
                <TableCell className="text-center">{ue?.credits}</TableCell>
                <TableCell className="text-center font-semibold">
                  <span
                    className={
                      grade.grade >= (ue?.passingGrade || 10)
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {grade.grade.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      grade.status === "Validé" ? "default" : "destructive"
                    }
                    className="text-xs"
                  >
                    {grade.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
