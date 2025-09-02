import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateNestedOneWithoutPaymentsInputObjectSchema } from './StudentCreateNestedOneWithoutPaymentsInput.schema';
import { AcademicYearCreateNestedOneWithoutPaymentsInputObjectSchema } from './AcademicYearCreateNestedOneWithoutPaymentsInput.schema'

export const PaymentCreateInputObjectSchema: z.ZodType<Prisma.PaymentCreateInput, z.ZodTypeDef, Prisma.PaymentCreateInput> = z.object({
  id: z.string().optional(),
  amount: z.number(),
  type: z.string(),
  moyen: z.string().optional(),
  status: z.string(),
  paidDate: z.date().nullish(),
  description: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutPaymentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutPaymentsInputObjectSchema).optional()
}).strict();
export const PaymentCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  amount: z.number(),
  type: z.string(),
  moyen: z.string().optional(),
  status: z.string(),
  paidDate: z.date().nullish(),
  description: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutPaymentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutPaymentsInputObjectSchema).optional()
}).strict();
