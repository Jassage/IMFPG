// components/reports/PalmaresReport.tsx
// Génération du "Palmarès" (classement par contrôle) et des "Notes Totales"
// (classement cumulé) d'un niveau, avec export Excel et PDF au format utilisé
// par l'établissement.

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSpreadsheet, FileText, Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useGradeStore, PalmaresData } from "@/store/gradeStore";
import { useSettings } from "@/hooks/useSystemSettings";
import { ClassLevel } from "@/types/academic";
import { ControlType } from "@/types/bulletin";

const CLASS_LEVEL_LABELS: Record<ClassLevel, string> = {
  Sixieme: "7ème A.F",
  Cinquieme: "8ème A.F",
  Quatrieme: "9ème A.F",
  Troisieme: "3ème Secondaire",
  Seconde: "Seconde",
  Premiere: "Rhéto",
  Terminale: "Terminale",
  NSI: "NSI",
  NSII: "NSII",
  NSIII: "NSIII",
  NSIV: "NSIV",
};

const CONTROL_TYPE_LABELS: Record<ControlType, string> = {
  [ControlType.CONTROLE_1]: "Premier contrôle",
  [ControlType.CONTROLE_2]: "Deuxième contrôle",
  [ControlType.CONTROLE_3]: "Troisième contrôle",
  [ControlType.CONTROLE_4]: "Quatrième contrôle",
};

const STATUS_OPTIONS = [
  { value: "Published", label: "Notes publiées" },
  { value: "Approved", label: "Notes approuvées" },
  { value: "all", label: "Toutes les notes" },
];

