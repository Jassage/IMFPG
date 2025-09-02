import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AnnouncementCountOrderByAggregateInputObjectSchema } from './AnnouncementCountOrderByAggregateInput.schema';
import { AnnouncementMaxOrderByAggregateInputObjectSchema } from './AnnouncementMaxOrderByAggregateInput.schema';
import { AnnouncementMinOrderByAggregateInputObjectSchema } from './AnnouncementMinOrderByAggregateInput.schema'

export const AnnouncementOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AnnouncementOrderByWithAggregationInput, z.ZodTypeDef, Prisma.AnnouncementOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  authorId: SortOrderSchema.optional(),
  publishDate: SortOrderSchema.optional(),
  expiryDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  targetAudience: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  _count: z.lazy(() => AnnouncementCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AnnouncementMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AnnouncementMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AnnouncementOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  authorId: SortOrderSchema.optional(),
  publishDate: SortOrderSchema.optional(),
  expiryDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  targetAudience: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  _count: z.lazy(() => AnnouncementCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AnnouncementMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AnnouncementMinOrderByAggregateInputObjectSchema).optional()
}).strict();
