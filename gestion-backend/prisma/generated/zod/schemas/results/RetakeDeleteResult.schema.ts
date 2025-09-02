import { z } from 'zod';
export const RetakeDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  ue: z.unknown(),
  ueId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().optional(),
  scheduledSemester: z.string(),
  status: z.unknown()
}));