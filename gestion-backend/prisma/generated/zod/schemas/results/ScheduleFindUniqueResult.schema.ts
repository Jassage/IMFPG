import { z } from 'zod';
export const ScheduleFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  assignment: z.unknown(),
  assignmentId: z.string(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().optional(),
  recurrence: z.string().optional(),
  exceptions: z.unknown().optional(),
  professeur: z.unknown().optional(),
  professeurId: z.string().optional(),
  attendances: z.array(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date()
}));