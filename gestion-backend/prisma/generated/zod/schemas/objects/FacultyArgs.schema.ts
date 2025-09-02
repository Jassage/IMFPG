import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultySelectObjectSchema } from './FacultySelect.schema';
import { FacultyIncludeObjectSchema } from './FacultyInclude.schema'

export const FacultyArgsObjectSchema = z.object({
  select: z.lazy(() => FacultySelectObjectSchema).optional(),
  include: z.lazy(() => FacultyIncludeObjectSchema).optional()
}).strict();
export const FacultyArgsObjectZodSchema = z.object({
  select: z.lazy(() => FacultySelectObjectSchema).optional(),
  include: z.lazy(() => FacultyIncludeObjectSchema).optional()
}).strict();
