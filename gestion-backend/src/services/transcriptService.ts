import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import prisma from "../prisma";
import {
  generateAttestationFinEtudesPDF,
  generateAttestationNiveauPDF,
  generateCertificatScolaritePDF,
  generateRelevePDF,
  generateBulletinPDF,
  generateDocumentPDF,
} from "./pdfService";
import {
  ControlType,
  DocumentLanguage,
  DocumentType,
  Prisma,
  TranscriptStatus,
} from "../../generated/prisma";

interface TranscriptFilter {
  studentId?: string;
  academicYearId?: string;
  semester?: string;
  controlType?: ControlType;
  documentType?: DocumentType;
  page?: number;
  limit?: number;
}

interface TranscriptData {
  studentId: string;
  academicYearId: string;
  controlType: ControlType;
  classLevel: string;
  documentType: DocumentType;
  grades: string[];
  statistics?: any;
  language?: DocumentLanguage;
  withSignature?: boolean;
  withStamp?: boolean;
}

interface TranscriptStatistics {
  gpa: number;
  totalCredits: number;
  creditsEarned: number;
  successRate: number;
  average: number;
  rank?: number;
  totalStudents?: number;
}

interface GradeWithCalculations {
  id: string;
  grade: number;
  coefficient: number;
  maxGrade: number;
  passingGrade: number;
  ue?: any;
  subject?: any;
  normalizedGrade?: number;
  weightedGrade?: number;
  status?: "PASSED" | "FAILED";
}

export class TranscriptService {
  // Calculer la note normalisée sur 20
  private normalizeGrade(grade: number, maxGrade: number): number {
    return (grade / maxGrade) * 20;
  }

  // Calculer la note pondérée
  private calculateWeightedGrade(
    normalizedGrade: number,
    coefficient: number
  ): number {
    return normalizedGrade * coefficient;
  }

  // Déterminer le statut de la note
  private determineGradeStatus(
    grade: number,
    passingGrade: number,
    maxGrade: number
  ): "PASSED" | "FAILED" {
    const normalizedPassing = (passingGrade / maxGrade) * 20;
    const normalizedGrade = (grade / maxGrade) * 20;
    return normalizedGrade >= normalizedPassing ? "PASSED" : "FAILED";
  }

