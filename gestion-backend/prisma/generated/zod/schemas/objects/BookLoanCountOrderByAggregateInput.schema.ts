import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const BookLoanCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BookLoanCountOrderByAggregateInput, z.ZodTypeDef, Prisma.BookLoanCountOrderByAggregateInput> = z.object({
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
export const BookLoanCountOrderByAggregateInputObjectZodSchema = z.object({
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
