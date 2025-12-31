import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ControlType,
  DocumentLanguage,
  DocumentType,
} from "../../generated/prisma";

interface GeneratePDFOptions {
  documentType: DocumentType;
  student: any;
  academicYear: any;
  controlType: ControlType;
  classLevel: string;
  grades?: any[];
  statistics?: any;
  language: DocumentLanguage;
  withSignature: boolean;
  withStamp: boolean;
}

export async function generateDocumentPDF(
  options: GeneratePDFOptions
): Promise<Buffer> {
  const {
    documentType,
    student,
    academicYear,
    controlType,
    classLevel,
    grades = [],
    statistics,
    language,
    withSignature,
    withStamp,
  } = options;

  const doc = new jsPDF();

  // Configuration des couleurs
  const primaryColor: [number, number, number] = [52, 152, 219];
  const textColor: [number, number, number] = [0, 0, 0];
  const redColor: [number, number, number] = [231, 76, 60];
  const greenColor: [number, number, number] = [46, 204, 113];
  const grayColor: [number, number, number] = [240, 240, 240];

  // En-tête universitaire
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 35, "F");

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("UNIVERSITÉ JÉRUSALEM DE PIGNON D'HAÏTI", 105, 15, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.text("UJEPH", 105, 22, { align: "center" });

  doc.setFontSize(10);
  doc.text("83, Rue de l'Université Jérusalem, Pignon, Haïti", 105, 28, {
    align: "center",
  });
  doc.text(
    "E-mail : info@ujeph.edu.ht | Téls : +509 4289-9225 / 3620-3021",
    105,
    32,
    { align: "center" }
  );

  // Barre de séparation
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(10, 36, 200, 36);

  // Sélection du type de document
  switch (documentType) {
    case "BULLETIN":
      return generateBulletinPDF(doc, options);
    case "RELEVE":
      return generateRelevePDF(doc, options);
    case "ATTESTATION_NIVEAU":
      return generateAttestationNiveauPDF(doc, options);
    case "ATTESTATION_FIN_ETUDES":
      return generateAttestationFinEtudesPDF(doc, options);
    case "CERTIFICAT_SCOLARITE":
      return generateCertificatScolaritePDF(doc, options);
    default:
      return generateBulletinPDF(doc, options);
  }
}

export function generateBulletinPDF(
  doc: jsPDF,
  options: GeneratePDFOptions
): Buffer {
  const {
    student,
    academicYear,
    controlType,
    classLevel,
    grades = [],
    statistics,
  } = options;

  // Titre du document
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("BULLETIN DE NOTES OFFICIEL", 105, 45, { align: "center" });

  // Informations de l'étudiant
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Nom: ${student.lastName}`, 20, 55);
  doc.text(`Prénom: ${student.firstName}`, 20, 60);
  doc.text(`Matricule: ${student.studentCode}`, 20, 65);
  doc.text(`Niveau: ${classLevel}`, 120, 55);
  doc.text(`Année académique: ${academicYear.year}`, 120, 60);
  doc.text(`Type de contrôle: ${controlType}`, 120, 65);

  // Calculer les notes avec normalisation
  const gradesWithCalculations = grades.map((grade) => {
    const subject = grade.subject || grade.classAssignment?.subject;
    const maxGrade = subject.maxGrade;
    const coefficient = subject.coefficient;
    const passingGrade = subject.passingGrade;

    // Normaliser sur 20
    const normalizedGrade = (grade.grade / maxGrade) * 20;
    const weightedGrade = normalizedGrade * coefficient;

    // Déterminer le statut
    const normalizedPassing = (passingGrade / maxGrade) * 20;
    const status = normalizedGrade >= normalizedPassing ? "Réussi" : "Échoué";

    return {
      subject: subject.name,
      grade: grade.grade,
      maxGrade,
      coefficient,
      normalizedGrade: normalizedGrade.toFixed(2),
      weightedGrade: weightedGrade.toFixed(2),
      status,
      noteSur20: normalizedGrade.toFixed(2),
    };
  });

  // Tableau des notes
  const tableData = gradesWithCalculations.map((g) => [
    g.subject,
    g.grade.toString(),
    g.maxGrade.toString(),
    g.coefficient.toString(),
    g.noteSur20,
    g.status,
  ]);

  autoTable(doc, {
    startY: 75,
    head: [["Matière", "Note", "Base", "Coef.", "Note/20", "Statut"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [52, 152, 219],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    didDrawPage: (data) => {
      // Statistiques
      const finalY = data.cursor?.y || 150;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("STATISTIQUES", 20, finalY + 10);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Moyenne générale: ${statistics?.average?.toFixed(2) || "0.00"} / 20`,
        20,
        finalY + 20
      );
      doc.text(
        `Rang: ${statistics?.rank || "N/A"} sur ${statistics?.totalStudents || "N/A"}`,
        20,
        finalY + 27
      );
      doc.text(
        `Crédits obtenus: ${statistics?.creditsEarned || "0"} / ${statistics?.totalCredits || "0"}`,
        20,
        finalY + 34
      );
      doc.text(
        `Taux de réussite: ${statistics?.successRate?.toFixed(2) || "0.00"}%`,
        20,
        finalY + 41
      );
    },
  });

  return Buffer.from(doc.output("arraybuffer"));
}

export function generateRelevePDF(
  doc: jsPDF,
  options: GeneratePDFOptions
): Buffer {
  // Implémentation similaire avec focus sur le relevé de notes
  // ... (votre logique existante)
  return Buffer.from(doc.output("arraybuffer"));
}

export function generateAttestationNiveauPDF(
  doc: jsPDF,
  options: GeneratePDFOptions
): Buffer {
  // Implémentation pour l'attestation de niveau
  // ... (votre logique existante)
  return Buffer.from(doc.output("arraybuffer"));
}

export function generateAttestationFinEtudesPDF(
  doc: jsPDF,
  options: GeneratePDFOptions
): Buffer {
  // Implémentation pour l'attestation de fin d'études
  // ... (votre logique existante)
  return Buffer.from(doc.output("arraybuffer"));
}

export function generateCertificatScolaritePDF(
  doc: jsPDF,
  options: GeneratePDFOptions
): Buffer {
  // Implémentation pour le certificat de scolarité
  // ... (votre logique existante)
  return Buffer.from(doc.output("arraybuffer"));
}
