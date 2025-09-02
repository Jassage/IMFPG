import { z } from 'zod';
export const GradeFindUniqueResultSchema = z.nullable(z.object({
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
}));