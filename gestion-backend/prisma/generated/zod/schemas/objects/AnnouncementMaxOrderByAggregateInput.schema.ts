import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AnnouncementMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AnnouncementMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.AnnouncementMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  authorId: SortOrderSchema.optional(),
  publishDate: SortOrderSchema.optional(),
  expiryDate: SortOrderSchema.optional(),
  targetAudience: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional()
}).strict();
export const AnnouncementMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  authorId: SortOrderSchema.optional(),
  publishDate: SortOrderSchema.optional(),
  expiryDate: SortOrderSchema.optional(),
  targetAudience: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional()
}).strict();
