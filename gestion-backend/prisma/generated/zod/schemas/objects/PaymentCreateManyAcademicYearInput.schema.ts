import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const PaymentCreateManyAcademicYearInputObjectSchema: z.ZodType<Prisma.PaymentCreateManyAcademicYearInput, z.ZodTypeDef, Prisma.PaymentCreateManyAcademicYearInput> = z.object({
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
export const PaymentCreateManyAcademicYearInputObjectZodSchema = z.object({
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
