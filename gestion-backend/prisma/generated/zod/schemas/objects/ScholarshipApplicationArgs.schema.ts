import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationSelectObjectSchema } from './ScholarshipApplicationSelect.schema';
import { ScholarshipApplicationIncludeObjectSchema } from './ScholarshipApplicationInclude.schema'

export const ScholarshipApplicationArgsObjectSchema = z.object({
  select: z.lazy(() => ScholarshipApplicationSelectObjectSchema).optional(),
  include: z.lazy(() => ScholarshipApplicationIncludeObjectSchema).optional()
}).strict();
export const ScholarshipApplicationArgsObjectZodSchema = z.object({
  select: z.lazy(() => ScholarshipApplicationSelectObjectSchema).optional(),
  include: z.lazy(() => ScholarshipApplicationIncludeObjectSchema).optional()
}).strict();
