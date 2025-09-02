import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCountOutputTypeSelectObjectSchema } from './StudentCountOutputTypeSelect.schema'

export const StudentCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => StudentCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const StudentCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => StudentCountOutputTypeSelectObjectSchema).optional()
}).strict();
