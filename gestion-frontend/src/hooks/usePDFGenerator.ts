import { useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BulletinData, ControlType } from "@/types/bulletin";
import { toast } from "sonner";
import { useSettings } from "@/hooks/useSystemSettings";

export const usePDFGenerator = () => {
  // Utiliser les paramètres système
  const { settings, getSchoolInfo, formatGrade } = useSettings();
  const schoolInfo = getSchoolInfo();

  // Convertir couleur hex en RGB
  const hexToRgb = useCallback((hex: string): [number, number, number] => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [52, 152, 219];
  }, []);

  // Configuration dynamique basée sur les settings
  const getPDFConfig = useCallback(() => {
    return {
      colors: {
        primary: settings?.primaryColor
          ? hexToRgb(settings.primaryColor)
          : [52, 152, 219],
        text: [0, 0, 0] as [number, number, number],
        red: [231, 76, 60] as [number, number, number],
        green: [46, 204, 113] as [number, number, number],
        yellow: [241, 196, 15] as [number, number, number],
        orange: [230, 126, 34] as [number, number, number],
        purple: [155, 89, 182] as [number, number, number],
        white: [255, 255, 255] as [number, number, number],
        lightGray: [240, 240, 240] as [number, number, number],
      },
      font: {
        sizes: {
          xlarge: 18,
          large: 14,
          medium: 12,
          small: 10,
          xsmall: 8,
        },
        family: settings?.fontFamily || "Times New Roman",
      },
      margins: {
        left: 15,
        right: 15,
        top: 45,
        bottom: 30,
      },
    };
  }, [settings?.primaryColor, settings?.fontFamily, hexToRgb]);

  const getControlPeriodLabel = useCallback(
    (controlType: ControlType): string => {
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
    },
    [],
  );

  const getLevelLabel = useCallback((level: string): string => {
    const levels: Record<string, string> = {
      Sixieme: "6ème",
      Cinquieme: "5ème",
      Quatrieme: "4ème",
      Troisieme: "3ème",
      Seconde: "2nde",
      Premiere: "1ère",
      Terminale: "Tle",
      NSI: "NS I",
      NSII: "NS II",
      NSIII: "NS III",
      NSIV: "NS IV",
    };
    return levels[level] || level;
  }, []);

  const getDecision = useCallback(
    (
      average: number,
    ): {
      label: string;
      color: [number, number, number];
      textColor: [number, number, number];
    } => {
      const passingGrade = settings?.passingGrade || 50;
      const maxGrade = settings?.maxGrade || 100;

      // Normaliser selon le système de notation
      let normalizedAvg = average;
      if (settings?.gradingSystem === "gpa") {
        normalizedAvg = (average / 4) * 20; // Convertir GPA sur 4 en note sur 20
      }

      if (normalizedAvg >= 15) {
        return {
          label: "ADMIS",
          color: [46, 204, 113],
          textColor: [255, 255, 255],
        };
      } else if (normalizedAvg >= passingGrade) {
        return {
          label: "À REFAIRE",
          color: [241, 196, 15],
          textColor: [0, 0, 0],
        };
      } else {
        return {
          label: "À REFAIRE AILLEURS",
          color: [231, 76, 60],
          textColor: [255, 255, 255],
        };
      }
    },
    [settings?.passingGrade, settings?.maxGrade, settings?.gradingSystem],
  );

  const getGradeOnBase20 = useCallback((grade: any): number => {
    if (!grade) return 0;

    if (grade.normalizedGrade !== undefined) {
      return Math.round(grade.normalizedGrade);
    }

    const maxGrade = grade.subject?.maxGrade || 20;
    const rawGrade = grade.grade || 0;
    return Math.round((rawGrade * 20) / maxGrade);
  }, []);

  const addWatermark = useCallback(
    (doc: jsPDF) => {
      const config = getPDFConfig();
      const { colors } = config;

      const pageCount = doc.getNumberOfPages();

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        try {
          const logoImg = new Image();
          logoImg.src = settings?.schoolLogo
            ? `http://localhost:5000${settings.schoolLogo}`
            : "/logo.png";

          doc.saveGraphicsState();
          doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
          doc.addImage(logoImg, "PNG", 18, 50, 172, 200);
          doc.restoreGraphicsState();
        } catch (error) {
          console.warn("Logo non trouvé, utilisation du texte en filigrane");

          doc.saveGraphicsState();
          doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
          doc.setFontSize(80);
          doc.setTextColor(...colors.lightGray);
          doc.setFont(config.font.family, "bold");
          doc.text("OFFICIEL", 105, 150, { align: "center", angle: 45 });
          doc.restoreGraphicsState();
        }
      }
    },
    [settings?.schoolLogo, getPDFConfig],
  );

  const createHeader = useCallback(
    (doc: jsPDF): number => {
      const config = getPDFConfig();
      const { colors, font } = config;

      doc.setFillColor(...(colors.primary as [number, number, number]));
      doc.rect(0, 0, 210, 40, "F");

      try {
        const logoImg = new Image();
        logoImg.src = settings?.schoolLogo
          ? `http://localhost:5000${settings.schoolLogo}`
          : "/logo.png";
        doc.addImage(logoImg, "PNG", 15, 8, 20, 22);
        doc.addImage(logoImg, "PNG", 175, 8, 20, 22);
      } catch (error) {
        console.warn("Logo non trouvé, continuation sans logo");
      }

      doc.setFontSize(font.sizes.large);
      doc.setTextColor(...colors.white);
      doc.setFont(font.family, "bold");
      doc.text(schoolInfo.slogan.toUpperCase(), 105, 15, { align: "center" });

      doc.text(schoolInfo.name, 105, 22, { align: "center" });

      doc.setFontSize(font.sizes.medium);
      doc.text(
        `${schoolInfo.address}, ${schoolInfo.city}, ${schoolInfo.country}`,
        105,
        28,
        {
          align: "center",
        },
      );
      doc.text(
        `E-mail : ${schoolInfo.email} | Tél : ${schoolInfo.phone} / ${schoolInfo.website}`,
        105,
        32,
        { align: "center" },
      );

      doc.setDrawColor(...colors.text);
      doc.setLineWidth(0.5);
      doc.line(10, 36, 200, 36);

      doc.setTextColor(...colors.text);

      return config.margins.top;
    },
    [schoolInfo, settings?.schoolLogo, getPDFConfig],
  );

  const createStudentInfo = useCallback(
    (doc: jsPDF, data: BulletinData, startY: number): number => {
      const config = getPDFConfig();
      const { colors, font } = config;

      doc.setFontSize(font.sizes.large);
      doc.setFont(font.family, "bold");
      doc.text(`BULLETIN SCOLAIRE - ${data.academicYear.year}`, 105, startY, {
        align: "center",
      });

      const infoHeight = 28;
      const infoWidth = 180;
      const infoX = (210 - infoWidth) / 2;

      doc.setFillColor(...colors.lightGray);
      doc.rect(infoX, startY + 7, infoWidth, infoHeight, "F");
      doc.setDrawColor(...colors.text);
      doc.rect(infoX, startY + 7, infoWidth, infoHeight, "S");

      doc.setFontSize(font.sizes.medium);
      doc.setFont(font.family, "bold");

      const leftX = infoX + 10;
      doc.text(
        `Nom et Prénom: ${data.student.firstName} ${data.student.lastName}`,
        leftX,
        startY + 16,
      );
      doc.text(`Code Élève: ${data.student.studentCode}`, leftX, startY + 22);

      const rightX = infoX + 100;
      const controlLabel = data.showAllControls
        ? "Année Complète"
        : getControlPeriodLabel(data.controlType);
      doc.text(
        `Niveau: ${getLevelLabel(data.classLevel)}`,
        rightX,
        startY + 16,
      );
      doc.text(`Période: ${controlLabel}`, rightX, startY + 22);

      return startY + infoHeight + 12;
    },
    [getControlPeriodLabel, getLevelLabel, getPDFConfig],
  );

  const createGradesTable = useCallback(
    (doc: jsPDF, data: BulletinData, startY: number): number => {
      const config = getPDFConfig();
      const { colors, font, margins } = config;

      const showAllControls = data.showAllControls || false;

      if (showAllControls) {
        const allControlTypes = [
          ControlType.CONTROLE_1,
          ControlType.CONTROLE_2,
          ControlType.CONTROLE_3,
          ControlType.CONTROLE_4,
        ];

        const availableControlTypes = allControlTypes.filter((controlType) => {
          return data.grades.some((grade) => grade.controlType === controlType);
        });

        if (availableControlTypes.length === 0) {
          doc.setFontSize(10);
          doc.setFont(font.family, "bold");
          doc.text("Aucune donnée de contrôle disponible", 105, startY + 10, {
            align: "center",
          });
          return startY + 20;
        }

        const headers = [
          "No",
          "Matière",
          "BASE",
          "COEF",
          ...availableControlTypes.map((_, index) => `C${index + 1}`),
        ];

        const subjects = Array.from(
          new Set(data.grades.map((g) => g.subjectName)),
        );

        const tableData = subjects.map((subjectName, index) => {
          const subjectGrades = data.grades.filter(
            (g) => g.subjectName === subjectName,
          );
          const firstGrade = subjectGrades[0];
          const maxGrade = firstGrade.subject?.maxGrade || 20;

          const row = [
            (index + 1).toString(),
            subjectName,
            maxGrade.toString(),
            firstGrade?.coefficient?.toString() || "1",
          ];

          availableControlTypes.forEach((controlType) => {
            const gradeForControl = subjectGrades.find(
              (g) => g.controlType === controlType,
            );
            if (gradeForControl) {
              row.push(formatGrade(gradeForControl.grade));
            } else {
              row.push("-");
            }
          });

          return row;
        });

        const pageWidth = 210;
        const availableWidth = pageWidth - margins.left - margins.right;

        const columnStyles: Record<number, any> = {
          0: { cellWidth: 10, halign: "center", fontSize: 10 },
          1: { cellWidth: 40, halign: "left", fontSize: 10 },
          2: { cellWidth: 15, halign: "center", fontSize: 10 },
          3: { cellWidth: 12, halign: "center", fontSize: 10 },
        };

        const fixedColumnsWidth = 10 + 40 + 15 + 12;
        const remainingWidth = availableWidth - fixedColumnsWidth - 10;
        const controlColumnCount = availableControlTypes.length;
        const maxControlColumnWidth = Math.min(
          20,
          Math.floor(remainingWidth / controlColumnCount),
        );
        const controlColumnWidth = Math.max(12, maxControlColumnWidth);

        for (let i = 0; i < controlColumnCount; i++) {
          columnStyles[4 + i] = {
            cellWidth: controlColumnWidth,
            halign: "center",
            fontSize: 10,
          };
        }

        autoTable(doc, {
          startY,
          head: [headers],
          body: tableData,
          theme: "grid",
          headStyles: {
            fillColor: colors.primary as [number, number, number],
            textColor: colors.white,
            fontStyle: "bold",
            fontSize: 9,
            cellPadding: 1,
            font: font.family,
          },
          bodyStyles: {
            fontSize: 7,
            cellPadding: 1,
            font: font.family,
          },
          styles: {
            fontSize: 7,
            cellPadding: 1,
            font: font.family,
            overflow: "linebreak",
            lineWidth: 0.1,
          },
          columnStyles,
          margin: { left: margins.left + 5, right: margins.right + 5 },
          tableWidth: "wrap",
        });

        return (doc as any).lastAutoTable.finalY + 10;
      } else {
        const tableData = data.grades.map((grade, index) => {
          const maxGrade = grade.subject?.maxGrade || 20;

          return [
            (index + 1).toString(),
            grade.subjectName,
            maxGrade.toString(),
            grade.coefficient?.toString() || "1",
            formatGrade(grade.grade),
          ];
        });

        let totalWeightedSum = 0;
        let totalCoefficient = 0;

        data.grades.forEach((grade) => {
          const gradeOn20 = getGradeOnBase20(grade);
          const coefficient = grade.coefficient || 1;

          totalWeightedSum += gradeOn20 * coefficient;
          totalCoefficient += coefficient;
        });

        const weightedAverage =
          totalCoefficient > 0
            ? Math.round(totalWeightedSum / totalCoefficient)
            : 0;

        tableData.push(["", "", "", "", ""]);
        tableData.push([
          "",
          "",
          "",
          "Total Coeff",
          totalCoefficient.toString(),
        ]);
        tableData.push(["", "", "", "Moyenne", formatGrade(weightedAverage)]);

        autoTable(doc, {
          startY,
          head: [["No", "Matière", "BASE", "COEFFICIENT", "NOTES"]],
          body: tableData,
          theme: "grid",
          headStyles: {
            fillColor: colors.primary as [number, number, number],
            textColor: colors.white,
            fontStyle: "bold",
            fontSize: 9,
            cellPadding: 2,
            font: font.family,
          },
          bodyStyles: {
            fontSize: 9,
            cellPadding: 2,
            font: font.family,
          },
          styles: {
            fontSize: 9,
            cellPadding: 2,
            font: font.family,
            overflow: "linebreak",
          },
          columnStyles: {
            0: { cellWidth: 15, halign: "center" },
            1: { cellWidth: 100, halign: "left" },
            2: { cellWidth: 20, halign: "center" },
            3: { cellWidth: 25, halign: "center" },
            4: { cellWidth: 20, halign: "center" },
          },
          margin: { left: margins.left, right: margins.right },
          tableWidth: "auto",
        });

        return (doc as any).lastAutoTable.finalY + 10;
      }
    },
    [getGradeOnBase20, formatGrade, getPDFConfig],
  );

  const createStatistics = useCallback(
    (doc: jsPDF, data: BulletinData, startY: number): number => {
      const config = getPDFConfig();
      const { colors, font } = config;

      doc.setFontSize(font.sizes.medium);
      doc.setFont(font.family, "bold");
      doc.text("RÉSULTATS", 105, startY, { align: "center" });

      doc.setFontSize(font.sizes.small);
      doc.setFont(font.family, "bold");

      doc.text(
        `Moyenne générale: ${formatGrade(data.statistics.weightedAverage)}`,
        40,
        startY + 10,
      );
      doc.text(
        `Total coefficients: ${data.statistics.totalCoefficient}`,
        150,
        startY + 10,
      );

      doc.text(
        `Taux de réussite: ${data.statistics.successRate.toFixed(1)}%`,
        40,
        startY + 18,
      );
      doc.text(
        `Matières: ${data.statistics.totalSubjects || data.grades.length}`,
        150,
        startY + 18,
      );

      return startY + 35;
    },
    [formatGrade, getPDFConfig],
  );

  const createSignatures = useCallback(
    (doc: jsPDF, startY: number): number => {
      const config = getPDFConfig();
      const { margins, font } = config;

      const pageHeight = 297;
      if (startY > pageHeight - 40) {
        doc.addPage();
        startY = margins.top;
      }

      doc.setFont(font.family, "normal");
      doc.setFontSize(10);

      const directorX = 170;
      doc.text("Le Directeur", directorX, startY + 75, { align: "center" });
      doc
        .moveTo(directorX - 20, startY + 70)
        .lineTo(directorX + 20, startY + 70)
        .stroke();

      return startY + 20;
    },
    [getPDFConfig],
  );

  const generateBulletinPDF = useCallback(
    async (data: BulletinData): Promise<jsPDF> => {
      const doc = new jsPDF();

      let currentY = createHeader(doc);
      currentY = createStudentInfo(doc, data, currentY);
      currentY = createGradesTable(doc, data, currentY);
      currentY = createStatistics(doc, data, currentY);
      addWatermark(doc);

      if (data.showAllControls) {
        doc.setFontSize(10);
        doc.setFont(getPDFConfig().font.family, "normal");
        doc.text(
          `Moyenne generale: ${formatGrade(data.statistics.weightedAverage)}`,
          105,
          currentY,
          { align: "center" },
        );
        currentY += 8;

        const decision = getDecision(data.statistics.weightedAverage);
        doc.setFont(getPDFConfig().font.family, "bold");
        doc.text(`Decision: ${decision.label}`, 105, currentY, {
          align: "center",
        });
        currentY += 15;
      }

      currentY = createSignatures(doc, currentY);

      doc.setFontSize(8);
      const footerY = 280;
      doc.text(
        `Document généré le ${data.metadata.generatedAt.toLocaleString(
          "fr-FR",
        )}`,
        105,
        footerY,
        { align: "center" },
      );
      doc.text(`Numéro: ${data.metadata.documentNumber}`, 105, footerY + 5, {
        align: "center",
      });

      return doc;
    },
    [
      createHeader,
      createStudentInfo,
      createGradesTable,
      createStatistics,
      addWatermark,
      createSignatures,
      getDecision,
      formatGrade,
      getPDFConfig,
    ],
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
    [generateBulletinPDF],
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
    [generateBulletinPDF],
  );

  return {
    generateBulletinPDF,
    downloadPDF,
    previewPDF,
    getGradeOnBase20,
  };
};
