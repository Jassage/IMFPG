import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurCountOutputTypeSelectObjectSchema } from './ProfesseurCountOutputTypeSelect.schema'

export const ProfesseurCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => ProfesseurCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ProfesseurCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => ProfesseurCountOutputTypeSelectObjectSchema).optional()
}).strict();
