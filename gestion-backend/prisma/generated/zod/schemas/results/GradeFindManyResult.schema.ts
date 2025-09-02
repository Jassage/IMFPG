import { z } from 'zod';
export const GradeFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  ue: z.unknown(),
  ueId: z.string(),
  grade: z.number(),
  status: z.unknown(),
  session: z.unknown(),
  semester: z.string(),
  level: z.string(),
  academicYearId: z.string(),
  academicYear: z.unknown(),
  createdAt: z.date(),
  transcript: z.unknown().optional(),
  transcriptId: z.string().optional(),
  professeur: z.unknown().optional(),
  professeurId: z.string().optional()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});