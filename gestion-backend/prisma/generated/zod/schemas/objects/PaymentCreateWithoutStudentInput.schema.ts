import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateNestedOneWithoutPaymentsInputObjectSchema } from './AcademicYearCreateNestedOneWithoutPaymentsInput.schema'

export const PaymentCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.PaymentCreateWithoutStudentInput, z.ZodTypeDef, Prisma.PaymentCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  type: z.string(),
  moyen: z.string().optional(),
  status: z.string(),
  paidDate: z.date().nullish(),
  description: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutPaymentsInputObjectSchema).optional()
}).strict();
export const PaymentCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  amount: z.number(),
  type: z.string(),
  moyen: z.string().optional(),
  status: z.string(),
  paidDate: z.date().nullish(),
  description: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutPaymentsInputObjectSchema).optional()
}).strict();
