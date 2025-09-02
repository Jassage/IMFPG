import { z } from 'zod';
export const TranscriptFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().optional(),
  totalCredits: z.number().int().optional(),
  creditsEarned: z.number().int().optional(),
  generatedDate: z.date(),
  grades: z.array(z.unknown())
}));