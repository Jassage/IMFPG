import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookArgsObjectSchema } from './BookArgs.schema';
import { StudentArgsObjectSchema } from './StudentArgs.schema'

export const BookLoanSelectObjectSchema: z.ZodType<Prisma.BookLoanSelect, z.ZodTypeDef, Prisma.BookLoanSelect> = z.object({
  id: z.boolean().optional(),
  book: z.union([z.boolean(), z.lazy(() => BookArgsObjectSchema)]).optional(),
  bookId: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  loanDate: z.boolean().optional(),
  dueDate: z.boolean().optional(),
  returnDate: z.boolean().optional(),
  status: z.boolean().optional(),
  renewalCount: z.boolean().optional(),
  fine: z.boolean().optional()
}).strict();
export const BookLoanSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  book: z.union([z.boolean(), z.lazy(() => BookArgsObjectSchema)]).optional(),
  bookId: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  loanDate: z.boolean().optional(),
  dueDate: z.boolean().optional(),
  returnDate: z.boolean().optional(),
  status: z.boolean().optional(),
  renewalCount: z.boolean().optional(),
  fine: z.boolean().optional()
}).strict();
