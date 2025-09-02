import { z } from 'zod';
export const TranscriptFindManyResultSchema = z.object({
  data: z.array(z.object({
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