import { z } from 'zod';
export const GuardianCreateResultSchema = z.object({
  id: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  relationship: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  isPrimary: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});