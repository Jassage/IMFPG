// components/students/StudentRosterPrint.tsx
// Impression / export PDF de la liste des élèves d'une classe pour une
// année académique donnée (basé sur les inscriptions).

import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { useClassStore } from "@/store/classStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { useSettings } from "@/hooks/useSystemSettings";

export const StudentRosterPrint: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedYearId, setSelectedYearId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatingBlank, setGeneratingBlank] = useState(false);

  const { classes, fetchClasses } = useClassStore();
  const { academicYears, fetchAcademicYears, currentAcademicYear } =
    useAcademicYearStore();
  const { settings } = useSettings();

  useEffect(() => {
    if (open) {
      if (!classes || classes.length === 0) fetchClasses();
      if (!academicYears || academicYears.length === 0) fetchAcademicYears();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!selectedYearId && currentAcademicYear?.id) {
      setSelectedYearId(currentAcademicYear.id);
    }
  }, [currentAcademicYear, selectedYearId]);

  const selectedClass = useMemo(
    () => (classes || []).find((c: any) => c.id === selectedClassId),
    [classes, selectedClassId],
  );
  const selectedYear = useMemo(
    () => (academicYears || []).find((y: any) => y.id === selectedYearId),
    [academicYears, selectedYearId],
  );

  const handleGenerate = async () => {
    if (!selectedClassId || !selectedYearId) {
      toast.error("Sélectionnez une classe et une année académique");
      return;
    }
    setGenerating(true);
    try {
      const res = await api.get("/enrollments", {
        params: {
          classId: selectedClassId,
          academicYearId: selectedYearId,
          status: "Active",
          limit: 1000,
          sortBy: "createdAt",
          sortOrder: "asc",
        },
      });

      const enrollments: any[] = res.data?.data?.enrollments || [];
      const students = enrollments
        .map((e) => e.student)
        .filter(Boolean)
        .sort((a, b) =>
          `${a.lastName} ${a.firstName}`.localeCompare(
            `${b.lastName} ${b.firstName}`,
            "fr",
          ),
        );

      if (students.length === 0) {
        toast.info("Aucun élève inscrit dans cette classe pour cette année");
        return;
      }

      const schoolName =
        settings?.schoolName || "Institution Mixte Faustin 1er";
      const slogan = settings?.schoolSlogan || "";
      const city = settings?.city || "";
      const country = settings?.country || "";
      const className = selectedClass?.name || "—";
      const yearLabel = selectedYear?.year || "—";

      const doc = new jsPDF("portrait", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      // En-tête établissement
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(schoolName, pageWidth / 2, 18, { align: "center" });
      if (slogan) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(slogan, pageWidth / 2, 24, { align: "center" });
      }
      if (city || country) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(
          [city, country].filter(Boolean).join(", "),
          pageWidth / 2,
          29,
          { align: "center" },
        );
      }

      // Titre
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("LISTE DES ÉLÈVES", pageWidth / 2, 40, { align: "center" });

      // Sous-titre : classe / année / date
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Classe : ${className}`, 14, 50);
      doc.text(`Année académique : ${yearLabel}`, 14, 56);
      doc.text(
        `Édité le : ${new Date().toLocaleDateString("fr-FR")}`,
        pageWidth - 14,
        50,
        { align: "right" },
      );
      doc.text(`Effectif : ${students.length}`, pageWidth - 14, 56, {
        align: "right",
      });

      // Tableau
      autoTable(doc, {
        startY: 62,
        head: [["N°", "Code", "Nom & Prénom", "Email"]],
        body: students.map((s, i) => [
          String(i + 1),
          s.studentCode || "",
          `${s.lastName || ""} ${s.firstName || ""}`.trim(),
          s.email || "",
        ]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        alternateRowStyles: { fillColor: [243, 244, 246] },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: 30 },
        },
        margin: { left: 14, right: 14 },
      });

      const safe = (v: string) =>
        v.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
      doc.save(`liste-eleves-${safe(className)}-${safe(yearLabel)}.pdf`);
      toast.success(`Liste générée (${students.length} élèves)`);
      setOpen(false);
    } catch (e: any) {
      toast.error(
        e.response?.data?.message || "Erreur lors de la génération de la liste",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleBlankSheet = async () => {
    if (!selectedClassId || !selectedYearId) {
      toast.error("Sélectionnez une classe et une année académique");
      return;
    }
    setGeneratingBlank(true);
    try {
      const res = await api.get("/enrollments", {
        params: {
          classId: selectedClassId,
          academicYearId: selectedYearId,
          status: "Active",
          limit: 1000,
          sortBy: "createdAt",
          sortOrder: "asc",
        },
      });
      const enrollments: any[] = res.data?.data?.enrollments || [];
      const students = enrollments
        .map((e) => e.student)
        .filter(Boolean)
        .sort((a, b) =>
          `${a.lastName} ${a.firstName}`.localeCompare(
            `${b.lastName} ${b.firstName}`,
            "fr",
          ),
        );
      if (students.length === 0) {
        toast.info("Aucun élève inscrit dans cette classe pour cette année");
        return;
      }

      const schoolName =
        settings?.schoolName || "Institution Mixte Faustin 1er";
      const className = selectedClass?.name || "—";
      const yearLabel = selectedYear?.year || "—";

      const doc = new jsPDF("landscape", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text(schoolName, pageWidth / 2, 15, { align: "center" });
      doc.setFontSize(13);
      doc.text("FEUILLE D'APPEL", pageWidth / 2, 23, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Classe : ${className}`, 14, 32);
      doc.text(`Année : ${yearLabel}`, 14, 38);
      doc.text("Mois : ______________", pageWidth - 14, 32, { align: "right" });

      const dayCols = Array.from({ length: 23 }, (_, i) => String(i + 1));
      autoTable(doc, {
        startY: 43,
        head: [["N°", "Nom & Prénom", ...dayCols]],
        body: students.map((s, i) => [
          String(i + 1),
          `${s.lastName || ""} ${s.firstName || ""}`.trim(),
          ...dayCols.map(() => ""),
        ]),
        styles: {
          fontSize: 7,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: [150, 150, 150],
        },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 7 },
        columnStyles: {
          0: { cellWidth: 8, halign: "center" },
          1: { cellWidth: 45 },
        },
        margin: { left: 10, right: 10 },
      });

      const safe = (v: string) =>
        v.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
      doc.save(`feuille-appel-${safe(className)}-${safe(yearLabel)}.pdf`);
      toast.success("Feuille d'appel générée");
      setOpen(false);
    } catch (e: any) {
      toast.error(
        e.response?.data?.message || "Erreur lors de la génération",
      );
    } finally {
      setGeneratingBlank(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">Imprimer liste</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Imprimer la liste des élèves</DialogTitle>
          <DialogDescription>
            Liste d'une classe pour une année académique, au format PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Année académique</Label>
            <Select value={selectedYearId} onValueChange={setSelectedYearId}>
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
            <Select
              value={selectedClassId}
              onValueChange={setSelectedClassId}
            >
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

          <Button
            className="w-full gap-2"
            onClick={handleGenerate}
            disabled={!selectedClassId || !selectedYearId || generating}
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Printer className="h-4 w-4" />
            )}
            Générer le PDF
          </Button>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleBlankSheet}
            disabled={!selectedClassId || !selectedYearId || generatingBlank}
          >
            {generatingBlank ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Printer className="h-4 w-4" />
            )}
            Feuille d'appel vierge
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentRosterPrint;
