import { z } from 'zod';
export const PaymentFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  amount: z.number(),
  type: z.string(),
  moyen: z.string(),
  status: z.string(),
  paidDate: z.date().optional(),
  description: z.string().optional(),
  academicYearId: z.string(),
  academicYear: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date()
}));