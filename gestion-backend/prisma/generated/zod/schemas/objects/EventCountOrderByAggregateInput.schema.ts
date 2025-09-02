import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const EventCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.EventCountOrderByAggregateInput, z.ZodTypeDef, Prisma.EventCountOrderByAggregateInput> = z.object({
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
export const EventCountOrderByAggregateInputObjectZodSchema = z.object({
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
