import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.PaymentUncheckedCreateWithoutAcademicYearInput, z.ZodTypeDef, Prisma.PaymentUncheckedCreateWithoutAcademicYearInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  amount: z.number(),
  type: z.string(),
  moyen: z.string().optional(),
  status: z.string(),
  paidDate: z.date().nullish(),
  description: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const PaymentUncheckedCreateWithoutAcademicYearInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  amount: z.number(),
  type: z.string(),
  moyen: z.string().optional(),
  status: z.string(),
  paidDate: z.date().nullish(),
  description: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
