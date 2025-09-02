import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { BookOrderByWithRelationInputObjectSchema } from './BookOrderByWithRelationInput.schema';
import { StudentOrderByWithRelationInputObjectSchema } from './StudentOrderByWithRelationInput.schema';
import { BookLoanOrderByRelevanceInputObjectSchema } from './BookLoanOrderByRelevanceInput.schema'

export const BookLoanOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.BookLoanOrderByWithRelationInput, z.ZodTypeDef, Prisma.BookLoanOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  bookId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  loanDate: SortOrderSchema.optional(),
  dueDate: SortOrderSchema.optional(),
  returnDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  renewalCount: SortOrderSchema.optional(),
  fine: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  book: z.lazy(() => BookOrderByWithRelationInputObjectSchema).optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => BookLoanOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const BookLoanOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  bookId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  loanDate: SortOrderSchema.optional(),
  dueDate: SortOrderSchema.optional(),
  returnDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  renewalCount: SortOrderSchema.optional(),
  fine: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  book: z.lazy(() => BookOrderByWithRelationInputObjectSchema).optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => BookLoanOrderByRelevanceInputObjectSchema).optional()
}).strict();
