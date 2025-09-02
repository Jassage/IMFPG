import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookLoanCountAggregateInputObjectSchema: z.ZodType<Prisma.BookLoanCountAggregateInputType, z.ZodTypeDef, Prisma.BookLoanCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  bookId: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  loanDate: z.literal(true).optional(),
  dueDate: z.literal(true).optional(),
  returnDate: z.literal(true).optional(),
  status: z.literal(true).optional(),
  renewalCount: z.literal(true).optional(),
  fine: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const BookLoanCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  bookId: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  loanDate: z.literal(true).optional(),
  dueDate: z.literal(true).optional(),
  returnDate: z.literal(true).optional(),
  status: z.literal(true).optional(),
  renewalCount: z.literal(true).optional(),
  fine: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
