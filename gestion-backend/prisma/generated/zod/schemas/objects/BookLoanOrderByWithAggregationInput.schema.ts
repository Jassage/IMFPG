import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { BookLoanCountOrderByAggregateInputObjectSchema } from './BookLoanCountOrderByAggregateInput.schema';
import { BookLoanAvgOrderByAggregateInputObjectSchema } from './BookLoanAvgOrderByAggregateInput.schema';
import { BookLoanMaxOrderByAggregateInputObjectSchema } from './BookLoanMaxOrderByAggregateInput.schema';
import { BookLoanMinOrderByAggregateInputObjectSchema } from './BookLoanMinOrderByAggregateInput.schema';
import { BookLoanSumOrderByAggregateInputObjectSchema } from './BookLoanSumOrderByAggregateInput.schema'

export const BookLoanOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.BookLoanOrderByWithAggregationInput, z.ZodTypeDef, Prisma.BookLoanOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  bookId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  loanDate: SortOrderSchema.optional(),
  dueDate: SortOrderSchema.optional(),
  returnDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  renewalCount: SortOrderSchema.optional(),
  fine: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => BookLoanCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => BookLoanAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => BookLoanMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => BookLoanMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => BookLoanSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const BookLoanOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  bookId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  loanDate: SortOrderSchema.optional(),
  dueDate: SortOrderSchema.optional(),
  returnDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  renewalCount: SortOrderSchema.optional(),
  fine: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => BookLoanCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => BookLoanAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => BookLoanMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => BookLoanMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => BookLoanSumOrderByAggregateInputObjectSchema).optional()
}).strict();
