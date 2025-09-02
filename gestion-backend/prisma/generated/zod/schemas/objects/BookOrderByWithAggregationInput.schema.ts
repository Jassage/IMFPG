import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { BookCountOrderByAggregateInputObjectSchema } from './BookCountOrderByAggregateInput.schema';
import { BookAvgOrderByAggregateInputObjectSchema } from './BookAvgOrderByAggregateInput.schema';
import { BookMaxOrderByAggregateInputObjectSchema } from './BookMaxOrderByAggregateInput.schema';
import { BookMinOrderByAggregateInputObjectSchema } from './BookMinOrderByAggregateInput.schema';
import { BookSumOrderByAggregateInputObjectSchema } from './BookSumOrderByAggregateInput.schema'

export const BookOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.BookOrderByWithAggregationInput, z.ZodTypeDef, Prisma.BookOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  author: SortOrderSchema.optional(),
  isbn: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  category: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  faculty: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  quantity: SortOrderSchema.optional(),
  available: SortOrderSchema.optional(),
  location: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => BookCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => BookAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => BookMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => BookMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => BookSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const BookOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  author: SortOrderSchema.optional(),
  isbn: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  category: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  faculty: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  quantity: SortOrderSchema.optional(),
  available: SortOrderSchema.optional(),
  location: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => BookCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => BookAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => BookMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => BookMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => BookSumOrderByAggregateInputObjectSchema).optional()
}).strict();
