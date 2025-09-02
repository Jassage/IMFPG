import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipMinOrderByAggregateInput, z.ZodTypeDef, Prisma.ScholarshipMinOrderByAggregateInput> = z.object({
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
export const ScholarshipMinOrderByAggregateInputObjectZodSchema = z.object({
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
