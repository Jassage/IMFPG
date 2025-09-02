import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelCountOutputTypeSelectObjectSchema } from './FacultyLevelCountOutputTypeSelect.schema'

export const FacultyLevelCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => FacultyLevelCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const FacultyLevelCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => FacultyLevelCountOutputTypeSelectObjectSchema).optional()
}).strict();
