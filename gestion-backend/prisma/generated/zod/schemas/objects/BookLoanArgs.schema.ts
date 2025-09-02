import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanSelectObjectSchema } from './BookLoanSelect.schema';
import { BookLoanIncludeObjectSchema } from './BookLoanInclude.schema'

export const BookLoanArgsObjectSchema = z.object({
  select: z.lazy(() => BookLoanSelectObjectSchema).optional(),
  include: z.lazy(() => BookLoanIncludeObjectSchema).optional()
}).strict();
export const BookLoanArgsObjectZodSchema = z.object({
  select: z.lazy(() => BookLoanSelectObjectSchema).optional(),
  include: z.lazy(() => BookLoanIncludeObjectSchema).optional()
}).strict();
