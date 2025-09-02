import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyCountOutputTypeSelectObjectSchema } from './FacultyCountOutputTypeSelect.schema'

export const FacultyCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => FacultyCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const FacultyCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => FacultyCountOutputTypeSelectObjectSchema).optional()
}).strict();
