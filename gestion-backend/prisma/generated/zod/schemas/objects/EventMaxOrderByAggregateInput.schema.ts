import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const EventMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.EventMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.EventMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  startDate: SortOrderSchema.optional(),
  endDate: SortOrderSchema.optional(),
  location: SortOrderSchema.optional(),
  organizer: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  isPublic: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const EventMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  startDate: SortOrderSchema.optional(),
  endDate: SortOrderSchema.optional(),
  location: SortOrderSchema.optional(),
  organizer: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  isPublic: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