export const PalmaresReport: React.FC = () => {
  const { academicYears, fetchAcademicYears, currentAcademicYear } =
    useAcademicYearStore();
  const { fetchPalmares, fetchPalmaresCumulatif } = useGradeStore();
  const { settings } = useSettings();

  const [yearId, setYearId] = useState("");
  const [classLevel, setClassLevel] = useState<ClassLevel | "">("");
  const [controlType, setControlType] = useState<ControlType>(
    ControlType.CONTROLE_1,
  );
  const [status, setStatus] = useState("Published");
  const [mode, setMode] = useState<"controle" | "cumulatif">("controle");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<PalmaresData | null>(null);

  useEffect(() => {
    if (!academicYears || academicYears.length === 0) fetchAcademicYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!yearId && currentAcademicYear?.id) {
      setYearId(currentAcademicYear.id);
    }
  }, [currentAcademicYear, yearId]);

  const selectedYear = (academicYears || []).find((y: any) => y.id === yearId);
  const yearLabel = selectedYear?.year || "—";
  const levelLabel = classLevel ? CLASS_LEVEL_LABELS[classLevel] : "—";

  const handleGenerate = async () => {
    if (!yearId || !classLevel) {
      toast.error("Sélectionnez une année académique et un niveau");
      return;
    }
    setGenerating(true);
    try {
      const data =
        mode === "controle"
          ? await fetchPalmares({
              classLevel,
              controlType,
              academicYearId: yearId,
              status,
            })
          : await fetchPalmaresCumulatif({
              classLevel,
              academicYearId: yearId,
              status,
            });

      if (!data.students || data.students.length === 0) {
        toast.info("Aucune note trouvée pour ces critères");
        setResult(null);
        return;
      }

      setResult(data);
      toast.success(`Palmarès généré (${data.students.length} élèves)`);
    } catch {
      // Le store affiche déjà un toast d'erreur
    } finally {
      setGenerating(false);
    }
  };

  const safe = (v: string) =>
    v.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");

  const reportTitle =
    mode === "controle"
      ? `PALMARES ${yearLabel} / ${levelLabel} / ${CONTROL_TYPE_LABELS[controlType]}`
      : `NOTES TOTALES ${yearLabel} / ${levelLabel}`;

  const handleExportExcel = () => {
    if (!result) return;

    const header = [
      "NOM ET PRENOM",
      "COEFF",
      ...result.subjects.map((s) => s.name),
      "Total",
      "Moyen",
      "Rang",
    ];
    const baremeRow = [
      "",
      "MATIERES",
      ...result.subjects.map((s) => s.maxGrade),
      result.maxTotal,
      100,
      "",
    ];
    const studentRows = result.students.map((s) => [
      `${s.lastName} ${s.firstName}`.trim(),
      "",
      ...result.subjects.map((subj) =>
        Math.round((s.grades[subj.id] || 0) * 100) / 100,
      ),
      Math.round(s.total * 100) / 100,
      Math.round(s.moyenne * 100) / 100,
      s.rank,
    ]);

    const aoa: any[][] = [
      [reportTitle],
      [],
      header,
      baremeRow,
      ...studentRows,
    ];

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
    ];
    ws["!cols"] = [
      { wch: 28 },
      { wch: 10 },
      ...result.subjects.map(() => ({ wch: 9 })),
      { wch: 9 },
      { wch: 9 },
      { wch: 7 },
    ];

    const wb = XLSX.utils.book_new();
    const sheetName = mode === "controle" ? "Palmares" : "Notes totales";
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const filename =
      mode === "controle"
        ? `palmares-${safe(levelLabel)}-${safe(CONTROL_TYPE_LABELS[controlType])}-${safe(yearLabel)}.xlsx`
        : `notes-totales-${safe(levelLabel)}-${safe(yearLabel)}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const handleExportPDF = () => {
    if (!result) return;

    const doc = new jsPDF("landscape", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const schoolName = settings?.schoolName || "Institution Mixte Faustin 1er";

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(schoolName, pageWidth / 2, 12, { align: "center" });
    doc.setFontSize(11);
    doc.text(reportTitle, pageWidth / 2, 19, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Édité le : ${new Date().toLocaleDateString("fr-FR")}`,
      pageWidth - 10,
      19,
      { align: "right" },
    );

    const head = [
      [
        "Rang",
        "Nom & Prénom",
        ...result.subjects.map((s) => s.name),
        "Total",
        "Moy.",
      ],
    ];
    const baremeRow = [
      "",
      "Barème",
      ...result.subjects.map((s) => String(s.maxGrade)),
      String(result.maxTotal),
      "100",
    ];
    const body = result.students.map((s) => [
      String(s.rank),
      `${s.lastName} ${s.firstName}`.trim(),
      ...result.subjects.map((subj) =>
        ((s.grades[subj.id] || 0) as number).toFixed(2),
      ),
      s.total.toFixed(2),
      s.moyenne.toFixed(2),
    ]);

    autoTable(doc, {
      startY: 25,
      head,
      body: [baremeRow, ...body],
      styles: { fontSize: 6, cellPadding: 1 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 6 },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 38 },
      },
      didParseCell: (data) => {
        if (data.row.index === 0 && data.section === "body") {
          data.cell.styles.fillColor = [229, 231, 235];
          data.cell.styles.fontStyle = "bold";
        }
      },
      margin: { left: 8, right: 8 },
    });

    const filename =
      mode === "controle"
        ? `palmares-${safe(levelLabel)}-${safe(CONTROL_TYPE_LABELS[controlType])}-${safe(yearLabel)}.pdf`
        : `notes-totales-${safe(levelLabel)}-${safe(yearLabel)}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Palmarès & Notes totales
          </CardTitle>
          <CardDescription>
            Génère le classement d'un niveau pour un contrôle, ou le
            classement cumulé (notes totales) sur l'année.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "controle" | "cumulatif")}
          >
            <TabsList>
              <TabsTrigger value="controle">Par contrôle</TabsTrigger>
              <TabsTrigger value="cumulatif">Notes totales</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Année académique</Label>
              <Select value={yearId} onValueChange={setYearId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une année" />
                </SelectTrigger>
                <SelectContent>
                  {(academicYears || []).map((y: any) => (
                    <SelectItem key={y.id} value={y.id}>
                      {y.year} {y.isCurrent ? "(en cours)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Niveau</Label>
              <Select
                value={classLevel}
                onValueChange={(v) => setClassLevel(v as ClassLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CLASS_LEVEL_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {mode === "controle" && (
              <div className="space-y-2">
                <Label>Contrôle</Label>
                <Select
                  value={controlType}
                  onValueChange={(v) => setControlType(v as ControlType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONTROL_TYPE_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Statut des notes</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleGenerate}
              disabled={!yearId || !classLevel || generating}
              className="gap-2"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trophy className="h-4 w-4" />
              )}
              Générer
            </Button>
            <Button
              variant="outline"
              onClick={handleExportExcel}
              disabled={!result}
              className="gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Exporter Excel
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              disabled={!result}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{reportTitle}</CardTitle>
            <CardDescription>
              {result.students.length} élève(s) — Total maximum :{" "}
              {result.maxTotal} points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Rang</TableHead>
                    <TableHead>Nom & Prénom</TableHead>
                    {result.subjects.map((s) => (
                      <TableHead key={s.id} className="text-center">
                        {s.name}
                        <div className="text-xs text-muted-foreground">
                          /{s.maxGrade}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Moyenne</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.students.map((s) => (
                    <TableRow key={s.studentId}>
                      <TableCell className="text-center font-medium">
                        {s.rank}
                      </TableCell>
                      <TableCell>
                        {s.lastName} {s.firstName}
                      </TableCell>
                      {result.subjects.map((subj) => (
                        <TableCell key={subj.id} className="text-center">
                          {(s.grades[subj.id] || 0).toFixed(2)}
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-medium">
                        {s.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {s.moyenne.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PalmaresReport;
