import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const BookLoanMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BookLoanMinOrderByAggregateInput, z.ZodTypeDef, Prisma.BookLoanMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  bookId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  loanDate: SortOrderSchema.optional(),
  dueDate: SortOrderSchema.optional(),
  returnDate: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  renewalCount: SortOrderSchema.optional(),
  fine: SortOrderSchema.optional()
}).strict();
export const BookLoanMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  bookId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  loanDate: SortOrderSchema.optional(),
  dueDate: SortOrderSchema.optional(),
  returnDate: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  renewalCount: SortOrderSchema.optional(),
  fine: SortOrderSchema.optional()
}).strict();
