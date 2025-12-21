import { useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BulletinData, ControlType } from "@/types/bulletin";
import { toast } from "sonner";

const PDF_CONFIG = {
  colors: {
    primary: [52, 152, 219] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    red: [255, 0, 0] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    lightGray: [240, 240, 240] as [number, number, number],
    watermark: [100, 100, 100] as [number, number, number],
  },
  font: {
    sizes: {
      xlarge: 16,
      large: 14,
      medium: 12,
      small: 10,
      xsmall: 8,
      watermark: 40,
    },
  },
};

const getControlPeriodLabel = (controlType: ControlType): string => {
  switch (controlType) {
    case ControlType.CONTROLE_1:
      return "1er Trimestre";
    case ControlType.CONTROLE_2:
      return "2ème Trimestre";
    case ControlType.CONTROLE_3:
      return "3ème Trimestre";
    case ControlType.CONTROLE_4:
      return "Examen Final";
    default:
      return "Période";
  }
};

const getLevelLabel = (level: string): string => {
  switch (level) {
    case "Sixieme":
      return "6ème";
    case "Cinquieme":
      return "5ème";
    case "Quatrieme":
      return "4ème";
    case "Troisieme":
      return "3ème";
    case "Seconde":
      return "2nde";
    case "Premiere":
      return "1ère";
    case "Terminale":
      return "Tle";
    case "NSI":
      return "NS I";
    case "NSII":
      return "NS II";
    case "NSIII":
      return "NS III";
    case "NSIV":
      return "NS IV";
    default:
      return level;
  }
};

