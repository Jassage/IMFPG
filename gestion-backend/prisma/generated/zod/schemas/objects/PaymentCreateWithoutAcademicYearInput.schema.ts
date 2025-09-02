import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateNestedOneWithoutPaymentsInputObjectSchema } from './StudentCreateNestedOneWithoutPaymentsInput.schema'

export const PaymentCreateWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.PaymentCreateWithoutAcademicYearInput, z.ZodTypeDef, Prisma.PaymentCreateWithoutAcademicYearInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  type: z.string(),
  moyen: z.string().optional(),
  status: z.string(),
  paidDate: z.date().nullish(),
  description: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutPaymentsInputObjectSchema)
}).strict();
export const PaymentCreateWithoutAcademicYearInputObjectZodSchema = z.object({
  id: z.string().optional(),
  amount: z.number(),
  type: z.string(),
  moyen: z.string().optional(),
  status: z.string(),
  paidDate: z.date().nullish(),
  description: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutPaymentsInputObjectSchema)
}).strict();
