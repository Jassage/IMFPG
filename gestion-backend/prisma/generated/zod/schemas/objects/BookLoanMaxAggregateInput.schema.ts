import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookLoanMaxAggregateInputObjectSchema: z.ZodType<Prisma.BookLoanMaxAggregateInputType, z.ZodTypeDef, Prisma.BookLoanMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  bookId: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  loanDate: z.literal(true).optional(),
  dueDate: z.literal(true).optional(),
  returnDate: z.literal(true).optional(),
  status: z.literal(true).optional(),
  renewalCount: z.literal(true).optional(),
  fine: z.literal(true).optional()
}).strict();
export const BookLoanMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  bookId: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  loanDate: z.literal(true).optional(),
  dueDate: z.literal(true).optional(),
  returnDate: z.literal(true).optional(),
  status: z.literal(true).optional(),
  renewalCount: z.literal(true).optional(),
  fine: z.literal(true).optional()
}).strict();
