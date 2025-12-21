/**
 * Service pour la génération et la gestion des bulletins scolaires
 */

import PDFDocument from "pdfkit";

import { PrismaClient } from "../../generated/prisma";
import {
  BulletinData,
  BulletinPDFOptions,
  BulletinRequest,
} from "../types/bulletin";

export class BulletinService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Récupère les données nécessaires pour générer un bulletin
   */
  async getBulletinData(request: BulletinRequest): Promise<BulletinData> {
    try {
      // Récupérer l'étudiant
      const student = await this.prisma.student.findUnique({
        where: { id: request.studentId },
        include: {
          schoolClass: true,
          user: true,
        },
      });

      if (!student) {
        throw new Error("Étudiant non trouvé");
      }

      // Récupérer l'année académique
      const academicYear = await this.prisma.academicYear.findUnique({
        where: { id: request.academicYearId },
      });

      if (!academicYear) {
        throw new Error("Année académique non trouvée");
      }

      // Récupérer les notes pour cette période
      const grades = await this.prisma.grade.findMany({
        where: {
          studentId: request.studentId,
          academicYearId: request.academicYearId,
          controlType: request.controlType,
          isActive: true,
        },
        include: {
          subject: true,
          classAssignment: {
            include: {
              professeur: true,
            },
          },
        },
      });

      // Récupérer l'inscription active
      const enrollment = await this.prisma.enrollment.findFirst({
        where: {
          studentId: request.studentId,
          academicYearId: request.academicYearId,
          status: "Active",
        },
        include: {
          schoolClass: true,
        },
      });

      if (!enrollment) {
        throw new Error("Inscription active non trouvée");
      }

      // Calculer les statistiques
      const statistics = this.calculateStatistics(grades);

      // Préparer les données du bulletin
      const bulletinData: BulletinData = {
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          studentCode: student.studentCode,
          dateOfBirth: student.dateOfBirth || new Date(),
          placeOfBirth: student.placeOfBirth ?? undefined,
          photo: student.photo ?? undefined,
          bloodGroup: student.bloodGroup || undefined,
        },
        classInfo: {
          id: enrollment.schoolClass.id,
          name: enrollment.schoolClass.name,
          level: enrollment.schoolClass.level,
          professeurPrincipal: "À déterminer", // À implémenter
        },
        academicYear: {
          id: academicYear.id,
          year: academicYear.year,
          startDate: academicYear.startDate,
          endDate: academicYear.endDate,
        },
        grades: grades.map((grade) => ({
          subject: grade.subject.name,
          coefficient: grade.subject.coefficient,
          grade: grade.grade,
          status: String(grade.status),
          controlType: grade.controlType as any,
          passingGrade: grade.subject.passingGrade,
          professeur: `${grade.classAssignment.professeur.firstName} ${grade.classAssignment.professeur.lastName}`,
          comments: grade.notes ?? undefined,
        })),
        statistics,
        remarks: {
          headTeacher: "",
          director: "",
          generalComment: "",
        },
        metadata: {
          generatedAt: new Date(),
          generatedBy: "Système",
          documentNumber: this.generateDocumentNumber(),
          controlPeriod: this.getControlPeriodDescription(request.controlType),
        },
      };

      return bulletinData;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données du bulletin:",
        error
      );
      throw error;
    }
  }

  /**
   * Calcule les statistiques du bulletin
   */
  private calculateStatistics(grades: any[]) {
    if (grades.length === 0) {
      return {
        average: 0,
        weightedAverage: 0,
        totalCoefficient: 0,
        successRate: 0,
      };
    }

    let totalWeightedGrades = 0;
    let totalCoefficient = 0;
    let passedSubjects = 0;

    grades.forEach((grade) => {
      const weight = grade.subject.coefficient;
      totalWeightedGrades += grade.grade * weight;
      totalCoefficient += weight;

      if (grade.grade >= grade.subject.passingGrade) {
        passedSubjects++;
      }
    });

    const weightedAverage =
      totalCoefficient > 0 ? totalWeightedGrades / totalCoefficient : 0;
    const successRate = (passedSubjects / grades.length) * 100;

    // Calculer la moyenne simple
    const average =
      grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;

    // Trouver les notes min et max
    const minGrade = Math.min(...grades.map((g) => g.grade));
    const maxGrade = Math.max(...grades.map((g) => g.grade));

    return {
      average: parseFloat(average.toFixed(2)),
      weightedAverage: parseFloat(weightedAverage.toFixed(2)),
      totalCoefficient,
      successRate: parseFloat(successRate.toFixed(2)),
      minGrade: parseFloat(minGrade.toFixed(2)),
      maxGrade: parseFloat(maxGrade.toFixed(2)),
    };
  }

  /**
   * Récupère un bulletin par son ID
   */
  async getTranscriptById(transcriptId: string) {
    return this.prisma.transcript.findUnique({
      where: { id: transcriptId },
    });
  }

  /**
   * recordDocumentAction enregistre une action effectuée sur un document
   */
  async recordDocumentAction(
    transcriptId: string,
    action: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    // Implémentation de la méthode recordDocumentAction
    await this.prisma.documentHistory.create({
      data: {
        transcriptId,
        action: action as any,
        performedBy: userId,
        ipAddress,
        userAgent,
        performedAt: new Date(),
      },
    });
  }

  /**
   * Aperçu du bulletin sans l'enregistrer
   */
  async previewBulletin(request: BulletinRequest): Promise<Buffer> {
    const bulletinData = await this.getBulletinData(request);

    const pdfBuffer = await this.generateBulletinPDF(bulletinData, {
      includeHeader: true,
      includeFooter: true,
      includeSchoolLogo: true,
      language: request.language || "FR",
    });

    return pdfBuffer;
  }

  /**
   * Génère un numéro de document unique
   */
  private generateDocumentNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BUL-${timestamp}-${random}`;
  }

  /**
   * Obtient la description de la période de contrôle
   */
  private getControlPeriodDescription(controlType: string): string {
    const periods: Record<string, string> = {
      CONTROLE_1: "Premier Trimestre",
      CONTROLE_2: "Deuxième Trimestre",
      CONTROLE_3: "Troisième Trimestre",
      CONTROLE_4: "Examen Final",
    };
    return periods[controlType] || "Période non spécifiée";
  }

  /**
   * Génère un bulletin PDF
   */
  async generateBulletinPDF(
    bulletinData: BulletinData,
    options: BulletinPDFOptions
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const chunks: Buffer[] = [];
        const doc = new PDFDocument({
          size: "A4",
          margin: 50,
          info: {
            Title: "Bulletin Scolaire",
            Author: "Système de Gestion Scolaire",
            Subject: `Bulletin de ${bulletinData.student.firstName} ${bulletinData.student.lastName}`,
            Keywords: "bulletin, scolaire, notes",
            CreationDate: new Date(),
          },
        });

        // Collecter les données PDF
        doc.on("data", (chunk: Buffer<ArrayBufferLike>) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        // Générer le contenu du PDF
        this.generatePDFContent(doc, bulletinData, options);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Génère le contenu du PDF
   */
  private generatePDFContent(
    doc: PDFKit.PDFDocument,
    bulletinData: BulletinData,
    options: BulletinPDFOptions
  ) {
    // En-tête
    if (options.includeHeader) {
      this.generateHeader(doc, bulletinData, options);
    }

    // Informations de l'étudiant
    this.generateStudentInfo(doc, bulletinData);

    // Tableau des notes
    this.generateGradesTable(doc, bulletinData);

    // Statistiques
    this.generateStatistics(doc, bulletinData);

    // Remarques et signatures
    this.generateRemarks(doc, bulletinData);

    // Pied de page
    if (options.includeFooter) {
      this.generateFooter(doc, bulletinData);
    }
  }

  /**
   * Génère l'en-tête du bulletin
   */
  private generateHeader(
    doc: any,
    bulletinData: BulletinData,
    options?: BulletinPDFOptions
  ) {
    // Logo de l'école (à remplacer par le vrai logo)
    if (options?.includeSchoolLogo) {
      // doc.image('path/to/logo.png', 50, 45, { width: 50 });
    }

    // Titre
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("BULLETIN SCOLAIRE", { align: "center" });

    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text("ÉCOLE SECONDAIRE", { align: "center" })
      .text("SYSTÈME DE GESTION SCOLAIRE", { align: "center" });

    doc.moveDown(1);
  }

  /**
   * Génère les informations de l'étudiant
   */
  private generateStudentInfo(doc: any, bulletinData: BulletinData) {
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("INFORMATIONS DE L'ÉTUDIANT", { underline: true });

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Nom: ${bulletinData.student.lastName}`)
      .text(`Prénom: ${bulletinData.student.firstName}`)
      .text(`Code étudiant: ${bulletinData.student.studentCode}`)
      .text(
        `Classe: ${bulletinData.classInfo.name} (${bulletinData.classInfo.level})`
      )
      .text(`Année scolaire: ${bulletinData.academicYear.year}`)
      .text(`Période: ${bulletinData.metadata.controlPeriod}`);

    doc.moveDown(1);
  }

  /**
   * Génère le tableau des notes
   */
  private generateGradesTable(doc: any, bulletinData: BulletinData) {
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("RÉSULTATS SCOLAIRES", { underline: true });

    doc.moveDown(0.5);

    // En-têtes du tableau
    const tableTop = doc.y;
    const colWidths = [200, 80, 80, 100];

    doc.font("Helvetica-Bold").fontSize(10);

    doc.text("Matière", 50, tableTop);
    doc.text("Coefficient", 50 + colWidths[0], tableTop);
    doc.text("Note", 50 + colWidths[0] + colWidths[1], tableTop);
    doc.text(
      "Professeur",
      50 + colWidths[0] + colWidths[1] + colWidths[2],
      tableTop
    );

    // Ligne de séparation
    doc
      .moveTo(50, tableTop + 15)
      .lineTo(50 + colWidths.reduce((a, b) => a + b, 0), tableTop + 15)
      .stroke();

    // Données des notes
    let y = tableTop + 25;
    doc.font("Helvetica").fontSize(9);

    bulletinData.grades.forEach((grade, index) => {
      // Couleur pour les notes échouées
      if (grade.grade < grade.passingGrade) {
        doc.fillColor("red");
      } else {
        doc.fillColor("black");
      }

      doc.text(grade.subject, 50, y);
      doc.text(grade.coefficient.toString(), 50 + colWidths[0], y);
      doc.text(grade.grade.toFixed(2), 50 + colWidths[0] + colWidths[1], y);
      doc.text(
        grade.professeur,
        50 + colWidths[0] + colWidths[1] + colWidths[2],
        y
      );

      y += 20;

      // Réinitialiser la couleur
      doc.fillColor("black");
    });

    doc.moveDown(2);
  }

  /**
   * Génère les statistiques
   */
  private generateStatistics(doc: any, bulletinData: BulletinData) {
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("STATISTIQUES", { underline: true });

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        `Moyenne générale: ${bulletinData.statistics.weightedAverage.toFixed(2)}/20`
      )
      .text(
        `Moyenne pondérée: ${bulletinData.statistics.weightedAverage.toFixed(2)}/20`
      )
      .text(
        `Taux de réussite: ${bulletinData.statistics.successRate.toFixed(2)}%`
      )
      .text(`Total coefficients: ${bulletinData.statistics.totalCoefficient}`);

    if (
      bulletinData.statistics.minGrade !== undefined &&
      bulletinData.statistics.maxGrade !== undefined
    ) {
      doc
        .text(
          `Note minimale: ${bulletinData.statistics.minGrade.toFixed(2)}/20`
        )
        .text(
          `Note maximale: ${bulletinData.statistics.maxGrade.toFixed(2)}/20`
        );
    }

    doc.moveDown(1);
  }

  /**
   * Génère les remarques et signatures
   */
  private generateRemarks(doc: any, bulletinData: BulletinData) {
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("REMARQUES ET SIGNATURES", { underline: true });

    doc.moveDown(1);

    // Remarques du professeur principal
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Remarques du Professeur Principal:")
      .text(bulletinData.remarks.headTeacher || "Aucune remarque", {
        indent: 20,
        width: 400,
      });

    doc.moveDown(1);

    // Remarques du directeur
    doc
      .text("Remarques du Directeur:")
      .text(bulletinData.remarks.director || "Aucune remarque", {
        indent: 20,
        width: 400,
      });

    doc.moveDown(2);

    // Signatures
    const signatureY = doc.y;

    // Signature professeur principal
    doc.text("Le Professeur Principal", 100, signatureY, {
      width: 150,
      align: "center",
    });
    doc
      .moveTo(100, signatureY + 20)
      .lineTo(250, signatureY + 20)
      .stroke();

    // Signature directeur
    doc.text("Le Directeur", 300, signatureY, { width: 150, align: "center" });
    doc
      .moveTo(300, signatureY + 20)
      .lineTo(450, signatureY + 20)
      .stroke();
  }

  /**
   * Génère le pied de page
   */
  private generateFooter(doc: any, bulletinData: BulletinData) {
    const pageHeight = doc.page.height;
    const footerY = pageHeight - 50;

    doc
      .fontSize(8)
      .font("Helvetica")
      .text(
        `Document généré le: ${bulletinData.metadata.generatedAt.toLocaleDateString("fr-FR")}`,
        50,
        footerY
      )
      .text(
        `Numéro de document: ${bulletinData.metadata.documentNumber}`,
        250,
        footerY,
        { align: "center" }
      )
      .text("Page 1/1", 450, footerY, { align: "right" });
  }

  /**
   * Enregistre le bulletin dans la base de données
   */
  async saveTranscript(
    bulletinData: BulletinData,
    pdfBuffer: Buffer,
    generatedBy: string
  ) {
    try {
      const transcript = await this.prisma.transcript.create({
        data: {
          studentId: bulletinData.student.id,
          academicYearId: bulletinData.academicYear.id,
          controlType: bulletinData.grades[0]?.controlType || "CONTROLE_1",
          classLevel: bulletinData.classInfo.level as any,
          documentType: "BULLETIN",
          gpa: bulletinData.statistics.weightedAverage,
          totalCredits: bulletinData.statistics.totalCoefficient,
          creditsEarned: Math.floor(
            (bulletinData.statistics.successRate *
              bulletinData.statistics.totalCoefficient) /
              100
          ),
          successRate: bulletinData.statistics.successRate,
          fileName: `bulletin_${bulletinData.student.studentCode}_${Date.now()}.pdf`,
          pdfData: pdfBuffer,
          status: "GENERATED",
          generatedBy,
          language: "FR",
          metadata: bulletinData.metadata as any,
          notes: bulletinData.remarks.generalComment,
        },
      });

      // Enregistrer l'historique
      await this.prisma.documentHistory.create({
        data: {
          transcriptId: transcript.id,
          action: "GENERATED",
          performedBy: generatedBy,
          details: {
            student: bulletinData.student,
            statistics: bulletinData.statistics,
          } as any,
          performedAt: new Date(),
        },
      });

      return transcript;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du bulletin:", error);
      throw error;
    }
  }

  /**
   * Récupère l'historique des bulletins d'un étudiant
   */
  async getStudentTranscripts(studentId: string, academicYearId?: string) {
    const whereClause: any = {
      studentId,
      documentType: "BULLETIN",
    };

    if (academicYearId) {
      whereClause.academicYearId = academicYearId;
    }

    return this.prisma.transcript.findMany({
      where: whereClause,
      include: {
        academicYear: true,
        documentHistory: {
          orderBy: {
            performedAt: "desc",
          },
          take: 5,
        },
      },
      orderBy: {
        generatedAt: "desc",
      },
    });
  }
}
