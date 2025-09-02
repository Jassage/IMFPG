import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const EnrollmentOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.EnrollmentOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.EnrollmentOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const EnrollmentOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