  // Calculer les statistiques pour un étudiant
  async calculateStatistics(
    studentId: string,
    academicYearId: string,
    controlType: ControlType,
    classLevel: string
  ): Promise<TranscriptStatistics> {
    // Récupérer toutes les notes de l'étudiant pour l'année et le contrôle
    const grades = await prisma.grade.findMany({
      where: {
        studentId,
        academicYearId,
        controlType,
        classLevel: classLevel as any,
        isActive: true,
      },
      include: {
        subject: true,
        classAssignment: {
          include: {
            subject: true,
          },
        },
      },
    });

    // Récupérer tous les étudiants du même niveau pour le calcul du rang
    const allStudentsGrades = await prisma.grade.findMany({
      where: {
        academicYearId,
        controlType,
        classLevel: classLevel as any,
        isActive: true,
      },
      include: {
        subject: true,
        student: true,
      },
    });

    // Calculer les notes avec normalisation
    const gradesWithCalculations: GradeWithCalculations[] = grades.map(
      (grade) => {
        const subject = grade.subject || grade.classAssignment?.subject;
        const normalizedGrade = this.normalizeGrade(
          grade.grade,
          subject.maxGrade
        );
        const weightedGrade = this.calculateWeightedGrade(
          normalizedGrade,
          subject.coefficient
        );
        const status = this.determineGradeStatus(
          grade.grade,
          subject.passingGrade,
          subject.maxGrade
        );

        return {
          id: grade.id,
          grade: grade.grade,
          coefficient: subject.coefficient,
          maxGrade: subject.maxGrade,
          passingGrade: subject.passingGrade,
          ue: grade.classAssignment?.subject,
          subject: subject,
          normalizedGrade,
          weightedGrade,
          status,
        };
      }
    );

    // Calculer la moyenne générale
    const totalCoefficients = gradesWithCalculations.reduce(
      (sum, grade) => sum + grade.coefficient,
      0
    );
    const totalWeightedGrades = gradesWithCalculations.reduce(
      (sum, grade) => sum + (grade.weightedGrade || 0),
      0
    );
    const average =
      totalCoefficients > 0 ? totalWeightedGrades / totalCoefficients : 0;

    // Calculer les crédits
    const totalCredits = gradesWithCalculations.length * 3; // Exemple: 3 crédits par UE
    const creditsEarned =
      gradesWithCalculations.filter((g) => g.status === "PASSED").length * 3;

    // Calculer le taux de réussite
    const successRate =
      gradesWithCalculations.length > 0
        ? (gradesWithCalculations.filter((g) => g.status === "PASSED").length /
            gradesWithCalculations.length) *
          100
        : 0;

    // Calculer le rang de l'étudiant
    let rank = 1;
    let totalStudents = 0;

    // Grouper les notes par étudiant
    const studentAverages = new Map<string, number>();
    const studentGroups = allStudentsGrades.reduce((acc, grade) => {
      if (!acc.has(grade.studentId)) {
        acc.set(grade.studentId, []);
      }
      acc.get(grade.studentId)!.push(grade);
      return acc;
    }, new Map<string, typeof allStudentsGrades>());

    // Calculer la moyenne pour chaque étudiant
    for (const [studentId, studentGrades] of studentGroups) {
      const studentGradesWithCalc = studentGrades.map((grade) => {
        const subject =
          grade.subject || (grade as any).classAssignment?.subject;
        const normalizedGrade = this.normalizeGrade(
          grade.grade,
          subject.maxGrade
        );
        const weightedGrade = this.calculateWeightedGrade(
          normalizedGrade,
          subject.coefficient
        );
        return { normalizedGrade, coefficient: subject.coefficient };
      });

      const totalCoeff = studentGradesWithCalc.reduce(
        (sum, g) => sum + g.coefficient,
        0
      );
      const totalWeighted = studentGradesWithCalc.reduce(
        (sum, g) => sum + g.normalizedGrade * g.coefficient,
        0
      );
      const studentAverage = totalCoeff > 0 ? totalWeighted / totalCoeff : 0;

      studentAverages.set(studentId, studentAverage);
      totalStudents++;

      // Compter combien d'étudiants ont une meilleure moyenne
      if (studentId !== studentId && studentAverage > average) {
        rank++;
      }
    }

    return {
      gpa: average, // GPA sur 20
      totalCredits,
      creditsEarned,
      successRate,
      average,
      rank,
      totalStudents,
    };
  }

  // Générer un nom de fichier
  generateFileName(
    type: DocumentType,
    student: any,
    academicYear: any,
    controlType: ControlType
  ): string {
    const typeMap = {
      BULLETIN: "bulletin",
      RELEVE: "releve",
      ATTESTATION_NIVEAU: "attestation-niveau",
      ATTESTATION_FIN_ETUDES: "attestation-fin-etudes",
      CERTIFICAT_SCOLARITE: "certificat-scolarite",
    };

    const baseName = `${typeMap[type]}-${student.lastName}-${student.firstName}-${academicYear.year}`;
    return `${baseName}-${controlType.toLowerCase()}.pdf`;
  }

