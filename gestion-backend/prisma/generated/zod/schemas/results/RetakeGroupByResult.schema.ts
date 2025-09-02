import { z } from 'zod';
export const RetakeGroupByResultSchema = z.array(z.object({
  id: z.string(),
  studentId: z.string(),
  ueId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number(),
  scheduledSemester: z.string(),
  _count: z.object({
    id: z.number(),
    student: z.number(),
    studentId: z.number(),
    ue: z.number(),
    ueId: z.number(),
    originalGrade: z.number(),
    retakeGrade: z.number(),
    scheduledSemester: z.number(),
    status: z.number()
  }).optional(),
  _sum: z.object({
    originalGrade: z.number().nullable(),
    retakeGrade: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    originalGrade: z.number().nullable(),
    retakeGrade: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    ueId: z.string().nullable(),
    originalGrade: z.number().nullable(),
    retakeGrade: z.number().nullable(),
    scheduledSemester: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    ueId: z.string().nullable(),
    originalGrade: z.number().nullable(),
    retakeGrade: z.number().nullable(),
    scheduledSemester: z.string().nullable()
  }).nullable().optional()
}));