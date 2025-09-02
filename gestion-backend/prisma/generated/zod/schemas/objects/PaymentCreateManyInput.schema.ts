import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const PaymentCreateManyInputObjectSchema: z.ZodType<Prisma.PaymentCreateManyInput, z.ZodTypeDef, Prisma.PaymentCreateManyInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  amount: z.number(),
  type: z.string(),
  moyen: z.string().optional(),
  status: z.string(),
  paidDate: z.date().nullish(),
  description: z.string().nullish(),
  academicYearId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const PaymentCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  amount: z.number(),
  type: z.string(),
  moyen: z.string().optional(),
  status: z.string(),
  paidDate: z.date().nullish(),
  description: z.string().nullish(),
  academicYearId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
