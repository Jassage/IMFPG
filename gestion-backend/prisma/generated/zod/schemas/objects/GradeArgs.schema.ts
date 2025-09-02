import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeSelectObjectSchema } from './GradeSelect.schema';
import { GradeIncludeObjectSchema } from './GradeInclude.schema'

export const GradeArgsObjectSchema = z.object({
  select: z.lazy(() => GradeSelectObjectSchema).optional(),
  include: z.lazy(() => GradeIncludeObjectSchema).optional()
}).strict();
export const GradeArgsObjectZodSchema = z.object({
  select: z.lazy(() => GradeSelectObjectSchema).optional(),
  include: z.lazy(() => GradeIncludeObjectSchema).optional()
}).strict();
