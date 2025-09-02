import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipCountOutputTypeSelectObjectSchema } from './ScholarshipCountOutputTypeSelect.schema'

export const ScholarshipCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => ScholarshipCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ScholarshipCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => ScholarshipCountOutputTypeSelectObjectSchema).optional()
}).strict();
