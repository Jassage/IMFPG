// components/reports/PaymentReport.tsx
// État des paiements pour une classe et une année académique : liste des
// élèves avec montants attendu/versé/restant, export Excel et impression PDF.

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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileSpreadsheet,
  FileText,
  Loader2,
  Receipt,
  Wallet,
  Banknote,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useClassStore } from "@/store/classStore";
import { useFeeStructureStore } from "@/store/feeStructureStore";
import { useSettings } from "@/hooks/useSystemSettings";
import { FeeReport } from "@/types/academic";

const STATUS_LABELS: Record<string, string> = {
  paid: "Payé",
  partial: "Partiel",
  pending: "Non payé",
  overdue: "En retard",
  non_assigne: "Non assigné",
};

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  partial: "bg-yellow-100 text-yellow-800",
  pending: "bg-red-100 text-red-800",
  overdue: "bg-red-100 text-red-800",
  non_assigne: "bg-gray-100 text-gray-600",
};

const formatHTG = (value: number) =>
  `${value.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} HTG`;

export const PaymentReport: React.FC = () => {
  const { academicYears, fetchAcademicYears, currentAcademicYear } =
    useAcademicYearStore();
  const { classes, fetchClasses } = useClassStore();
  const { getFeeReportByClass } = useFeeStructureStore();
  const { settings } = useSettings();

  const [yearId, setYearId] = useState("");
  const [classId, setClassId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<FeeReport | null>(null);

  useEffect(() => {
    if (!academicYears || academicYears.length === 0) fetchAcademicYears();
    if (!classes || classes.length === 0) fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!yearId && currentAcademicYear?.id) {
      setYearId(currentAcademicYear.id);
    }
  }, [currentAcademicYear, yearId]);

  const selectedYear = (academicYears || []).find((y: any) => y.id === yearId);
  const selectedClass = (classes || []).find((c: any) => c.id === classId);
  const yearLabel = selectedYear?.year || "—";
  const className = selectedClass?.name || "—";

  const handleGenerate = async () => {
    if (!yearId || !classId) {
      toast.error("Sélectionnez une classe et une année académique");
      return;
    }
    setGenerating(true);
    try {
      const data = await getFeeReportByClass({
        academicYearId: yearId,
        classId,
      });

      if (!data.students || data.students.length === 0) {
        toast.info("Aucun élève inscrit dans cette classe pour cette année");
        setResult(null);
        return;
      }

      setResult(data);
      toast.success(`État généré (${data.students.length} élèves)`);
    } catch {
      // Le store affiche déjà un toast d'erreur
    } finally {
      setGenerating(false);
    }
  };

  const safe = (v: string) =>
    v.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");

  const reportTitle = `ÉTAT DES PAIEMENTS — ${className} — ${yearLabel}`;

  const handleExportExcel = () => {
    if (!result) return;

    const header = [
      "N°",
      "Code",
      "Nom & Prénom",
      "Montant attendu",
      "Montant versé",
      "Reste à payer",
      "Statut",
    ];
    const studentRows = result.students.map((s, i) => [
      i + 1,
      s.studentCode || "",
      `${s.lastName} ${s.firstName}`.trim(),
      s.totalAmount,
      s.paidAmount,
      s.remaining,
      STATUS_LABELS[s.status] || s.status,
    ]);
    const totalRow = [
      "",
      "",
      "TOTAL",
      result.summary.totalExpected,
      result.summary.totalCollected,
      result.summary.totalRemaining,
      "",
    ];

    const aoa: any[][] = [[reportTitle], [], header, ...studentRows, totalRow];

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } }];
    ws["!cols"] = [
      { wch: 5 },
      { wch: 12 },
      { wch: 28 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Etat des paiements");
    XLSX.writeFile(
      wb,
      `etat-paiements-${safe(className)}-${safe(yearLabel)}.xlsx`
    );
  };

  const handleExportPDF = () => {
    if (!result) return;

    const schoolName = settings?.schoolName || "Institution Mixte Faustin 1er";

    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(schoolName, pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("ÉTAT DES PAIEMENTS", pageWidth / 2, 23, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Classe : ${className}`, 14, 33);
    doc.text(`Année académique : ${yearLabel}`, 14, 39);
    doc.text(
      `Édité le : ${new Date().toLocaleDateString("fr-FR")}`,
      pageWidth - 14,
      33,
      { align: "right" }
    );
    doc.text(`Effectif : ${result.students.length}`, pageWidth - 14, 39, {
      align: "right",
    });

    autoTable(doc, {
      startY: 45,
      head: [
        [
          "N°",
          "Code",
          "Nom & Prénom",
          "Attendu",
          "Versé",
          "Reste",
          "Statut",
        ],
      ],
      body: result.students.map((s, i) => [
        String(i + 1),
        s.studentCode || "",
        `${s.lastName} ${s.firstName}`.trim(),
        s.totalAmount.toLocaleString("fr-FR"),
        s.paidAmount.toLocaleString("fr-FR"),
        s.remaining.toLocaleString("fr-FR"),
        STATUS_LABELS[s.status] || s.status,
      ]),
      foot: [
        [
          "",
          "",
          "TOTAL",
          result.summary.totalExpected.toLocaleString("fr-FR"),
          result.summary.totalCollected.toLocaleString("fr-FR"),
          result.summary.totalRemaining.toLocaleString("fr-FR"),
          "",
        ],
      ],
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      footStyles: {
        fillColor: [229, 231, 235],
        textColor: 0,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [243, 244, 246] },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 22 },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });

    doc.save(`etat-paiements-${safe(className)}-${safe(yearLabel)}.pdf`);
  };

  const recoveryRate =
    result && result.summary.totalExpected > 0
      ? (result.summary.totalCollected / result.summary.totalExpected) * 100
      : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-500" />
            État des paiements
          </CardTitle>
          <CardDescription>
            Liste des élèves d'une classe avec montants attendus, versés et
            restants. Export Excel ou impression PDF.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label>Classe</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une classe" />
                </SelectTrigger>
                <SelectContent>
                  {(classes || []).map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} {c.level ? `- ${c.level}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleGenerate}
                disabled={!yearId || !classId || generating}
                className="gap-2 w-full"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Receipt className="h-4 w-4" />
                )}
                Générer l'état
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
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
              Imprimer / PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Banknote className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Montant attendu</div>
                  <div className="font-bold text-gray-900">
                    {formatHTG(result.summary.totalExpected)}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Montant versé</div>
                  <div className="font-bold text-green-700">
                    {formatHTG(result.summary.totalCollected)}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-50">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Reste à payer</div>
                  <div className="font-bold text-red-700">
                    {formatHTG(result.summary.totalRemaining)}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Receipt className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">
                    Taux de recouvrement
                  </div>
                  <div className="font-bold text-gray-900">
                    {recoveryRate.toFixed(1)} %
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{reportTitle}</CardTitle>
              <CardDescription>
                {result.students.length} élève(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">N°</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Nom & Prénom</TableHead>
                      <TableHead className="text-right">Attendu</TableHead>
                      <TableHead className="text-right">Versé</TableHead>
                      <TableHead className="text-right">Reste</TableHead>
                      <TableHead className="text-center">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.students.map((s, i) => (
                      <TableRow key={s.studentId}>
                        <TableCell className="text-center">{i + 1}</TableCell>
                        <TableCell>{s.studentCode}</TableCell>
                        <TableCell>
                          {s.lastName} {s.firstName}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatHTG(s.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right text-green-700">
                          {formatHTG(s.paidAmount)}
                        </TableCell>
                        <TableCell className="text-right text-red-700 font-medium">
                          {formatHTG(s.remaining)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              STATUS_COLORS[s.status] ||
                              "bg-gray-100 text-gray-600"
                            }
                          >
                            {STATUS_LABELS[s.status] || s.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PaymentReport;
