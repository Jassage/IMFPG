/**
 * Service pour la génération et la gestion des bulletins scolaires
 */

import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

import { PrismaClient } from "../../generated/prisma";
import prisma from "../prisma";
import {
  BulletinData,
  BulletinPDFOptions,
  BulletinRequest,
  ControlType,
  DocumentType,
} from "../types/bulletin";

const YEAR_WIDE_CONTROL_TYPES: ControlType[] = [
  ControlType.CONTROLE_1,
  ControlType.CONTROLE_2,
  ControlType.CONTROLE_3,
  ControlType.CONTROLE_4,
];

export class BulletinService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // ═══════════════════════════════════════════════════════════════
  // RÉCUPÉRATION DES DONNÉES
  // ═══════════════════════════════════════════════════════════════

  async getBulletinData(request: BulletinRequest): Promise<BulletinData> {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id: request.studentId },
        include: { schoolClass: true, user: true },
      });
      if (!student) throw new Error("Étudiant non trouvé");

      const academicYear = await this.prisma.academicYear.findUnique({
        where: { id: request.academicYearId },
      });
      if (!academicYear) throw new Error("Année académique non trouvée");

      const enrollment = await this.prisma.enrollment.findFirst({
        where: {
          studentId: request.studentId,
          academicYearId: request.academicYearId,
          status: "Active",
        },
        include: { schoolClass: true },
      });
      if (!enrollment) throw new Error("Inscription active non trouvée");

      const schoolInfo = await this.getSchoolInfo();

      const base = {
        documentType: request.documentType,
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
          professeurPrincipal: "À déterminer",
        },
        academicYear: {
          id: academicYear.id,
          year: academicYear.year,
          startDate: academicYear.startDate,
          endDate: academicYear.endDate,
        },
        schoolInfo,
        remarks: { headTeacher: "", director: "", generalComment: "" },
      };

      if (request.documentType === DocumentType.CERTIFICAT_SCOLARITE) {
        return {
          ...base,
          enrollmentStatus: String(enrollment.status),
          grades: [],
          statistics: this.calculateStatistics([]),
          metadata: {
            generatedAt: new Date(),
            generatedBy: "Système",
            documentNumber: this.generateDocumentNumber(request.documentType),
            controlPeriod: "Année Scolaire Complète",
          },
        };
      }

      if (request.documentType === DocumentType.RELEVE) {
        const { multiControlGrades, yearlyTotals, decision, overallAverage, successRate } =
          await this.getAllYearGrades(request.studentId, request.academicYearId);

        return {
          ...base,
          multiControlGrades,
          yearlyTotals,
          decision,
          grades: [],
          statistics: {
            average: overallAverage,
            weightedAverage: overallAverage,
            totalCoefficient: yearlyTotals.totalCoefficient,
            successRate,
          },
          metadata: {
            generatedAt: new Date(),
            generatedBy: "Système",
            documentNumber: this.generateDocumentNumber(request.documentType),
            controlPeriod: "Année Scolaire Complète",
          },
        };
      }

      // BULLETIN annuel : tous les contrôles agrégés (même logique que RELEVE, mise en page bulletin)
      if (!request.controlType) {
        const { multiControlGrades, yearlyTotals, decision, overallAverage, successRate } =
          await this.getAllYearGrades(request.studentId, request.academicYearId);

        return {
          ...base,
          multiControlGrades,
          yearlyTotals,
          decision,
          grades: [],
          statistics: {
            average: overallAverage,
            weightedAverage: overallAverage,
            totalCoefficient: yearlyTotals.totalCoefficient,
            successRate,
          },
          metadata: {
            generatedAt: new Date(),
            generatedBy: "Système",
            documentNumber: this.generateDocumentNumber(request.documentType),
            controlPeriod: "Année Scolaire Complète",
          },
        };
      }

      const grades = await this.prisma.grade.findMany({
        where: {
          studentId: request.studentId,
          academicYearId: request.academicYearId,
          controlType: request.controlType,
          isActive: true,
        },
        include: {
          subject: true,
          classAssignment: { include: { professeur: true } },
        },
      });

      return {
        ...base,
        controlType: request.controlType,
        grades: grades.map((g) => ({
          subject: g.subject.name,
          coefficient: g.subject.coefficient,
          grade: g.grade,
          status: String(g.status),
          controlType: g.controlType as any,
          passingGrade: (g.subject.passingGrade / 100) * (g.subject.maxGrade || 20),
          professeur: g.classAssignment.professeur
            ? `${g.classAssignment.professeur.firstName} ${g.classAssignment.professeur.lastName}`
            : "À pourvoir",
          comments: g.notes ?? undefined,
        })),
        statistics: this.calculateStatistics(grades),
        metadata: {
          generatedAt: new Date(),
          generatedBy: "Système",
          documentNumber: this.generateDocumentNumber(request.documentType),
          controlPeriod: this.getControlPeriodDescription(request.controlType),
        },
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des données du bulletin:", error);
      throw error;
    }
  }

  private async getSchoolInfo(): Promise<BulletinData["schoolInfo"]> {
    const s = await this.prisma.systemSettings.findFirst();
    return {
      name:    s?.schoolName   || "Institution Mixte Faustin 1er",
      slogan:  s?.schoolSlogan ?? undefined,
      address: s?.address      ?? undefined,
      city:    s?.city         ?? undefined,
      country: s?.country      ?? undefined,
      phone:   s?.phone        ?? undefined,
      email:   s?.email        ?? undefined,
      logo:    s?.schoolLogo   ?? undefined,
    };
  }

  private async getAllYearGrades(studentId: string, academicYearId: string) {
    const grades = await this.prisma.grade.findMany({
      where: { studentId, academicYearId, isActive: true },
      include: { subject: true },
    });

    const map = new Map<
      string,
      {
        subjectName: string;
        coefficient: number;
        maxGrade: number;
        passingGrade: number;
        controlGrades: Partial<Record<ControlType, { grade: number; gradeOn20: number }>>;
      }
    >();

    grades.forEach((g) => {
      const max = g.subject.maxGrade || 20;
      if (!map.has(g.subjectId)) {
        map.set(g.subjectId, {
          subjectName:  g.subject.name,
          coefficient:  g.subject.coefficient,
          maxGrade:     max,
          passingGrade: (g.subject.passingGrade / 100) * max,
          controlGrades: {},
        });
      }
      const sub = map.get(g.subjectId)!;
      sub.controlGrades[g.controlType as ControlType] = {
        grade:      g.grade,
        gradeOn20:  Math.round((g.grade * 20) / max),
      };
    });

    const multiControlGrades = Array.from(map.values());
    const totalsByControl: Partial<Record<ControlType, number>> = {};
    const countsByControl: Partial<Record<ControlType, number>> = {};
    YEAR_WIDE_CONTROL_TYPES.forEach((ct) => { totalsByControl[ct] = 0; countsByControl[ct] = 0; });

    let totalCoefficient = 0;
    let weightedSum      = 0;
    let passedSubjects   = 0;

    multiControlGrades.forEach((sub) => {
      totalCoefficient += sub.coefficient;
      const available = YEAR_WIDE_CONTROL_TYPES.filter((ct) => sub.controlGrades[ct] !== undefined);
      const avg = available.length > 0
        ? available.reduce((s, ct) => s + (sub.controlGrades[ct]?.gradeOn20 || 0), 0) / available.length
        : 0;
      weightedSum += avg * sub.coefficient;
      if (avg >= Math.round((sub.passingGrade * 20) / sub.maxGrade)) passedSubjects++;
      YEAR_WIDE_CONTROL_TYPES.forEach((ct) => {
        const cg = sub.controlGrades[ct];
        if (cg) {
          totalsByControl[ct] = (totalsByControl[ct] || 0) + cg.gradeOn20;
          countsByControl[ct] = (countsByControl[ct] || 0) + 1;
        }
      });
    });

    const averagesByControl: Partial<Record<ControlType, number>> = {};
    YEAR_WIDE_CONTROL_TYPES.forEach((ct) => {
      const c = countsByControl[ct] || 0;
      averagesByControl[ct] = c > 0 ? Math.round((totalsByControl[ct] || 0) / c) : 0;
    });

    const overallAverage = totalCoefficient > 0 ? weightedSum / totalCoefficient : 0;
    const successRate    = multiControlGrades.length > 0
      ? (passedSubjects / multiControlGrades.length) * 100 : 0;

    return {
      multiControlGrades,
      yearlyTotals: { totalCoefficient, totalsByControl, averagesByControl },
      decision:     this.getOverallDecision(overallAverage),
      overallAverage: parseFloat(overallAverage.toFixed(2)),
      successRate:    parseFloat(successRate.toFixed(2)),
    };
  }

  /**
   * Détermine la décision globale.
   * NOTE: seuils synchronisés avec getOverallDecision dans BulletinGenerator.tsx
   */
  private getOverallDecision(average: number): { label: string; description: string } {
    if (average >= 10) return { label: "ADMIS",            description: "L'élève est admis en classe supérieure" };
    if (average >= 8)  return { label: "À REFAIRE",        description: "L'élève doit refaire l'année dans la même école" };
    return                    { label: "À REFAIRE AILLEURS", description: "L'élève est exclu et doit refaire ailleurs" };
  }

  private calculateStatistics(grades: any[]) {
    if (grades.length === 0) return { average: 0, weightedAverage: 0, totalCoefficient: 0, successRate: 0 };

    let totalW = 0, totalCoef = 0, passed = 0;
    grades.forEach((g) => {
      totalW    += g.grade * g.subject.coefficient;
      totalCoef += g.subject.coefficient;
      if (g.grade >= (g.subject.passingGrade / 100) * (g.subject.maxGrade || 20)) passed++;
    });

    return {
      average:         parseFloat((grades.reduce((s, g) => s + g.grade, 0) / grades.length).toFixed(2)),
      weightedAverage: parseFloat((totalCoef > 0 ? totalW / totalCoef : 0).toFixed(2)),
      totalCoefficient: totalCoef,
      successRate:     parseFloat(((passed / grades.length) * 100).toFixed(2)),
      minGrade:        parseFloat(Math.min(...grades.map((g) => g.grade)).toFixed(2)),
      maxGrade:        parseFloat(Math.max(...grades.map((g) => g.grade)).toFixed(2)),
    };
  }

  async getTranscriptById(transcriptId: string) {
    return this.prisma.transcript.findUnique({ where: { id: transcriptId } });
  }

  async recordDocumentAction(
    transcriptId: string, action: string, userId: string,
    ipAddress?: string, userAgent?: string
  ) {
    await this.prisma.documentHistory.create({
      data: { transcriptId, action: action as any, performedBy: userId, ipAddress, userAgent, performedAt: new Date() },
    });
  }

  async previewBulletin(request: BulletinRequest): Promise<Buffer> {
    const data = await this.getBulletinData(request);
    return this.generateBulletinPDF(data, {
      includeHeader: true, includeFooter: true, includeSchoolLogo: true,
      language: request.language || "FR",
    });
  }

  private generateDocumentNumber(documentType: DocumentType): string {
    const p: Record<DocumentType, string> = {
      [DocumentType.BULLETIN]:               "BUL",
      [DocumentType.RELEVE]:                 "REL",
      [DocumentType.ATTESTATION_NIVEAU]:     "ATN",
      [DocumentType.ATTESTATION_FIN_ETUDES]: "AFE",
      [DocumentType.CERTIFICAT_SCOLARITE]:   "CTS",
    };
    return `${p[documentType]}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private getControlPeriodDescription(controlType: string): string {
    const m: Record<string, string> = {
      CONTROLE_1: "1er Trimestre",
      CONTROLE_2: "2ème Trimestre",
      CONTROLE_3: "3ème Trimestre",
      CONTROLE_4: "Examen Final",
    };
    return m[controlType] || "Période non spécifiée";
  }

  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION PDF  ·  DESIGN PROFESSIONNEL  ·  UNE PAGE
  // ═══════════════════════════════════════════════════════════════

  // ── Palette ──────────────────────────────────────────────────
  private readonly C = {
    primary:  "#1a3c6e",
    light:    "#2563aa",
    pale:     "#dce9f8",
    gold:     "#c9961a",
    white:    "#ffffff",
    ink:      "#1a1a2e",
    gray:     "#5a5a72",
    lgray:    "#f4f6fa",
    border:   "#b8c9e0",
    altRow:   "#ecf3fd",
    success:  "#14532d",
    warning:  "#78350f",
    danger:   "#7f1d1d",
    sbg:      "#dcfce7",
    wbg:      "#fef3c7",
    dbg:      "#fee2e2",
  };

  // ── Géométrie A4 ─────────────────────────────────────────────
  private readonly PW  = 595.28;   // largeur page
  private readonly PH  = 841.89;   // hauteur page
  private readonly ML  = 38;       // marge gauche/droite
  private readonly UW  = 519.28;   // largeur utile (PW - 2*ML)

  // ── En-tête (dimensions fixes) ────────────────────────────────
  private readonly BANNER_H = 80;
  private readonly GOLD_H   = 3;
  private readonly TITLE_H  = 22;
  private readonly SUB_H    = 15;
  // Contenu commence à : BANNER_H + GOLD_H + TITLE_H + SUB_H + 10 = 130
  private get CONTENT_START() { return this.BANNER_H + this.GOLD_H + this.TITLE_H + this.SUB_H + 10; }

  // ── Pied de page ─────────────────────────────────────────────
  private readonly FOOTER_H = 32;
  private get FOOTER_Y() { return this.PH - this.FOOTER_H; }

  // ── Zone de contenu disponible ────────────────────────────────
  private get AVAILABLE_H() { return this.FOOTER_Y - this.CONTENT_START; }

  // ─────────────────────────────────────────────────────────────

  async generateBulletinPDF(data: BulletinData, options: BulletinPDFOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const chunks: Buffer[] = [];
        const doc = new PDFDocument({
          size: "A4",
          margins: { top: this.ML, left: this.ML, right: this.ML, bottom: 0 },
          autoFirstPage: true,
          info: {
            Title:        data.documentType,
            Author:       data.schoolInfo.name,
            Subject:      `${data.documentType} - ${data.student.firstName} ${data.student.lastName}`,
            Keywords:     "bulletin, scolaire, notes",
            CreationDate: new Date(),
          },
        });

        doc.on("data",  (chunk: Buffer) => chunks.push(chunk));
        doc.on("end",   () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        this.buildPDF(doc, data);

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  private buildPDF(doc: any, data: BulletinData) {
    // 1. Filigrane (premier = derrière tout)
    this.drawWatermark(doc, data.schoolInfo);

    // 2. En-tête fixe
    this.drawHeader(doc, data);

    // 3. Corps compact selon le type de document
    let y = this.CONTENT_START;

    y = this.drawStudentBox(doc, data, y);

    switch (data.documentType) {
      case DocumentType.RELEVE:
        y = this.drawReleveTable(doc, data, y);
        this.drawDecisionAndSig(doc, data, y);
        break;
      case DocumentType.CERTIFICAT_SCOLARITE:
        this.drawCertificatBody(doc, data, y);
        break;
      case DocumentType.BULLETIN:
      default:
        if (data.multiControlGrades && data.multiControlGrades.length > 0) {
          // Bulletin annuel : tous les contrôles en colonnes + décision
          y = this.drawReleveTable(doc, data, y);
          this.drawDecisionAndSig(doc, data, y);
        } else {
          // Bulletin trimestriel : notes d'une période + stats + signatures
          y = this.drawBulletinTable(doc, data, y);
          y = this.drawStatsPanel(doc, data, y);
          this.drawSignatures(doc, data, y);
        }
        break;
    }

    // 4. Pied de page fixe (par-dessus tout contenu éventuel qui dépasserait)
    this.drawFooter(doc, data);
  }

  // ────────────────────────────────────────────────────────────
  // FILIGRANE
  // ────────────────────────────────────────────────────────────

  private drawWatermark(doc: any, schoolInfo: any) {
    const cx = this.PW / 2;
    const cy = this.PH / 2;

    const raw = schoolInfo.logo as string | undefined;
    let logoDrawn = false;

    if (raw && raw.trim() !== "") {
      const isHttpUrl = raw.startsWith("http://") || raw.startsWith("https://");
      if (!isHttpUrl) {
        const relative = raw.startsWith("/") ? raw.slice(1) : raw;
        const abs = path.join(process.cwd(), relative);
        if (fs.existsSync(abs)) {
          try {
            const size = 300;
            doc.save();
            doc.opacity(0.06);
            doc.image(abs, cx - size / 2, cy - size / 2, { width: size, height: size });
            doc.restore();
            logoDrawn = true;
          } catch (_) { /* fallback texte */ }
        }
      }
    }

    if (!logoDrawn) {
      const text = (schoolInfo.name || "DOCUMENT OFFICIEL").toUpperCase();
      doc.save();
      doc.rotate(-45, { origin: [cx, cy] });
      doc
        .fillColor(this.C.primary)
        .fillOpacity(0.04)
        .font("Helvetica-Bold")
        .fontSize(58)
        .text(text, 0, cy - 30, { width: this.PW, align: "center" });
      doc.fillOpacity(1).restore();
    }
  }

  // ────────────────────────────────────────────────────────────
  // EN-TÊTE
  // ────────────────────────────────────────────────────────────

  private drawHeader(doc: any, data: BulletinData) {
    const { schoolInfo, documentType, metadata, academicYear } = data;
    const C = this.C;

    // Bannière bleue pleine largeur
    doc.rect(0, 0, this.PW, this.BANNER_H).fill(C.primary);

    // Logos (gauche et droite)
    const LOGO_SZ = 50;
    const LOGO_Y  = (this.BANNER_H - LOGO_SZ) / 2;
    this.drawLogo(doc, this.ML, LOGO_Y, LOGO_SZ, schoolInfo);
    this.drawLogo(doc, this.PW - this.ML - LOGO_SZ, LOGO_Y, LOGO_SZ, schoolInfo);

    // Texte de l'école (centré)
    const txtX = this.ML + LOGO_SZ + 6;
    const txtW = this.PW - 2 * (this.ML + LOGO_SZ + 6);

    doc
      .fillColor(C.white)
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(schoolInfo.name || "Institution", txtX, 10, { width: txtW, align: "center" });

    let iy = 27;
    if (schoolInfo.slogan) {
      doc
        .fillColor("#aac8e8")
        .font("Helvetica-Oblique")
        .fontSize(8)
        .text(schoolInfo.slogan, txtX, iy, { width: txtW, align: "center" });
      iy += 12;
    }

    const loc = [schoolInfo.address, schoolInfo.city, schoolInfo.country].filter(Boolean).join(", ");
    if (loc) {
      doc.fillColor("#9ab8d8").font("Helvetica").fontSize(7.5)
        .text(loc, txtX, iy, { width: txtW, align: "center" });
      iy += 11;
    }

    const contact = [
      schoolInfo.phone ? `Tél : ${schoolInfo.phone}` : null,
      schoolInfo.email,
    ].filter(Boolean).join("   ·   ");
    if (contact) {
      doc.fillColor("#9ab8d8").font("Helvetica").fontSize(7.5)
        .text(contact, txtX, iy, { width: txtW, align: "center" });
    }

    // Trait doré
    doc.rect(0, this.BANNER_H, this.PW, this.GOLD_H).fill(C.gold);

    // Barre titre du document
    const TITLE_Y = this.BANNER_H + this.GOLD_H;
    doc.rect(0, TITLE_Y, this.PW, this.TITLE_H).fill(C.light);

    const docTitles: Record<string, string> = {
      BULLETIN:               "BULLETIN SCOLAIRE",
      RELEVE:                 "RELEVÉ DE NOTES ANNUEL",
      CERTIFICAT_SCOLARITE:   "CERTIFICAT DE SCOLARITÉ",
      ATTESTATION_NIVEAU:     "ATTESTATION DE NIVEAU",
      ATTESTATION_FIN_ETUDES: "ATTESTATION DE FIN D'ÉTUDES",
    };
    doc
      .fillColor(C.white)
      .font("Helvetica-Bold")
      .fontSize(11.5)
      .text(docTitles[documentType] || documentType, 0, TITLE_Y + 6, {
        width: this.PW,
        align: "center",
      });

    // Sous-barre période + année
    const SUB_Y = TITLE_Y + this.TITLE_H;
    doc.rect(0, SUB_Y, this.PW, this.SUB_H).fill(C.pale);
    const period = metadata.controlPeriod || "";
    doc
      .fillColor(C.primary)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(
        period ? `${period}   ·   Année scolaire : ${academicYear.year}` : `Année scolaire : ${academicYear.year}`,
        0, SUB_Y + 4,
        { width: this.PW, align: "center" }
      );
  }

  // ── Logo : image si dispo, sinon badge circulaire ─────────
  private drawLogo(doc: any, x: number, y: number, size: number, schoolInfo: any) {
    const raw = schoolInfo.logo as string | undefined;

    if (raw && raw.trim() !== "") {
      const isHttpUrl = raw.startsWith("http://") || raw.startsWith("https://");
      if (!isHttpUrl) {
        // Le logo est stocké comme chemin URL : "/uploads/profiles/filename.jpg"
        // On retire le "/" de tête pour obtenir un chemin relatif, puis on joint au cwd
        const relative = raw.startsWith("/") ? raw.slice(1) : raw;
        const abs = path.join(process.cwd(), relative);
        if (fs.existsSync(abs)) {
          try {
            doc.image(abs, x, y, { width: size, height: size, cover: [size, size] });
            return;
          } catch (_) { /* fallback badge */ }
        }
      }
    }

    // Badge circulaire de secours
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r  = size / 2 - 1;

    doc.circle(cx, cy, r + 2).fill(this.C.gold);
    doc.circle(cx, cy, r).fill(this.C.white);
    doc.circle(cx, cy, r - 4).fill(this.C.primary);

    const name    = schoolInfo.name || "IMFP";
    const words   = name.split(" ").filter((w: string) => w.length > 2);
    const initials = words.map((w: string) => w[0]).join("").substring(0, 3).toUpperCase();

    doc
      .fillColor(this.C.white)
      .font("Helvetica-Bold")
      .fontSize(size * 0.26)
      .text(initials, x, cy - size * 0.14, { width: size, align: "center" });
  }

  // ────────────────────────────────────────────────────────────
  // BLOC INFORMATIONS ÉLÈVE
  // ────────────────────────────────────────────────────────────

  private drawStudentBox(doc: any, data: BulletinData, startY: number): number {
    const { student, classInfo, academicYear, metadata } = data;
    const C    = this.C;
    const ML   = this.ML;
    const UW   = this.UW;
    const BH   = 62;   // hauteur boîte
    const HH   = 18;   // hauteur en-tête interne
    const CW   = UW / 2;
    const LBW  = 88;   // largeur label

    doc.rect(ML, startY, UW, BH).fillAndStroke(C.lgray, C.border);
    doc.rect(ML, startY, UW, HH).fill(C.primary);
    doc
      .fillColor(C.white).font("Helvetica-Bold").fontSize(8)
      .text("INFORMATIONS DE L'ÉLÈVE", ML, startY + 5, { width: UW, align: "center" });

    const rowsL = [
      ["Nom",         student.lastName],
      ["Prénom",      student.firstName],
      ["Code élève",  student.studentCode],
    ];
    const rowsR = [
      ["Classe",        `${classInfo.name} (${classInfo.level})`],
      ["Année scolaire", academicYear.year],
      ["Période",       metadata.controlPeriod],
    ];

    const LH = 14;
    let ry = startY + HH + 5;

    rowsL.forEach(([lbl, val]) => {
      doc.fillColor(C.gray).font("Helvetica").fontSize(7)
        .text(`${lbl} :`, ML + 6, ry);
      doc.fillColor(C.ink).font("Helvetica-Bold").fontSize(7)
        .text(val || "—", ML + LBW, ry);
      ry += LH;
    });

    ry = startY + HH + 5;
    rowsR.forEach(([lbl, val]) => {
      doc.fillColor(C.gray).font("Helvetica").fontSize(7)
        .text(`${lbl} :`, ML + CW + 6, ry);
      doc.fillColor(C.ink).font("Helvetica-Bold").fontSize(7)
        .text(val || "—", ML + CW + LBW, ry, { width: CW - LBW - 6 });
      ry += LH;
    });

    // Séparateur central
    doc.moveTo(ML + CW, startY + HH + 3).lineTo(ML + CW, startY + BH - 3)
      .lineWidth(0.4).stroke(C.border);

    return startY + BH + 8;
  }

  // ────────────────────────────────────────────────────────────
  // TITRE DE SECTION
  // ────────────────────────────────────────────────────────────

  private drawSectionTitle(doc: any, title: string, y: number): number {
    const ML = this.ML;
    doc.rect(ML, y + 1, 4, 10).fill(this.C.gold);
    doc
      .fillColor(this.C.primary)
      .font("Helvetica-Bold")
      .fontSize(9.5)
      .text(title, ML + 10, y, { lineBreak: false });
    doc
      .moveTo(ML, y + 12)
      .lineTo(ML + this.UW, y + 12)
      .lineWidth(1)
      .stroke(this.C.primary);
    return y + 15;
  }

  // ────────────────────────────────────────────────────────────
  // TABLEAU BULLETIN
  // ────────────────────────────────────────────────────────────

  private drawBulletinTable(doc: any, data: BulletinData, startY: number): number {
    const C  = this.C;
    const ML = this.ML;
    const UW = this.UW;

    let y = this.drawSectionTitle(doc, "RÉSULTATS SCOLAIRES", startY);

    // Matière | Coef | Note | Appréciation | Professeur  (total = 519.28)
    const cols = [
      { label: "Matière",      w: 192, align: "left"   },
      { label: "Coef",         w:  46, align: "center" },
      { label: "Note",         w:  56, align: "center" },
      { label: "Appréciation", w:  80, align: "center" },
      { label: "Professeur",   w: 145, align: "left"   },
    ] as const;

    const RH  = 16;
    const HH  = 20;

    // En-tête bleu
    let x = ML;
    cols.forEach((c) => { doc.rect(x, y, c.w, HH).fill(C.primary); x += c.w; });
    doc.rect(ML, y + HH - 2, UW, 2).fill(C.gold);

    x = ML;
    cols.forEach((c) => {
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(8)
        .text(c.label, x + 3, y + 6, { width: c.w - 6, align: c.align });
      x += c.w;
    });

    y += HH;

    // Lignes de données
    data.grades.forEach((g, idx) => {
      const alt   = idx % 2 === 1;
      const fail  = g.grade < g.passingGrade;
      doc.rect(ML, y, UW, RH).fill(alt ? C.altRow : C.white);
      if (fail) {
        const nx = ML + cols[0].w + cols[1].w;
        doc.rect(nx, y, cols[2].w, RH).fill("#ffe4e4");
      }

      const { label: men, color: mc } = this.getMention(g.grade, g.passingGrade);
      const vals = [g.subject, g.coefficient.toString(), g.grade.toFixed(1), men, g.professeur || "—"];

      x = ML;
      cols.forEach((c, ci) => {
        const clr = ci === 2 && fail ? C.danger : ci === 3 ? mc : ci === 0 ? C.ink : C.gray;
        doc.fillColor(clr)
          .font(ci === 0 || ci === 2 ? "Helvetica-Bold" : "Helvetica")
          .fontSize(8)
          .text(vals[ci], x + 3, y + 4, { width: c.w - 6, align: c.align });
        x += c.w;
      });

      doc.moveTo(ML, y + RH).lineTo(ML + UW, y + RH).lineWidth(0.2).stroke(C.border);
      y += RH;
    });

    // Bordure extérieure + séparateurs verticaux
    doc.rect(ML, startY + 15, UW, y - startY - 15).lineWidth(0.8).stroke(C.primary);
    x = ML;
    cols.slice(0, -1).forEach((c) => {
      x += c.w;
      doc.moveTo(x, startY + 15).lineTo(x, y).lineWidth(0.25).stroke(C.border);
    });

    return y + 8;
  }

  private getMention(grade: number, passing: number): { label: string; color: string } {
    const r = grade / passing;
    if (r >= 1.6) return { label: "Très Bien",  color: "#0d6e2e" };
    if (r >= 1.3) return { label: "Bien",        color: "#1d7a40" };
    if (r >= 1.1) return { label: "Assez Bien",  color: "#1a5276" };
    if (r >= 1.0) return { label: "Passable",    color: "#7d6608" };
    return               { label: "Insuffisant", color: this.C.danger };
  }

  // ────────────────────────────────────────────────────────────
  // PANNEAU STATISTIQUES
  // ────────────────────────────────────────────────────────────

  private drawStatsPanel(doc: any, data: BulletinData, startY: number): number {
    const C    = this.C;
    const ML   = this.ML;
    const UW   = this.UW;
    const s    = data.statistics;
    const PH   = 56;
    const HH   = 18;
    const CW   = UW / 3;

    doc.rect(ML, startY, UW, PH).fill(C.pale).stroke(C.border);
    doc.rect(ML, startY, UW, HH).fill(C.light);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(8)
      .text("STATISTIQUES", ML, startY + 5, { width: UW, align: "center" });

    const items = [
      { lbl: "Moyenne générale",  val: `${s.weightedAverage.toFixed(2)} / 20` },
      { lbl: "Taux de réussite",  val: `${s.successRate.toFixed(1)} %` },
      { lbl: "Total coefficients", val: `${s.totalCoefficient}` },
    ];

    const by = startY + HH;
    items.forEach(({ lbl, val }, i) => {
      const sx = ML + i * CW;
      doc.fillColor(C.gray).font("Helvetica").fontSize(7)
        .text(lbl, sx + 3, by + 6, { width: CW - 6, align: "center" });
      doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(15)
        .text(val, sx + 3, by + 16, { width: CW - 6, align: "center" });
      if (i < 2) {
        doc.moveTo(sx + CW, by + 5).lineTo(sx + CW, startY + PH - 4)
          .lineWidth(0.4).stroke(C.border);
      }
    });

    if (s.minGrade !== undefined && s.maxGrade !== undefined) {
      doc.fillColor(C.gray).font("Helvetica").fontSize(6.5)
        .text(
          `Note min : ${s.minGrade.toFixed(2)}/20     Note max : ${s.maxGrade.toFixed(2)}/20`,
          ML + 3, startY + PH - 11,
          { width: UW - 6, align: "center" }
        );
    }

    doc.rect(ML, startY, UW, PH).lineWidth(0.8).stroke(C.primary);
    return startY + PH + 8;
  }

  // ────────────────────────────────────────────────────────────
  // SIGNATURES
  // ────────────────────────────────────────────────────────────

  private drawSignatures(doc: any, data: BulletinData, startY: number): number {
    const C  = this.C;
    const ML = this.ML;
    const UW = this.UW;
    const CW = UW / 2;

    doc.rect(ML, startY, UW, 18).fill(C.primary);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(8)
      .text("REMARQUES ET SIGNATURES", ML, startY + 5, { width: UW, align: "center" });

    const cy = startY + 22;

    // Remarques Prof
    doc.fillColor(C.gray).font("Helvetica-Bold").fontSize(7)
      .text("Remarques du Professeur Principal :", ML + 5, cy);
    doc.fillColor(C.ink).font("Helvetica").fontSize(7)
      .text(data.remarks.headTeacher || "Aucune remarque", ML + 5, cy + 10, { width: CW - 12 });

    // Remarques Directeur
    doc.fillColor(C.gray).font("Helvetica-Bold").fontSize(7)
      .text("Remarques du Directeur :", ML + CW + 5, cy);
    doc.fillColor(C.ink).font("Helvetica").fontSize(7)
      .text(data.remarks.director || "Aucune remarque", ML + CW + 5, cy + 10, { width: CW - 12 });

    const sy = cy + 42;

    // Ligne signature Prof
    doc.fillColor(C.ink).font("Helvetica").fontSize(7.5)
      .text("Le Professeur Principal", ML + 15, sy, { width: 160, align: "center" });
    doc.moveTo(ML + 15, sy + 28).lineTo(ML + 175, sy + 28).lineWidth(0.7).stroke(C.ink);

    // Ligne signature Directeur
    doc.fillColor(C.ink).font("Helvetica").fontSize(7.5)
      .text("Le Directeur", ML + CW + 60, sy, { width: 155, align: "center" });
    doc.moveTo(ML + CW + 60, sy + 28).lineTo(ML + CW + 215, sy + 28).lineWidth(0.7).stroke(C.ink);

    return sy + 35;
  }

  // ────────────────────────────────────────────────────────────
  // TABLEAU RELEVÉ DE NOTES
  // ────────────────────────────────────────────────────────────

  private drawReleveTable(doc: any, data: BulletinData, startY: number): number {
    const C  = this.C;
    const ML = this.ML;
    const UW = this.UW;
    const subjects = data.multiControlGrades || [];
    const totals   = data.yearlyTotals;

    let y = this.drawSectionTitle(doc, "RÉSULTATS DE L'ANNÉE SCOLAIRE", startY);

    // Matière | Base | Coef | C1 | C2 | C3 | C4  (total = 519.28)
    const cols = [
      { label: "Matière", sub: "",           w: 166, align: "left"   },
      { label: "Base",    sub: "",           w:  43, align: "center" },
      { label: "Coef",    sub: "",           w:  43, align: "center" },
      { label: "C1",      sub: "1er Trim.",  w:  67, align: "center" },
      { label: "C2",      sub: "2ème Trim.", w:  67, align: "center" },
      { label: "C3",      sub: "3ème Trim.", w:  67, align: "center" },
      { label: "C4",      sub: "Exam.",      w:  66, align: "center" },
    ] as const;

    const RH = 16;
    const HH = 24;

    // En-tête
    let x = ML;
    cols.forEach((c) => { doc.rect(x, y, c.w, HH).fill(C.primary); x += c.w; });
    doc.rect(ML, y + HH - 2, UW, 2).fill(C.gold);

    x = ML;
    cols.forEach((c) => {
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(8.5)
        .text(c.label, x + 2, y + 4, { width: c.w - 4, align: c.align });
      if (c.sub) {
        doc.fillColor("#aac8e8").font("Helvetica").fontSize(6)
          .text(c.sub, x + 2, y + 15, { width: c.w - 4, align: "center" });
      }
      x += c.w;
    });

    y += HH;

    subjects.forEach((sub, idx) => {
      doc.rect(ML, y, UW, RH).fill(idx % 2 === 1 ? C.altRow : C.white);
      x = ML;

      doc.fillColor(C.ink).font("Helvetica-Bold").fontSize(7.5)
        .text(sub.subjectName, x + 3, y + 4, { width: cols[0].w - 6 });
      x += cols[0].w;

      doc.fillColor(C.gray).font("Helvetica").fontSize(7.5)
        .text(sub.maxGrade.toString(), x + 2, y + 4, { width: cols[1].w - 4, align: "center" });
      x += cols[1].w;

      doc.fillColor(C.gray).font("Helvetica").fontSize(7.5)
        .text(sub.coefficient.toString(), x + 2, y + 4, { width: cols[2].w - 4, align: "center" });
      x += cols[2].w;

      const passingOn20 = Math.round((sub.passingGrade * 20) / (sub.maxGrade || 20));
      YEAR_WIDE_CONTROL_TYPES.forEach((ct, ci) => {
        const cg   = sub.controlGrades[ct];
        const fail = cg ? cg.gradeOn20 < passingOn20 : false;
        if (cg && fail) doc.rect(x, y, cols[3 + ci].w, RH).fill("#ffe4e4");
        doc
          .fillColor(fail && cg ? C.danger : cg ? C.ink : C.gray)
          .font(cg ? "Helvetica-Bold" : "Helvetica")
          .fontSize(8)
          .text(cg ? cg.grade.toFixed(1) : "—", x + 2, y + 4, {
            width: cols[3 + ci].w - 4,
            align: "center",
          });
        x += cols[3 + ci].w;
      });

      doc.moveTo(ML, y + RH).lineTo(ML + UW, y + RH).lineWidth(0.2).stroke(C.border);
      y += RH;
    });

    // Ligne Moyenne /20
    doc.rect(ML, y, UW, RH + 2).fill(C.pale);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(8)
      .text("Moyenne / 20", ML + 3, y + 5, {
        width: cols[0].w + cols[1].w + cols[2].w - 6,
      });

    x = ML + cols[0].w + cols[1].w + cols[2].w;
    YEAR_WIDE_CONTROL_TYPES.forEach((ct, ci) => {
      const avg = totals?.averagesByControl[ct] || 0;
      doc
        .fillColor(avg > 0 ? C.primary : C.gray)
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .text(avg > 0 ? avg.toFixed(1) : "—", x + 2, y + 5, {
          width: cols[3 + ci].w - 4,
          align: "center",
        });
      x += cols[3 + ci].w;
    });

    y += RH + 2;

    // Bordure + séparateurs
    doc.rect(ML, startY + 15, UW, y - startY - 15).lineWidth(0.8).stroke(C.primary);
    x = ML;
    cols.slice(0, -1).forEach((c) => {
      x += c.w;
      doc.moveTo(x, startY + 15).lineTo(x, y).lineWidth(0.25).stroke(C.border);
    });

    return y + 8;
  }

  // ────────────────────────────────────────────────────────────
  // BLOC DÉCISION + SIGNATURES (RELEVÉ)
  // ────────────────────────────────────────────────────────────

  private drawDecisionAndSig(doc: any, data: BulletinData, startY: number): number {
    const C  = this.C;
    const ML = this.ML;
    const UW = this.UW;
    const s  = data.statistics;
    const dec = data.decision;

    const LW = 295;
    const RW = UW - LW;
    const BH = 74;

    // Panneau gauche : moyennes
    doc.rect(ML, startY, LW, BH).fill(C.pale).stroke(C.border);
    doc.rect(ML, startY, LW, 18).fill(C.light);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(8)
      .text("RÉSULTAT ANNUEL", ML, startY + 5, { width: LW, align: "center" });

    doc.fillColor(C.gray).font("Helvetica").fontSize(7.5)
      .text("Moyenne générale annuelle :", ML + 6, startY + 25);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(20)
      .text(`${s.weightedAverage.toFixed(2)} / 20`, ML + 6, startY + 35);
    doc.fillColor(C.gray).font("Helvetica").fontSize(7.5)
      .text(`Taux de réussite : ${s.successRate.toFixed(1)} %`, ML + 6, startY + 59);

    // Panneau droit : décision colorée
    let bg = C.sbg, fc = C.success;
    if (dec?.label === "À REFAIRE")         { bg = C.wbg; fc = C.warning; }
    if (dec?.label === "À REFAIRE AILLEURS") { bg = C.dbg; fc = C.danger;  }

    doc.rect(ML + LW, startY, RW, BH).fill(bg).stroke(C.border);
    doc.rect(ML + LW, startY, RW, 18).fill(fc);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(8)
      .text("DÉCISION", ML + LW, startY + 5, { width: RW, align: "center" });

    doc.fillColor(fc).font("Helvetica-Bold").fontSize(13)
      .text(dec?.label || "—", ML + LW + 6, startY + 26, { width: RW - 12, align: "center" });
    doc.fillColor(C.gray).font("Helvetica").fontSize(7.5)
      .text(dec?.description || "", ML + LW + 6, startY + 46, { width: RW - 12, align: "center" });

    return this.drawSignatures(doc, data, startY + BH + 8);
  }

  // ────────────────────────────────────────────────────────────
  // CERTIFICAT DE SCOLARITÉ
  // ────────────────────────────────────────────────────────────

  private drawCertificatBody(doc: any, data: BulletinData, startY: number): number {
    const C  = this.C;
    const ML = this.ML;
    const UW = this.UW;
    const { student, classInfo, academicYear, schoolInfo } = data;

    const fullName  = `${student.firstName} ${student.lastName}`;
    const dob       = student.dateOfBirth
      ? new Date(student.dateOfBirth).toLocaleDateString("fr-FR")
      : null;

    let y = startY + 14;

    doc.fillColor(C.ink).font("Helvetica").fontSize(11)
      .text(
        `Nous, soussignés, Direction de ${schoolInfo.name || "l'établissement"}, certifions par la présente que :`,
        ML, y, { width: UW, lineGap: 3 }
      );

    y += 32;

    // Encadré nom
    doc.rect(ML + 30, y, UW - 60, 34).fillAndStroke(C.pale, C.primary);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(14)
      .text(fullName.toUpperCase(), ML + 30, y + 4, { width: UW - 60, align: "center" });
    if (dob) {
      doc.fillColor(C.gray).font("Helvetica").fontSize(8.5)
        .text(`né(e) le ${dob}`, ML + 30, y + 22, { width: UW - 60, align: "center" });
    }

    y += 46;

    doc.fillColor(C.ink).font("Helvetica").fontSize(11)
      .text("est ", ML, y, { continued: true, lineGap: 3 })
      .font("Helvetica-Bold").text("régulièrement inscrit(e)", { continued: true })
      .font("Helvetica").text(" en classe de ", { continued: true })
      .font("Helvetica-Bold").text(`${classInfo.name} (${classInfo.level})`, { continued: true })
      .font("Helvetica").text(` au sein de notre établissement pour l'année scolaire `, { continued: true })
      .font("Helvetica-Bold").text(`${academicYear.year}.`);

    y = doc.y + 18;

    doc.fillColor(C.ink).font("Helvetica").fontSize(11)
      .text(
        "Le présent certificat est délivré à l'intéressé(e) pour servir et valoir ce que de droit.",
        ML, y, { width: UW, align: "justify", lineGap: 3 }
      );

    y = doc.y + 38;

    doc.fillColor(C.ink).font("Helvetica").fontSize(10)
      .text(`Fait à ${schoolInfo.city || "Gonaïves"}, le ${new Date().toLocaleDateString("fr-FR")}`, ML, y);
    doc.fillColor(C.ink).font("Helvetica-Bold").fontSize(10)
      .text("Le Directeur", ML + 300, y, { width: 180, align: "center" });
    doc.moveTo(ML + 300, y + 50).lineTo(ML + 480, y + 50).lineWidth(0.8).stroke(C.ink);

    return y + 60;
  }

  // ────────────────────────────────────────────────────────────
  // PIED DE PAGE (positionné de façon absolue)
  // ────────────────────────────────────────────────────────────

  private drawFooter(doc: any, data: BulletinData) {
    const C  = this.C;
    const FY = this.FOOTER_Y;

    doc.rect(0, FY, this.PW, 2.5).fill(C.gold);
    doc.rect(0, FY + 2.5, this.PW, this.FOOTER_H - 2.5).fill(C.primary);

    const dateStr = data.metadata.generatedAt.toLocaleDateString("fr-FR");
    const docNum  = data.metadata.documentNumber;

    doc.fillColor("#9eb8d8").font("Helvetica").fontSize(6.5)
      .text(`Généré le : ${dateStr}`, this.ML, FY + 9);
    doc.fillColor("#d4e3f5").font("Helvetica-Bold").fontSize(6.5)
      .text(`Réf : ${docNum}`, 0, FY + 9, { width: this.PW, align: "center" });
    doc.fillColor("#9eb8d8").font("Helvetica").fontSize(6.5)
      .text("Page 1 / 1", 0, FY + 9, { width: this.PW - this.ML, align: "right" });
    doc.fillColor("#6b90b8").font("Helvetica").fontSize(6)
      .text(`${data.schoolInfo.name || ""}   ·   Document officiel`, 0, FY + 19, {
        width: this.PW, align: "center",
      });
  }

  // ═══════════════════════════════════════════════════════════════
  // PERSISTANCE
  // ═══════════════════════════════════════════════════════════════

  async saveTranscript(bulletinData: BulletinData, pdfBuffer: Buffer, generatedBy: string) {
    try {
      const transcript = await this.prisma.transcript.create({
        data: {
          studentId:      bulletinData.student.id,
          academicYearId: bulletinData.academicYear.id,
          // controlType n'a pas de sens pour RELEVE / CERTIFICAT_SCOLARITE ;
          // CONTROLE_4 sert de sentinelle pour éviter d'élargir l'enum ControlType
          controlType:    bulletinData.controlType ?? "CONTROLE_4",
          classLevel:     bulletinData.classInfo.level as any,
          documentType:   bulletinData.documentType,
          gpa:            bulletinData.statistics.weightedAverage,
          totalCredits:   bulletinData.statistics.totalCoefficient,
          creditsEarned:  Math.floor(
            (bulletinData.statistics.successRate * bulletinData.statistics.totalCoefficient) / 100
          ),
          successRate:    bulletinData.statistics.successRate,
          fileName:       `${bulletinData.documentType.toLowerCase()}_${bulletinData.student.studentCode}_${Date.now()}.pdf`,
          pdfData:        pdfBuffer,
          status:         "GENERATED",
          generatedBy,
          language:       "FR",
          metadata:       bulletinData.metadata as any,
          notes:          bulletinData.remarks.generalComment,
        },
      });

      await this.prisma.documentHistory.create({
        data: {
          transcriptId: transcript.id,
          action:       "GENERATED",
          performedBy:  generatedBy,
          details: {
            student:    bulletinData.student,
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

  async getStudentTranscripts(studentId: string, academicYearId?: string, documentType?: DocumentType) {
    const where: any = { studentId };
    if (academicYearId) where.academicYearId = academicYearId;
    if (documentType)   where.documentType   = documentType;

    return this.prisma.transcript.findMany({
      where,
      include: {
        academicYear: true,
        documentHistory: { orderBy: { performedAt: "desc" }, take: 5 },
      },
      orderBy: { generatedAt: "desc" },
    });
  }
}
