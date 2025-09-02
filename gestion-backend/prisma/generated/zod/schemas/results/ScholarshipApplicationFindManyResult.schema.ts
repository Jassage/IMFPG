import { z } from 'zod';
export const ScholarshipApplicationFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  scholarship: z.unknown(),
  scholarshipId: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  applicationDate: z.date(),
  documents: z.array(z.unknown()),
  motivation: z.string().optional(),
  status: z.string(),
  reviewNotes: z.string().optional()
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