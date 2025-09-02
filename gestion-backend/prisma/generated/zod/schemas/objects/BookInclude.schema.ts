import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanFindManySchema } from '../findManyBookLoan.schema';
import { BookCountOutputTypeArgsObjectSchema } from './BookCountOutputTypeArgs.schema'

export const BookIncludeObjectSchema: z.ZodType<Prisma.BookInclude, z.ZodTypeDef, Prisma.BookInclude> = z.object({
  bookLoans: z.union([z.boolean(), z.lazy(() => BookLoanFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BookCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BookIncludeObjectZodSchema = z.object({
  bookLoans: z.union([z.boolean(), z.lazy(() => BookLoanFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BookCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
