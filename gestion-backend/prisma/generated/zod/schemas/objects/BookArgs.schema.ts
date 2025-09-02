import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookSelectObjectSchema } from './BookSelect.schema';
import { BookIncludeObjectSchema } from './BookInclude.schema'

export const BookArgsObjectSchema = z.object({
  select: z.lazy(() => BookSelectObjectSchema).optional(),
  include: z.lazy(() => BookIncludeObjectSchema).optional()
}).strict();
export const BookArgsObjectZodSchema = z.object({
  select: z.lazy(() => BookSelectObjectSchema).optional(),
  include: z.lazy(() => BookIncludeObjectSchema).optional()
}).strict();