export const usePDFGenerator = () => {
  const createHeader = useCallback((doc: jsPDF): number => {
    const { colors, font } = PDF_CONFIG;

    // Rectangle d'en-tête
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, 210, 35, "F");

    // Titre
    doc.setFontSize(font.sizes.xlarge);
    doc.setTextColor(...colors.white);
    doc.setFont("helvetica", "bold");
    doc.text("INSTITUTION MIXTE FAUSTIN 1er", 105, 15, { align: "center" });

    // Sous-titre
    doc.setFontSize(font.sizes.large);
    doc.text("SYSTÈME DE GESTION SCOLAIRE", 105, 22, { align: "center" });

    // Coordonnées
    doc.setFontSize(font.sizes.medium);
    doc.text("École Secondaire - Port-au-Prince, Haïti", 105, 28, {
      align: "center",
    });
    doc.text("Tél: +509 XX XX XX XX | Email: contact@imf.edu.ht", 105, 32, {
      align: "center",
    });

    // Barre de séparation
    doc.setDrawColor(...colors.text);
    doc.setLineWidth(0.5);
    doc.line(10, 36, 200, 36);

    // Remettre la couleur du texte
    doc.setTextColor(...colors.text);

    return 45;
  }, []);

  const createStudentInfo = useCallback(
    (doc: jsPDF, data: BulletinData, startY: number): number => {
      const { colors, font } = PDF_CONFIG;

      // Titre du bulletin
      doc.setFontSize(font.sizes.large);
      doc.setFont("helvetica", "bold");
      doc.text(`BULLETIN SCOLAIRE - ${data.academicYear.year}`, 105, startY, {
        align: "center",
      });

      // Informations étudiant
      doc.setFillColor(...colors.lightGray);
      doc.rect(15, startY + 7, 180, 25, "F");
      doc.setDrawColor(...colors.text);
      doc.rect(15, startY + 7, 180, 25, "S");

      doc.setFontSize(font.sizes.medium);
      doc.setFont("helvetica", "normal");

      // Colonne gauche
      doc.text(
        `Élève: ${data.student.firstName} ${data.student.lastName}`,
        20,
        startY + 12
      );
      doc.text(`Code: ${data.student.studentCode}`, 20, startY + 18);
      doc.text(`Classe: ${getLevelLabel(data.classLevel)}`, 20, startY + 24);

      // Colonne droite
      doc.text(
        `Période: ${getControlPeriodLabel(data.controlType)}`,
        110,
        startY + 12
      );
      doc.text(
        `Date: ${data.metadata.generatedAt.toLocaleDateString("fr-FR")}`,
        110,
        startY + 18
      );
      doc.text(`Document: ${data.metadata.documentNumber}`, 110, startY + 24);

      return startY + 30;
    },
    []
  );

  const createGradesTable = useCallback(
    (doc: jsPDF, data: BulletinData, startY: number): number => {
      const { colors } = PDF_CONFIG;

      const tableData = data.grades.map((grade, index) => [
        (index + 1).toString(),
        grade.subjectName,
        grade.coefficient.toString(),
        grade.grade.toFixed(2),
        grade.grade >= grade.passingGrade ? "Validé" : "Non validé",
      ]);

      autoTable(doc, {
        startY,
        head: [["No", "Matière", "Coef.", "Note", "Statut"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontStyle: "bold",
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 9,
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 100 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25, fontStyle: "bold" },
          4: { cellWidth: 30 },
        },
        willDrawCell: (cellData) => {
          if (cellData.section === "body" && cellData.column.index === 3) {
            const gradeValue = parseFloat(
              tableData[cellData.row.index][3] as string
            );
            const passingGrade =
              data.grades[cellData.row.index]?.passingGrade || 60;

            if (gradeValue < passingGrade) {
              doc.setTextColor(...colors.red);
            }
          }
        },
        didDrawCell: () => {
          doc.setTextColor(...colors.text);
        },
      });

      return (doc as any).lastAutoTable.finalY + 10;
    },
    []
  );

  const createStatistics = useCallback(
    (doc: jsPDF, data: BulletinData, startY: number): number => {
      const { colors, font } = PDF_CONFIG;

      // Titre statistiques
      doc.setFontSize(font.sizes.medium);
      doc.setFont("helvetica", "bold");
      doc.text("RÉSULTATS", 105, startY, { align: "center" });

      // Encadré statistiques
      doc.setFillColor(...colors.lightGray);
      doc.rect(15, startY + 5, 180, 30, "F");
      doc.setDrawColor(...colors.text);
      doc.rect(15, startY + 5, 180, 30, "S");

      doc.setFontSize(font.sizes.small);
      doc.setFont("helvetica", "normal");

      // Ligne 1
      doc.text(
        `Moyenne générale: ${data.statistics.weightedAverage.toFixed(2)}/20`,
        20,
        startY + 12
      );
      doc.text(
        `Total coefficients: ${data.statistics.totalCoefficient}`,
        110,
        startY + 12
      );

      // Ligne 2
      doc.text(
        `Taux de réussite: ${data.statistics.successRate.toFixed(1)}%`,
        20,
        startY + 20
      );
      doc.text(`Matières: ${data.grades.length}`, 110, startY + 20);

      // Ligne 3
      doc.text(
        `Note minimale: ${data.statistics.minGrade?.toFixed(2) || "0.00"}/20`,
        20,
        startY + 28
      );
      doc.text(
        `Note maximale: ${data.statistics.maxGrade?.toFixed(2) || "0.00"}/20`,
        110,
        startY + 28
      );

      return startY + 35;
    },
    []
  );

  const createRemarks = useCallback(
    (doc: jsPDF, data: BulletinData, startY: number): number => {
      const { font } = PDF_CONFIG;

      doc.setFontSize(font.sizes.small);
      doc.setFont("helvetica", "bold");
      doc.text("OBSERVATIONS:", 20, startY);

      doc.setFont("helvetica", "normal");

      const remarks = [
        data.remarks?.headTeacher ||
          "Aucune observation du professeur principal",
        data.remarks?.director || "Aucune observation du directeur",
        data.remarks?.generalComment || "",
      ].filter(Boolean);

      remarks.forEach((remark, index) => {
        const lines = doc.splitTextToSize(remark, 170);
        lines.forEach((line: string, lineIndex: number) => {
          doc.text(line, 20, startY + 8 + index * 12 + lineIndex * 5);
        });
      });

      return startY + remarks.length * 12 + 15;
    },
    []
  );

  const createSignatures = useCallback((doc: jsPDF, startY: number): number => {
    const signatureY = startY;

    // Signature professeur principal
    doc.text("Le Professeur Principal", 60, signatureY, { align: "center" });
    doc
      .moveTo(60, signatureY + 2)
      .lineTo(140, signatureY + 2)
      .stroke();

    // Signature directeur
    doc.text("Le Directeur", 150, signatureY, { align: "center" });
    doc
      .moveTo(150, signatureY + 2)
      .lineTo(230, signatureY + 2)
      .stroke();

    return signatureY + 20;
  }, []);

  const generateBulletinPDF = useCallback(
    async (data: BulletinData): Promise<jsPDF> => {
      const doc = new jsPDF();

      let currentY = createHeader(doc);
      currentY = createStudentInfo(doc, data, currentY);
      currentY = createGradesTable(doc, data, currentY);
      currentY = createStatistics(doc, data, currentY);
      currentY = createRemarks(doc, data, currentY);
      currentY = createSignatures(doc, currentY);

      // Pied de page
      doc.setFontSize(8);
      doc.text(
        `Document généré le ${data.metadata.generatedAt.toLocaleString(
          "fr-FR"
        )}`,
        105,
        280,
        { align: "center" }
      );
      doc.text(`Numéro: ${data.metadata.documentNumber}`, 105, 285, {
        align: "center",
      });

      return doc;
    },
    [
      createHeader,
      createStudentInfo,
      createGradesTable,
      createStatistics,
      createRemarks,
      createSignatures,
    ]
  );

  const downloadPDF = useCallback(
    async (data: BulletinData, fileName: string): Promise<void> => {
      try {
        const doc = await generateBulletinPDF(data);
        doc.save(fileName);
        toast.success("Bulletin téléchargé avec succès");
      } catch (error) {
        console.error("Erreur lors du téléchargement:", error);
        toast.error("Erreur lors du téléchargement du bulletin");
      }
    },
    [generateBulletinPDF]
  );

  const previewPDF = useCallback(
    async (data: BulletinData): Promise<void> => {
      try {
        const doc = await generateBulletinPDF(data);
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        window.open(pdfUrl, "_blank");
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

        toast.success("Prévisualisation ouverte");
      } catch (error) {
        console.error("Erreur lors de la prévisualisation:", error);
        toast.error("Erreur lors de la prévisualisation");
      }
    },
    [generateBulletinPDF]
  );

  return {
    generateBulletinPDF,
    downloadPDF,
    previewPDF,
  };
};
