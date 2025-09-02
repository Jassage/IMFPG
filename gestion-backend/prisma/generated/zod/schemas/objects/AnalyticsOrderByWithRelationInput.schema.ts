import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { AnalyticsOrderByRelevanceInputObjectSchema } from './AnalyticsOrderByRelevanceInput.schema'

export const AnalyticsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.AnalyticsOrderByWithRelationInput, z.ZodTypeDef, Prisma.AnalyticsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional(),
  parameters: SortOrderSchema.optional(),
  _relevance: z.lazy(() => AnalyticsOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const AnalyticsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  data: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional(),
  parameters: SortOrderSchema.optional(),
  _relevance: z.lazy(() => AnalyticsOrderByRelevanceInputObjectSchema).optional()
}).strict();
