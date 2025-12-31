import { useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BulletinData, ControlType, normalizeGrade } from "@/types/bulletin";
import { toast } from "sonner";

const PDF_CONFIG = {
  colors: {
    primary: [52, 152, 219] as [number, number, number],
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
  },
  margins: {
    left: 15,
    right: 15,
    top: 45,
    bottom: 30,
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
};

const getDecision = (
  average: number
): {
  label: string;
  color: [number, number, number];
  textColor: [number, number, number];
} => {
  if (average >= 15) {
    return {
      label: "ADMIS",
      color: [46, 204, 113],
      textColor: [255, 255, 255],
    };
  } else if (average >= 10) {
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
};

const addWatermark = (doc: jsPDF) => {
  const { colors, font } = PDF_CONFIG;

  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Essayer d'utiliser le logo en premier
    try {
      const logoImg = new Image();
      logoImg.src = "/logo.png";

      // Sauvegarder l'état actuel
      doc.saveGraphicsState();

      // Appliquer la transparence
      doc.setGState(new (doc as any).GState({ opacity: 0.1 }));

      // Ajouter le logo en filigrane (centré, plus grand)
      doc.addImage(logoImg, "PNG", 18, 50, 172, 200);

      // Restaurer l'état
      doc.restoreGraphicsState();
    } catch (error) {
      // Si le logo n'est pas trouvé, utiliser du texte transparent
      console.warn("Logo non trouvé, utilisation du texte en filigrane");

      doc.saveGraphicsState();
      doc.setGState(new (doc as any).GState({ opacity: 0.1 }));

      doc.setFontSize(80);
      doc.setTextColor(...colors.lightGray);
      doc.setFont("Times New Roman", "bold");

      doc.text("OFFICIEL", 105, 150, {
        align: "center",
        angle: 45,
      });

      doc.restoreGraphicsState();
    }
  }
};

export const usePDFGenerator = () => {
  // Fonction pour obtenir la note sur base 20
  const getGradeOnBase20 = useCallback((grade: any): number => {
    if (!grade) return 0;

    // Si normalizedGrade existe et est déjà sur 20
    if (grade.normalizedGrade !== undefined) {
      return Math.round(grade.normalizedGrade);
    }

    // Sinon calculer à partir de grade.grade et maxGrade
    const maxGrade = grade.subject?.maxGrade || 20;
    const rawGrade = grade.grade || 0;
    return Math.round((rawGrade * 20) / maxGrade);
  }, []);

  const createHeader = useCallback((doc: jsPDF): number => {
    const { colors, font } = PDF_CONFIG;

    // Rectangle d'en-tête
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, 210, 40, "F");

    // Logo
    try {
      const logoImg = new Image();
      logoImg.src = "/logo.png";
      doc.addImage(logoImg, "PNG", 15, 8, 20, 22);
      doc.addImage(logoImg, "PNG", 175, 8, 20, 22);
    } catch (error) {
      console.warn("Logo non trouvé, continuation sans logo");
    }

    // Titre de l'université
    doc.setFontSize(font.sizes.large);
    doc.setTextColor(...colors.white);
    doc.setFont("Times New Roman", "bold");
    doc.text("INSTITUTION MIXTE FAUSTIN 1ER DES GONAÏVES", 105, 15, {
      align: "center",
    });

    // Sigle
    doc.setFontSize(font.sizes.large);
    doc.text("IMFP", 105, 22, { align: "center" });

    // Coordonnées
    doc.setFontSize(font.sizes.medium);
    doc.text("52, Avenue des Dattes, Gonaives, Haïti", 105, 28, {
      align: "center",
    });
    doc.text(
      "E-mail : info@imfp.edu.ht | Téls : +509 4437-5351 / 4257-8735",
      105,
      32,
      { align: "center" }
    );

    // Barre de séparation
    doc.setDrawColor(...colors.text);
    doc.setLineWidth(0.5);
    doc.line(10, 36, 200, 36);

    // IMPORTANT : Remettre la couleur du texte à noir pour le contenu suivant
    doc.setTextColor(...colors.text);

    return PDF_CONFIG.margins.top;
  }, []);

  const createStudentInfo = useCallback(
    (doc: jsPDF, data: BulletinData, startY: number): number => {
      const { colors, font } = PDF_CONFIG;

      // Titre du bulletin
      doc.setFontSize(font.sizes.large);
      doc.setFont("Times New Roman", "bold");
      doc.text(`BULLETIN SCOLAIRE - ${data.academicYear.year}`, 105, startY, {
        align: "center",
      });

      // Informations étudiant
      const infoHeight = 28;
      const infoWidth = 180;
      const infoX = (210 - infoWidth) / 2;

      doc.setFillColor(...colors.lightGray);
      doc.rect(infoX, startY + 7, infoWidth, infoHeight, "F");
      doc.setDrawColor(...colors.text);
      doc.rect(infoX, startY + 7, infoWidth, infoHeight, "S");

      doc.setFontSize(font.sizes.medium);
      doc.setFont("Times New Roman", "bold");

      // Colonne gauche
      const leftX = infoX + 10;
      doc.text(
        `Nom et Prénom: ${data.student.firstName} ${data.student.lastName}`,
        leftX,
        startY + 16
      );
      doc.text(`Code Élève: ${data.student.studentCode}`, leftX, startY + 22);

      // Colonne droite
      const rightX = infoX + 100;
      const controlLabel = data.showAllControls
        ? "Année Complète"
        : getControlPeriodLabel(data.controlType);
      doc.text(`Niveau: ${data.classLevel}`, rightX, startY + 16);
      doc.text(`Période: ${controlLabel}`, rightX, startY + 22);

      return startY + infoHeight + 12;
    },
    []
  );

  const createGradesTable = useCallback(
    (doc: jsPDF, data: BulletinData, startY: number): number => {
      const { colors, margins } = PDF_CONFIG;

      // Déterminer si on affiche tous les contrôles
      const showAllControls = data.showAllControls || false;

      if (showAllControls) {
        // Mode tous les contrôles
        const allControlTypes = [
          ControlType.CONTROLE_1,
          ControlType.CONTROLE_2,
          ControlType.CONTROLE_3,
          ControlType.CONTROLE_4,
        ];

        // Filtrer les contrôles qui ont des données
        const availableControlTypes = allControlTypes.filter((controlType) => {
          return data.grades.some((grade) => grade.controlType === controlType);
        });

        if (availableControlTypes.length === 0) {
          // Si aucun contrôle n'a de données, afficher un tableau simple
          doc.setFontSize(10);
          doc.setFont("Times New Roman", "bold");
          doc.text("Aucune donnée de contrôle disponible", 105, startY + 10, {
            align: "center",
          });
          return startY + 20;
        }

        // Créer les en-têtes s
        const headers = [
          "No",
          "Matière",
          "BASE",
          "COEF",
          ...availableControlTypes.map((_, index) => `C${index + 1}`),
        ];

        // Grouper les notes par matière
        const subjects = Array.from(
          new Set(data.grades.map((g) => g.subjectName))
        );

        // Préparer les données
        const tableData = subjects.map((subjectName, index) => {
          const subjectGrades = data.grades.filter(
            (g) => g.subjectName === subjectName
          );
          const firstGrade = subjectGrades[0];
          const maxGrade = firstGrade.subject?.maxGrade || 20;

          const row = [
            (index + 1).toString(),
            subjectName,
            maxGrade,
            firstGrade?.coefficient || 1,
          ];

          // Ajouter les notes par contrôle pour cette matière
          availableControlTypes.forEach((controlType) => {
            const gradeForControl = subjectGrades.find(
              (g) => g.controlType === controlType
            );
            if (gradeForControl) {
              const grade = gradeForControl.grade;
              row.push(grade);
            } else {
              row.push("-");
            }
          });

          return row;
        });

        // Ajouter une ligne vide
        tableData.push([
          "",
          "",
          "",
          "",
          ...availableControlTypes.map(() => ""),
        ]);

        // Calculer les totaux pour chaque contrôle
        if (availableControlTypes.length > 0) {
          const totalsRow = ["", "", "", "Total"];
          const averagesRow = ["", "", "", "Moy"];

          availableControlTypes.forEach((controlType) => {
            let total = 0;
            let count = 0;

            subjects.forEach((subjectName) => {
              const subjectGrades = data.grades.filter(
                (g) => g.subjectName === subjectName
              );
              const gradeForControl = subjectGrades.find(
                (g) => g.controlType === controlType
              );
              if (gradeForControl) {
                total += getGradeOnBase20(gradeForControl);
                count++;
              }
            });

            totalsRow.push(count > 0 ? total.toString() : "-");
            averagesRow.push(
              count > 0 ? Math.round(total / count).toString() : "-"
            );
          });

          tableData.push(totalsRow);
          tableData.push(averagesRow);
        }

        // Configuration du tableau
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
          Math.floor(remainingWidth / controlColumnCount)
        );
        const controlColumnWidth = Math.max(12, maxControlColumnWidth);

        // Ajouter les colonnes pour chaque contrôle
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
            fillColor: colors.primary,
            textColor: colors.white,
            fontStyle: "bold",
            fontSize: 9,
            cellPadding: 1,
          },
          bodyStyles: {
            fontSize: 7,
            cellPadding: 1,
          },
          styles: {
            fontSize: 7,
            cellPadding: 1,
            overflow: "linebreak",
            lineWidth: 0.1,
          },
          columnStyles: columnStyles,
          margin: { left: margins.left + 5, right: margins.right + 5 },
          tableWidth: "wrap",
        });

        return (doc as any).lastAutoTable.finalY + 10;
      } else {
        // Mode un seul contrôle

        // Préparer les données du tableau
        const tableData = data.grades.map((grade, index) => {
          const maxGrade = grade.subject?.maxGrade || 20;
          const gradeOn20 = getGradeOnBase20(grade);

          return [
            (index + 1).toString(),
            grade.subjectName,
            maxGrade,
            grade.coefficient,
            grade.grade,
          ];
        });

        // Calculer la moyenne pondérée
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

        // Ajouter une ligne vide
        tableData.push(["", "", "", "", ""]);

        // Ajouter la ligne Total coefficient
        tableData.push([
          "",
          "",
          "",
          "Total Coeff",
          totalCoefficient.toString(),
        ]);

        // Ajouter la ligne Moyenne pondérée
        tableData.push(["", "", "", "Moyenne", weightedAverage.toString()]);

        autoTable(doc, {
          startY,
          head: [["No", "Matière", "BASE", "COEFFICIENT", "NOTES"]],
          body: tableData,
          theme: "grid",
          headStyles: {
            fillColor: colors.primary,
            textColor: colors.white,
            fontStyle: "bold",
            fontSize: 9,
            cellPadding: 2,
          },
          bodyStyles: {
            fontSize: 9,
            cellPadding: 2,
          },
          styles: {
            fontSize: 9,
            cellPadding: 2,
            overflow: "linebreak",
          },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 100 },
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
    [getGradeOnBase20]
  );

  const createStatistics = useCallback(
    (doc: jsPDF, data: BulletinData, startY: number): number => {
      const { colors, font } = PDF_CONFIG;

      // Titre statistiques
      doc.setFontSize(font.sizes.medium);
      doc.setFont("Times New Roman", "bold");
      doc.text("RÉSULTATS", 105, startY, { align: "center" });

      // Statistiques sur deux lignes comme dans le PDF exemple
      doc.setFontSize(font.sizes.small);
      doc.setFont("Times New Roman", "bold");

      // Ligne 1
      doc.text(
        `Moyenne générale: ${data.statistics.weightedAverage.toFixed(2)}/20`,
        40,
        startY + 10
      );
      doc.text(
        `Total coefficients: ${data.statistics.totalCoefficient}`,
        150,
        startY + 10
      );

      // Ligne 2
      doc.text(
        `Taux de réussite: ${data.statistics.successRate.toFixed(1)}%`,
        40,
        startY + 18
      );
      doc.text(
        `Matières: ${data.statistics.totalSubjects || data.grades.length}`,
        150,
        startY + 18
      );

      return startY + 35;
    },
    []
  );

  const createSignatures = useCallback((doc: jsPDF, startY: number): number => {
    const { margins } = PDF_CONFIG;

    // Vérifier si on a assez d'espace
    const pageHeight = 297;
    if (startY > pageHeight - 40) {
      doc.addPage();
      startY = margins.top;
    }

    // Signature professeur principal
    const teacherX = 60;
    doc.setFontSize(10);
    doc.text("Le Professeur Principal", teacherX, startY + 15, {
      align: "center",
    });
    doc.setLineWidth(0.5);
    doc
      .moveTo(teacherX - 40, startY + 10)
      .lineTo(teacherX + 40, startY + 10)
      .stroke();

    // Signature directeur
    const directorX = 140;
    doc.text("Le Directeur", directorX, startY + 15, { align: "center" });
    doc
      .moveTo(directorX - 40, startY + 10)
      .lineTo(directorX + 40, startY + 10)
      .stroke();

    return startY + 20;
  }, []);

  const generateBulletinPDF = useCallback(
    async (data: BulletinData): Promise<jsPDF> => {
      const doc = new jsPDF();

      let currentY = createHeader(doc);
      currentY = createStudentInfo(doc, data, currentY);
      currentY = createGradesTable(doc, data, currentY);
      currentY = createStatistics(doc, data, currentY);
      addWatermark(doc);

      // Ajouter la décision finale seulement si on montre tous les contrôles
      if (data.showAllControls) {
        doc.setFontSize(10);
        doc.setFont("Times New Roman", "normal");
        doc.text(
          `Moyenne generale: ${data.statistics.weightedAverage.toFixed(2)}/20`,
          105,
          currentY,
          { align: "center" }
        );
        currentY += 8;

        const decision = getDecision(data.statistics.weightedAverage);
        doc.setFont("Times New Roman", "bold");
        doc.text(`Decision: ${decision.label}`, 105, currentY, {
          align: "center",
        });
        currentY += 15;
      }

      currentY = createSignatures(doc, currentY);

      // Pied de page
      doc.setFontSize(8);
      const footerY = 280;
      doc.text(
        `Document généré le ${data.metadata.generatedAt.toLocaleString(
          "fr-FR"
        )}`,
        105,
        footerY,
        { align: "center" }
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
    getGradeOnBase20, // Export pour les tests
  };
};
