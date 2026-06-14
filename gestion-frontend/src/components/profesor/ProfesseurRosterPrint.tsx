// components/profesor/ProfesseurRosterPrint.tsx
// Impression PDF de la liste des professeurs.

import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import useProfesseurStore from "@/store/professorStore";
import { useSettings } from "@/hooks/useSystemSettings";

export const ProfesseurRosterPrint: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const { professeurs, fetchProfesseurs } = useProfesseurStore();
  const { settings } = useSettings();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      let list = professeurs || [];
      if (list.length === 0) {
        await fetchProfesseurs();
        list = useProfesseurStore.getState().professeurs || [];
      }

      const actifs = list
        .filter((p: any) => !p.status || p.status === "Actif")
        .sort((a: any, b: any) =>
          `${a.lastName} ${a.firstName}`.localeCompare(
            `${b.lastName} ${b.firstName}`,
            "fr",
          ),
        );

      if (actifs.length === 0) {
        toast.info("Aucun professeur à imprimer");
        return;
      }

      const schoolName =
        settings?.schoolName || "Institution Mixte Faustin 1er";
      const slogan = settings?.schoolSlogan || "";

      const doc = new jsPDF("landscape", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(schoolName, pageWidth / 2, 16, { align: "center" });
      if (slogan) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(slogan, pageWidth / 2, 22, { align: "center" });
      }

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("LISTE DES PROFESSEURS", pageWidth / 2, 32, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Édité le : ${new Date().toLocaleDateString("fr-FR")}`,
        14,
        40,
      );
      doc.text(`Effectif : ${actifs.length}`, pageWidth - 14, 40, {
        align: "right",
      });

      autoTable(doc, {
        startY: 45,
        head: [
          ["N°", "Matricule", "Nom & Prénom", "Spécialité", "Téléphone", "Email"],
        ],
        body: actifs.map((p: any, i: number) => [
          String(i + 1),
          p.matricule || "",
          `${p.lastName || ""} ${p.firstName || ""}`.trim(),
          p.speciality || "",
          p.phone || "",
          p.email || "",
        ]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        alternateRowStyles: { fillColor: [243, 244, 246] },
        columnStyles: { 0: { cellWidth: 12, halign: "center" } },
        margin: { left: 14, right: 14 },
      });

      doc.save(`liste-professeurs-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success(`Liste générée (${actifs.length} professeurs)`);
    } catch (e: any) {
      toast.error(
        e.response?.data?.message || "Erreur lors de la génération de la liste",
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button variant="outline" size="lg" onClick={handleGenerate} disabled={generating}>
      {generating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Printer className="h-4 w-4 mr-2" />
      )}
      Imprimer liste
    </Button>
  );
};

export default ProfesseurRosterPrint;
