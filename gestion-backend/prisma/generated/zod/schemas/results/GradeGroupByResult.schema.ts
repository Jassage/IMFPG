import { z } from 'zod';
export const GradeGroupByResultSchema = z.array(z.object({
  id: z.string(),
  studentId: z.string(),
  ueId: z.string(),
  grade: z.number(),
  semester: z.string(),
  level: z.string(),
  academicYearId: z.string(),
  createdAt: z.date(),
  transcriptId: z.string(),
  professeurId: z.string(),
  _count: z.object({
    id: z.number(),
    student: z.number(),
    studentId: z.number(),
    ue: z.number(),
    ueId: z.number(),
    grade: z.number(),
    status: z.number(),
    session: z.number(),
    semester: z.number(),
    level: z.number(),
    academicYearId: z.number(),
    academicYear: z.number(),
    createdAt: z.number(),
    transcript: z.number(),
    transcriptId: z.number(),
    professeur: z.number(),
    professeurId: z.number()
  }).optional(),
  _sum: z.object({
    grade: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    grade: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    ueId: z.string().nullable(),
    grade: z.number().nullable(),
    semester: z.string().nullable(),
    level: z.string().nullable(),
    academicYearId: z.string().nullable(),
    createdAt: z.date().nullable(),
    transcriptId: z.string().nullable(),
    professeurId: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    ueId: z.string().nullable(),
    grade: z.number().nullable(),
    semester: z.string().nullable(),
    level: z.string().nullable(),
    academicYearId: z.string().nullable(),
    createdAt: z.date().nullable(),
    transcriptId: z.string().nullable(),
    professeurId: z.string().nullable()
  }).nullable().optional()
}));