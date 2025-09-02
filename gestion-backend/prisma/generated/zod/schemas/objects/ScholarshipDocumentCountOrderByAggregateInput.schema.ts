import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipDocumentCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentCountOrderByAggregateInput, z.ZodTypeDef, Prisma.ScholarshipDocumentCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  scholarshipApplicationId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
export const ScholarshipDocumentCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  scholarshipApplicationId: SortOrderSchema.optional(),
  url: SortOrderSchema.optional()
}).strict();
