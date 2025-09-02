import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationCountOutputTypeSelectObjectSchema } from './ScholarshipApplicationCountOutputTypeSelect.schema'

export const ScholarshipApplicationCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => ScholarshipApplicationCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ScholarshipApplicationCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => ScholarshipApplicationCountOutputTypeSelectObjectSchema).optional()
}).strict();
