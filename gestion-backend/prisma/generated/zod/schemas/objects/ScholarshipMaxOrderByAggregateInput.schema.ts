import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.ScholarshipMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  criteria: SortOrderSchema.optional(),
  applicationDeadline: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  maxRecipients: SortOrderSchema.optional(),
  currentRecipients: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const ScholarshipMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  criteria: SortOrderSchema.optional(),
  applicationDeadline: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  maxRecipients: SortOrderSchema.optional(),
  currentRecipients: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
