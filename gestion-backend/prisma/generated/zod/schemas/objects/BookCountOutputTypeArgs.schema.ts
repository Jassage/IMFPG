import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookCountOutputTypeSelectObjectSchema } from './BookCountOutputTypeSelect.schema'

export const BookCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => BookCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const BookCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => BookCountOutputTypeSelectObjectSchema).optional()
}).strict();
