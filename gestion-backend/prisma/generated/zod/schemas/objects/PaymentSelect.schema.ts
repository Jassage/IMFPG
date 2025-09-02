import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { AcademicYearArgsObjectSchema } from './AcademicYearArgs.schema'

export const PaymentSelectObjectSchema: z.ZodType<Prisma.PaymentSelect, z.ZodTypeDef, Prisma.PaymentSelect> = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  amount: z.boolean().optional(),
  type: z.boolean().optional(),
  moyen: z.boolean().optional(),
  status: z.boolean().optional(),
  paidDate: z.boolean().optional(),
  description: z.boolean().optional(),
  academicYearId: z.boolean().optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const PaymentSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  amount: z.boolean().optional(),
  type: z.boolean().optional(),
  moyen: z.boolean().optional(),
  status: z.boolean().optional(),
  paidDate: z.boolean().optional(),
  description: z.boolean().optional(),
  academicYearId: z.boolean().optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
