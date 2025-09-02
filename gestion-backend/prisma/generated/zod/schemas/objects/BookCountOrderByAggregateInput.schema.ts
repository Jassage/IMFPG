import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const BookCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BookCountOrderByAggregateInput, z.ZodTypeDef, Prisma.BookCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  author: SortOrderSchema.optional(),
  isbn: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  faculty: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  available: SortOrderSchema.optional(),
  location: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const BookCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  author: SortOrderSchema.optional(),
  isbn: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  faculty: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  available: SortOrderSchema.optional(),
  location: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
