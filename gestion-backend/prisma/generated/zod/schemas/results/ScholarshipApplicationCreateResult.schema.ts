import { z } from 'zod';
export const ScholarshipApplicationCreateResultSchema = z.object({
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
});