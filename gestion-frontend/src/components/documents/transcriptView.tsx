"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  Printer,
  Share2,
  Eye,
  FileText,
  User,
  Calendar,
  BarChart3,
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  Transcript,
  ControlType,
  DocumentType,
  TranscriptStatus,
} from "@/types/transcript";
import { cn } from "@/lib/utils";

interface TranscriptPreviewProps {
  open: boolean;
  transcript: Transcript | null;
  onClose: () => void;
  onDownload: () => void;
}

export default function TranscriptPreview({
  open,
  transcript,
  onClose,
  onDownload,
}: TranscriptPreviewProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "grades",
  ]);

  if (!transcript) return null;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const getStatusColor = (status: TranscriptStatus) => {
    const colors = {
      [TranscriptStatus.GENERATED]: "bg-green-500",
      [TranscriptStatus.DRAFT]: "bg-yellow-500",
      [TranscriptStatus.PUBLISHED]: "bg-blue-500",
      [TranscriptStatus.ARCHIVED]: "bg-gray-500",
      [TranscriptStatus.DELETED]: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getControlTypeColor = (type: ControlType) => {
    const colors = {
      [ControlType.CONTROLE_1]: "bg-blue-500",
      [ControlType.CONTROLE_2]: "bg-purple-500",
      [ControlType.CONTROLE_3]: "bg-orange-500",
      [ControlType.CONTROLE_4]: "bg-red-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const getDocumentTypeIcon = (type: DocumentType) => {
    const icons = {
      [DocumentType.BULLETIN]: <FileText className="h-5 w-5" />,
      [DocumentType.RELEVE]: <BookOpen className="h-5 w-5" />,
      [DocumentType.ATTESTATION_NIVEAU]: <Award className="h-5 w-5" />,
      [DocumentType.ATTESTATION_FIN_ETUDES]: <Award className="h-5 w-5" />,
      [DocumentType.CERTIFICAT_SCOLARITE]: <FileText className="h-5 w-5" />,
    };
    return icons[type] || <FileText className="h-5 w-5" />;
  };

  const calculateStatistics = () => {
    const grades = transcript.transcriptGrades.map((tg) => ({
      grade: tg.grade.grade,
      maxGrade: tg.grade.subject.maxGrade,
      coefficient: tg.grade.subject.coefficient,
      passingGrade: tg.grade.subject.passingGrade,
      subjectName: tg.grade.subject.name,
      isPassed: tg.grade.grade >= tg.grade.subject.passingGrade,
    }));

    const totalCoefficients = grades.reduce((sum, g) => sum + g.coefficient, 0);
    const weightedSum = grades.reduce((sum, g) => {
      const normalized = (g.grade / g.maxGrade) * 20;
      return sum + normalized * g.coefficient;
    }, 0);

    const average = totalCoefficients > 0 ? weightedSum / totalCoefficients : 0;
    const passedCount = grades.filter((g) => g.isPassed).length;
    const successRate = (passedCount / grades.length) * 100;

    return {
      average: average.toFixed(2),
      successRate: successRate.toFixed(2),
      passedCount,
      failedCount: grades.length - passedCount,
      totalSubjects: grades.length,
      grades,
      totalCoefficients,
    };
  };

  const statistics = calculateStatistics();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                {getDocumentTypeIcon(transcript.documentType)}
                Prévisualisation: {transcript.fileName}
              </DialogTitle>
              <DialogDescription>
                Généré le {new Date(transcript.createdAt).toLocaleDateString()}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn(getStatusColor(transcript.status))}>
                {transcript.status}
              </Badge>
              <Badge
                variant="outline"
                className={cn(getControlTypeColor(transcript.controlType))}
              >
                {transcript.controlType.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="grades">Notes</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(90vh-200px)] mt-4">
            <TabsContent value="details" className="space-y-6">
              {/* Informations étudiant */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations étudiant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Identité
                        </h4>
                        <p className="text-lg font-semibold">
                          {transcript.student.lastName}{" "}
                          {transcript.student.firstName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Matricule: {transcript.student.studentCode}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Contact
                        </h4>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4" />
                          {transcript.student.email}
                        </div>
                        {transcript.student.phone && (
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <Phone className="h-4 w-4" />
                            {transcript.student.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Année académique
                        </h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-lg font-semibold">
                            {transcript.academicYear.year}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Du{" "}
                          {new Date(
                            transcript.academicYear.startDate
                          ).toLocaleDateString()}{" "}
                          au{" "}
                          {new Date(
                            transcript.academicYear.endDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Niveau
                        </h4>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span className="text-lg font-semibold">
                            {transcript.classLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations document */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Informations document
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Type de document
                        </h4>
                        <p className="text-lg font-semibold capitalize">
                          {transcript.documentType
                            .toLowerCase()
                            .replace("_", " ")}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Langue
                        </h4>
                        <p className="text-lg font-semibold">
                          {transcript.language === "FR"
                            ? "Français"
                            : "Anglais"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Options
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                transcript.metadata?.withSignature
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              )}
                            />
                            <span>
                              Signature:{" "}
                              {transcript.metadata?.withSignature
                                ? "Oui"
                                : "Non"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                transcript.metadata?.withStamp
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              )}
                            />
                            <span>
                              Cachet:{" "}
                              {transcript.metadata?.withStamp ? "Oui" : "Non"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Fichier
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {transcript.fileName}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Résumé statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Résumé statistique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {transcript.gpa.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Moyenne /20
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {transcript.successRate.toFixed(2)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Taux de réussite
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {transcript.creditsEarned}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Crédits obtenus
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {transcript.totalCredits}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Crédits totaux
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grades" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Détail des notes</CardTitle>
                  <CardDescription>
                    {statistics.totalSubjects} matière(s) au total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Matière</TableHead>
                        <TableHead className="text-center">Note</TableHead>
                        <TableHead className="text-center">Base</TableHead>
                        <TableHead className="text-center">Note/20</TableHead>
                        <TableHead className="text-center">
                          Coefficient
                        </TableHead>
                        <TableHead className="text-center">Pondérée</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statistics.grades.map((grade, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {grade.subjectName}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-bold">{grade.grade}</span>
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            /{grade.maxGrade}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-semibold">
                              {((grade.grade / grade.maxGrade) * 20).toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {grade.coefficient}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-semibold">
                              {(
                                (grade.grade / grade.maxGrade) *
                                20 *
                                grade.coefficient
                              ).toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {grade.isPassed ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Réussi
                              </Badge>
                            ) : (
                              <Badge
                                variant="destructive"
                                className="bg-red-100 text-red-800 hover:bg-red-100"
                              >
                                <XCircle className="mr-1 h-3 w-3" />
                                Échoué
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Separator className="my-6" />

                  {/* Résumé */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <h4 className="font-medium">Total coefficients</h4>
                      <p className="text-2xl font-bold">
                        {statistics.totalCoefficients}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Somme pondérée</h4>
                      <p className="text-2xl font-bold text-primary">
                        {statistics.grades
                          .reduce((sum, g) => {
                            const normalized = (g.grade / g.maxGrade) * 20;
                            return sum + normalized * g.coefficient;
                          }, 0)
                          .toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Moyenne générale</h4>
                      <p className="text-2xl font-bold text-primary">
                        {statistics.average}/20
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Graphique de répartition */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span>Réussies: {statistics.passedCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span>Échouées: {statistics.failedCount}</span>
                      </div>
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{
                          width: `${
                            (statistics.passedCount /
                              statistics.totalSubjects) *
                            100
                          }%`,
                        }}
                      />
                      <div
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{
                          width: `${
                            (statistics.failedCount /
                              statistics.totalSubjects) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6">
              {/* Vue détaillée des statistiques */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Performances générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Moyenne générale
                        </span>
                        <span className="font-bold">
                          {transcript.gpa.toFixed(2)}/20
                        </span>
                      </div>
                      <Progress value={transcript.gpa * 5} className="h-2" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Taux de réussite
                        </span>
                        <span className="font-bold">
                          {transcript.successRate.toFixed(2)}%
                        </span>
                      </div>
                      <Progress
                        value={transcript.successRate}
                        className="h-2"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Crédits obtenus
                        </span>
                        <span className="font-bold">
                          {transcript.creditsEarned}/{transcript.totalCredits}
                        </span>
                      </div>
                      <Progress
                        value={
                          (transcript.creditsEarned / transcript.totalCredits) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribution des notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { range: "16-20", count: 3, color: "bg-green-500" },
                        { range: "12-15.9", count: 5, color: "bg-blue-500" },
                        { range: "10-11.9", count: 2, color: "bg-yellow-500" },
                        { range: "0-9.9", count: 1, color: "bg-red-500" },
                      ].map((item) => (
                        <div key={item.range} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.range}/20</span>
                            <span>{item.count} matière(s)</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.color} transition-all duration-500`}
                              style={{
                                width: `${
                                  (item.count / statistics.totalSubjects) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Analyse comparative</CardTitle>
                    <CardDescription>
                      Comparaison avec la promotion
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          #{transcript.metadata?.rank || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rang
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {transcript.metadata?.totalStudents || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Étudiants au niveau
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {transcript.metadata?.promotionAverage
                            ? `${transcript.metadata.promotionAverage.toFixed(
                                2
                              )}/20`
                            : "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Moyenne promotion
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommandations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommandations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transcript.gpa >= 16 ? (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                        <Award className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800">
                            Excellente performance
                          </h4>
                          <p className="text-sm text-green-700 mt-1">
                            L'étudiant a une excellente moyenne et un taux de
                            réussite élevé. Il peut envisager des options
                            académiques avancées.
                          </p>
                        </div>
                      </div>
                    ) : transcript.gpa >= 12 ? (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">
                            Bon niveau
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            L'étudiant a un bon niveau général. Encourager les
                            matières fortes et travailler sur les points
                            faibles.
                          </p>
                        </div>
                      </div>
                    ) : transcript.gpa >= 10 ? (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                        <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">
                            Niveau passable
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            L'étudiant a besoin de soutien supplémentaire dans
                            certaines matières. Recommander un tutorat ou des
                            heures de soutien.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800">
                            Attention requise
                          </h4>
                          <p className="text-sm text-red-700 mt-1">
                            L'étudiant rencontre des difficultés importantes.
                            Recommander une rencontre avec le conseiller
                            pédagogique et un plan de soutien intensif.
                          </p>
                        </div>
                      </div>
                    )}

                    {statistics.failedCount > 0 && (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-50 border border-orange-200">
                        <BookOpen className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-orange-800">
                            Matériels à reprendre
                          </h4>
                          <p className="text-sm text-orange-700 mt-1">
                            {statistics.failedCount} matière(s) nécessite(nt)
                            une reprise. Planifier des sessions de rattrapage
                            avant le prochain contrôle.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Partager
            </Button>
            <Button onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
