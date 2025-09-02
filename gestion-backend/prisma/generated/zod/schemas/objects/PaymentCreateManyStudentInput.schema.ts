import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const PaymentCreateManyStudentInputObjectSchema: z.ZodType<Prisma.PaymentCreateManyStudentInput, z.ZodTypeDef, Prisma.PaymentCreateManyStudentInput> = z.object({
  id: z.string().optional(),
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
export const PaymentCreateManyStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
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
