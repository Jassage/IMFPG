import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookArgsObjectSchema } from './BookArgs.schema';
import { StudentArgsObjectSchema } from './StudentArgs.schema'

export const BookLoanIncludeObjectSchema: z.ZodType<Prisma.BookLoanInclude, z.ZodTypeDef, Prisma.BookLoanInclude> = z.object({
  book: z.union([z.boolean(), z.lazy(() => BookArgsObjectSchema)]).optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional()
}).strict();
export const BookLoanIncludeObjectZodSchema = z.object({
  book: z.union([z.boolean(), z.lazy(() => BookArgsObjectSchema)]).optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional()
}).strict();
