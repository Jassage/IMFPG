import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const PaymentUncheckedCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.PaymentUncheckedCreateWithoutStudentInput, z.ZodTypeDef, Prisma.PaymentUncheckedCreateWithoutStudentInput> = z.object({
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
export const PaymentUncheckedCreateWithoutStudentInputObjectZodSchema = z.object({
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
