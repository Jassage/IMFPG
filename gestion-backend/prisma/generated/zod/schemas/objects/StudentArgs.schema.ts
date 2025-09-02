import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentSelectObjectSchema } from './StudentSelect.schema';
import { StudentIncludeObjectSchema } from './StudentInclude.schema'

export const StudentArgsObjectSchema = z.object({
  select: z.lazy(() => StudentSelectObjectSchema).optional(),
  include: z.lazy(() => StudentIncludeObjectSchema).optional()
}).strict();
export const StudentArgsObjectZodSchema = z.object({
  select: z.lazy(() => StudentSelectObjectSchema).optional(),
  include: z.lazy(() => StudentIncludeObjectSchema).optional()
}).strict();
