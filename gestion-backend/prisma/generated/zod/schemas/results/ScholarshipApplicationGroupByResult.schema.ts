import { z } from 'zod';
export const ScholarshipApplicationGroupByResultSchema = z.array(z.object({
  id: z.string(),
  scholarshipId: z.string(),
  studentId: z.string(),
  applicationDate: z.date(),
  motivation: z.string(),
  status: z.string(),
  reviewNotes: z.string(),
  _count: z.object({
    id: z.number(),
    scholarship: z.number(),
    scholarshipId: z.number(),
    student: z.number(),
    studentId: z.number(),
    applicationDate: z.number(),
    documents: z.number(),
    motivation: z.number(),
    status: z.number(),
    reviewNotes: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    scholarshipId: z.string().nullable(),
    studentId: z.string().nullable(),
    applicationDate: z.date().nullable(),
    motivation: z.string().nullable(),
    status: z.string().nullable(),
    reviewNotes: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    scholarshipId: z.string().nullable(),
    studentId: z.string().nullable(),
    applicationDate: z.date().nullable(),
    motivation: z.string().nullable(),
    status: z.string().nullable(),
    reviewNotes: z.string().nullable()
  }).nullable().optional()
}));