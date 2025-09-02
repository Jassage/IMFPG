import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { BookLoanOrderByRelationAggregateInputObjectSchema } from './BookLoanOrderByRelationAggregateInput.schema';
import { BookOrderByRelevanceInputObjectSchema } from './BookOrderByRelevanceInput.schema'

export const BookOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.BookOrderByWithRelationInput, z.ZodTypeDef, Prisma.BookOrderByWithRelationInput> = z.object({
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
  bookLoans: z.lazy(() => BookLoanOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => BookOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const BookOrderByWithRelationInputObjectZodSchema = z.object({
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
  bookLoans: z.lazy(() => BookLoanOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => BookOrderByRelevanceInputObjectSchema).optional()
}).strict();
