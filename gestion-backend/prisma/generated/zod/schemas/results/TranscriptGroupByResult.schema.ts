import { z } from 'zod';
export const TranscriptGroupByResultSchema = z.array(z.object({
  id: z.string(),
  studentId: z.string(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number(),
  totalCredits: z.number().int(),
  creditsEarned: z.number().int(),
  generatedDate: z.date(),
  _count: z.object({
    id: z.number(),
    student: z.number(),
    studentId: z.number(),
    semester: z.number(),
    academicYear: z.number(),
    gpa: z.number(),
    totalCredits: z.number(),
    creditsEarned: z.number(),
    generatedDate: z.number(),
    grades: z.number()
  }).optional(),
  _sum: z.object({
    gpa: z.number().nullable(),
    totalCredits: z.number().nullable(),
    creditsEarned: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    gpa: z.number().nullable(),
    totalCredits: z.number().nullable(),
    creditsEarned: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    semester: z.string().nullable(),
    academicYear: z.string().nullable(),
    gpa: z.number().nullable(),
    totalCredits: z.number().int().nullable(),
    creditsEarned: z.number().int().nullable(),
    generatedDate: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    semester: z.string().nullable(),
    academicYear: z.string().nullable(),
    gpa: z.number().nullable(),
    totalCredits: z.number().int().nullable(),
    creditsEarned: z.number().int().nullable(),
    generatedDate: z.date().nullable()
  }).nullable().optional()
}));