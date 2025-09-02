import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurSelectObjectSchema } from './ProfesseurSelect.schema';
import { ProfesseurIncludeObjectSchema } from './ProfesseurInclude.schema'

export const ProfesseurArgsObjectSchema = z.object({
  select: z.lazy(() => ProfesseurSelectObjectSchema).optional(),
  include: z.lazy(() => ProfesseurIncludeObjectSchema).optional()
}).strict();
export const ProfesseurArgsObjectZodSchema = z.object({
  select: z.lazy(() => ProfesseurSelectObjectSchema).optional(),
  include: z.lazy(() => ProfesseurIncludeObjectSchema).optional()
}).strict();