  // Récupérer tous les transcripts avec pagination
  async getAllTranscripts(filter: TranscriptFilter) {
    const {
      studentId,
      academicYearId,
      controlType,
      documentType,
      page = 1,
      limit = 10,
    } = filter;

    const where: Prisma.TranscriptWhereInput = {};

    if (studentId) where.studentId = studentId;
    if (academicYearId) where.academicYearId = academicYearId;
    if (controlType) where.controlType = controlType;
    if (documentType) where.documentType = documentType;

    const skip = (page - 1) * limit;

    const [transcripts, total] = await Promise.all([
      prisma.transcript.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentCode: true,
              email: true,
            },
          },
          academicYear: true,
          transcriptGrades: {
            include: {
              grade: {
                include: {
                  subject: true,
                  classAssignment: {
                    include: {
                      subject: true,
                    },
                  },
                },
              },
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { generatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.transcript.count({ where }),
    ]);

    return {
      transcripts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Récupérer un transcript par ID
  async getTranscriptById(id: string) {
    const transcript = await prisma.transcript.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentCode: true,
            email: true,
            phone: true,
            dateOfBirth: true,
            placeOfBirth: true,
            address: true,
            cin: true,
            sexe: true,
          },
        },
        academicYear: true,
        transcriptGrades: {
          include: {
            grade: {
              include: {
                subject: true,
                classAssignment: {
                  include: {
                    subject: true,
                  },
                },
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!transcript) {
      throw new Error("Transcript not found");
    }

    return transcript;
  }

  // Créer un nouveau transcript
  async createTranscript(data: TranscriptData) {
    const {
      studentId,
      academicYearId,
      controlType,
      classLevel,
      documentType,
      grades,
      statistics,
      language = DocumentLanguage.FR,
      withSignature = true,
      withStamp = true,
    } = data;

    // Validation
    if (!studentId || !academicYearId || !controlType || !classLevel) {
      throw new Error(
        "Missing required fields: studentId, academicYearId, controlType, classLevel"
      );
    }

    // Vérifier l'étudiant
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { enrollments: true },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // Vérifier l'année académique
    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });

    if (!academicYear) {
      throw new Error("Academic year not found");
    }

    // Récupérer les notes
    const gradeRecords = await prisma.grade.findMany({
      where: {
        id: { in: grades },
        studentId,
        academicYearId,
        controlType,
        classLevel: classLevel as any,
      },
      include: {
        subject: true,
        classAssignment: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (gradeRecords.length === 0) {
      throw new Error("No valid grades found for the selected criteria");
    }

    // Calculer les statistiques si non fournies
    let calculatedStats = statistics;
    if (!calculatedStats) {
      calculatedStats = await this.calculateStatistics(
        studentId,
        academicYearId,
        controlType,
        classLevel
      );
    }

    // Générer le PDF
    const pdfBuffer = await generateDocumentPDF({
      documentType,
      student,
      academicYear,
      controlType,
      classLevel,
      grades: gradeRecords,
      statistics: calculatedStats,
      language,
      withSignature,
      withStamp,
    });

    // Générer le nom de fichier
    const fileName = this.generateFileName(
      documentType,
      student,
      academicYear,
      controlType
    );

    // Créer le transcript dans la base de données
    const newTranscript = await prisma.transcript.create({
      data: {
        studentId,
        academicYearId,
        controlType,
        classLevel: classLevel as any,
        documentType,
        gpa: calculatedStats.gpa || 0,
        totalCredits: calculatedStats.totalCredits || 0,
        creditsEarned: calculatedStats.creditsEarned || 0,
        successRate: calculatedStats.successRate || 0,
        fileName,
        pdfData: pdfBuffer,
        status: TranscriptStatus.GENERATED,
        language,
        metadata: {
          withSignature,
          withStamp,
          includeAllGrades: data.statistics?.includeAllGrades || false,
          generatedAt: new Date().toISOString(),
          calculatedStats,
        },
        transcriptGrades: {
          create: gradeRecords.map((grade, index) => ({
            gradeId: grade.id,
            order: index,
          })),
        },
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentCode: true,
            email: true,
          },
        },
        academicYear: true,
        transcriptGrades: {
          include: {
            grade: {
              include: {
                subject: true,
                classAssignment: {
                  include: {
                    subject: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Créer un historique
    await prisma.documentHistory.create({
      data: {
        transcriptId: newTranscript.id,
        action: "GENERATED",
        performedBy: data.statistics?.generatedBy,
        details: {
          documentType,
          controlType,
          studentId,
          academicYearId,
        },
      },
    });

    const { pdfData, ...responseData } = newTranscript;
    return responseData;
  }

  // Mettre à jour un transcript
  async updateTranscript(id: string, data: Partial<TranscriptData>) {
    // Créer l'objet de mise à jour avec les types corrects
    const updateData: Prisma.TranscriptUpdateInput = {
      updatedAt: new Date(),
    };

    // Mapper les champs avec les types corrects
    if (data.controlType) updateData.controlType = data.controlType;
    if (data.classLevel) updateData.classLevel = data.classLevel as any;
    if (data.documentType) updateData.documentType = data.documentType;
    if (data.language) updateData.language = data.language;

    // Pour les statistiques numériques
    if (data.statistics) {
      if (data.statistics.gpa !== undefined)
        updateData.gpa = data.statistics.gpa;
      if (data.statistics.totalCredits !== undefined)
        updateData.totalCredits = data.statistics.totalCredits;
      if (data.statistics.creditsEarned !== undefined)
        updateData.creditsEarned = data.statistics.creditsEarned;
      if (data.statistics.successRate !== undefined)
        updateData.successRate = data.statistics.successRate;
    }

    // Pour metadata
    if (data.withSignature !== undefined || data.withStamp !== undefined) {
      updateData.metadata = {
        ...((updateData.metadata as any) || {}),
        withSignature: data.withSignature,
        withStamp: data.withStamp,
        updatedAt: new Date().toISOString(),
      };
    }

    // Pour les notes
    if (data.grades && data.grades.length > 0) {
      // Supprimer les anciennes transcriptGrades
      await prisma.transcriptGrade.deleteMany({
        where: { transcriptId: id },
      });

      // Ajouter la relation avec les nouvelles notes
      updateData.transcriptGrades = {
        create: data.grades.map((gradeId, index) => ({
          gradeId,
          order: index,
        })),
      };
    }

    const updatedTranscript = await prisma.transcript.update({
      where: { id },
      data: updateData,
      include: {
        student: true,
        academicYear: true,
        transcriptGrades: {
          include: {
            grade: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
    });

    // Historique
    await prisma.documentHistory.create({
      data: {
        transcriptId: id,
        action: "MODIFIED",
        details: {
          updatedFields: Object.keys(data),
          updatedAt: new Date().toISOString(),
        },
      },
    });

    return updatedTranscript;
  }

  // Supprimer un transcript
  async deleteTranscript(id: string) {
    const transcript = await prisma.transcript.findUnique({
      where: { id },
    });

    if (!transcript) {
      throw new Error("Transcript not found");
    }

    // Supprimer les transcriptGrades associées
    await prisma.transcriptGrade.deleteMany({
      where: { transcriptId: id },
    });

    // Supprimer le transcript
    await prisma.transcript.delete({
      where: { id },
    });

    // Historique
    await prisma.documentHistory.create({
      data: {
        transcriptId: id,
        action: "DELETED",
        details: {
          deletedAt: new Date().toISOString(),
          fileName: transcript.fileName,
        },
      },
    });

    return transcript;
  }

  // Télécharger un transcript
  async downloadTranscript(id: string) {
    const transcript = await prisma.transcript.findUnique({
      where: { id },
      include: {
        student: true,
        academicYear: true,
        transcriptGrades: {
          include: {
            grade: {
              include: {
                subject: true,
                classAssignment: {
                  include: {
                    subject: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!transcript) {
      throw new Error("Transcript not found");
    }

    // Regénérer le PDF si nécessaire
    let pdfBuffer = transcript.pdfData;
    if (!pdfBuffer) {
      const grades = await prisma.grade.findMany({
        where: {
          id: {
            in: transcript.transcriptGrades.map((tg: any) => tg.gradeId),
          },
        },
        include: {
          subject: true,
          classAssignment: {
            include: {
              subject: true,
            },
          },
        },
      });

      const stats = await this.calculateStatistics(
        transcript.studentId,
        transcript.academicYearId,
        transcript.controlType,
        transcript.classLevel
      );

      pdfBuffer = await generateDocumentPDF({
        documentType: transcript.documentType,
        student: transcript.student,
        academicYear: transcript.academicYear,
        controlType: transcript.controlType,
        classLevel: transcript.classLevel,
        grades,
        statistics: stats,
        language: transcript.language,
        withSignature: false,
        withStamp: false,
      });

      // Mettre à jour le transcript
      await prisma.transcript.update({
        where: { id },
        data: { pdfData: pdfBuffer },
      });
    }

    // Historique de téléchargement
    await prisma.documentHistory.create({
      data: {
        transcriptId: id,
        action: "DOWNLOADED",
        details: {
          downloadedAt: new Date().toISOString(),
        },
      },
    });

    return {
      transcript,
      pdfBuffer,
      fileName: transcript.fileName,
    };
  }
}

export const transcriptService = new TranscriptService();
