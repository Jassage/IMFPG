import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipDocumentMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.ScholarshipDocumentMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  scholarshipApplicationId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
export const ScholarshipDocumentMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  scholarshipApplicationId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
