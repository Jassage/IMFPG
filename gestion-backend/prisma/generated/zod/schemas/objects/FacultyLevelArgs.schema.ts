import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelSelectObjectSchema } from './FacultyLevelSelect.schema';
import { FacultyLevelIncludeObjectSchema } from './FacultyLevelInclude.schema'

export const FacultyLevelArgsObjectSchema = z.object({
  select: z.lazy(() => FacultyLevelSelectObjectSchema).optional(),
  include: z.lazy(() => FacultyLevelIncludeObjectSchema).optional()
}).strict();
export const FacultyLevelArgsObjectZodSchema = z.object({
  select: z.lazy(() => FacultyLevelSelectObjectSchema).optional(),
  include: z.lazy(() => FacultyLevelIncludeObjectSchema).optional()
}).strict();
