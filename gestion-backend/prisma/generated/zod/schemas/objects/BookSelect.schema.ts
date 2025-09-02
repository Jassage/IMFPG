import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanFindManySchema } from '../findManyBookLoan.schema';
import { BookCountOutputTypeArgsObjectSchema } from './BookCountOutputTypeArgs.schema'

export const BookSelectObjectSchema: z.ZodType<Prisma.BookSelect, z.ZodTypeDef, Prisma.BookSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  author: z.boolean().optional(),
  isbn: z.boolean().optional(),
  category: z.boolean().optional(),
  faculty: z.boolean().optional(),
  quantity: z.boolean().optional(),
  available: z.boolean().optional(),
  location: z.boolean().optional(),
  status: z.boolean().optional(),
  bookLoans: z.union([z.boolean(), z.lazy(() => BookLoanFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BookCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BookSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  author: z.boolean().optional(),
  isbn: z.boolean().optional(),
  category: z.boolean().optional(),
  faculty: z.boolean().optional(),
  quantity: z.boolean().optional(),
  available: z.boolean().optional(),
  location: z.boolean().optional(),
  status: z.boolean().optional(),
  bookLoans: z.union([z.boolean(), z.lazy(() => BookLoanFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BookCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
