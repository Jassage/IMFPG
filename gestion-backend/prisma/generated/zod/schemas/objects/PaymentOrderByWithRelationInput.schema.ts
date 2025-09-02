import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StudentOrderByWithRelationInputObjectSchema } from './StudentOrderByWithRelationInput.schema';
import { AcademicYearOrderByWithRelationInputObjectSchema } from './AcademicYearOrderByWithRelationInput.schema';
import { PaymentOrderByRelevanceInputObjectSchema } from './PaymentOrderByRelevanceInput.schema'

export const PaymentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PaymentOrderByWithRelationInput, z.ZodTypeDef, Prisma.PaymentOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  moyen: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  paidDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  academicYearId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => PaymentOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const PaymentOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  moyen: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  paidDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  academicYearId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => PaymentOrderByRelevanceInputObjectSchema).optional()
}).strict();
