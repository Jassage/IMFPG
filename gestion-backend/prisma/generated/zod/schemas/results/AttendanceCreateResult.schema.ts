import { z } from 'zod';
export const AttendanceCreateResultSchema = z.object({
  id: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  schedule: z.unknown(),
  scheduleId: z.string(),
  date: z.date(),
  status: z.string(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});