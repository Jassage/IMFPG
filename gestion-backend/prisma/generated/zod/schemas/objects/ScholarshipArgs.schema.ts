import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipSelectObjectSchema } from './ScholarshipSelect.schema';
import { ScholarshipIncludeObjectSchema } from './ScholarshipInclude.schema'

export const ScholarshipArgsObjectSchema = z.object({
  select: z.lazy(() => ScholarshipSelectObjectSchema).optional(),
  include: z.lazy(() => ScholarshipIncludeObjectSchema).optional()
}).strict();
export const ScholarshipArgsObjectZodSchema = z.object({
  select: z.lazy(() => ScholarshipSelectObjectSchema).optional(),
  include: z.lazy(() => ScholarshipIncludeObjectSchema).optional()
}).strict();
