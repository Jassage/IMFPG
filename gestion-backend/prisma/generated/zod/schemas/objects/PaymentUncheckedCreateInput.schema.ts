import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const PaymentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.PaymentUncheckedCreateInput, z.ZodTypeDef, Prisma.PaymentUncheckedCreateInput> = z.object({
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
export const PaymentUncheckedCreateInputObjectZodSchema = z.object({
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
