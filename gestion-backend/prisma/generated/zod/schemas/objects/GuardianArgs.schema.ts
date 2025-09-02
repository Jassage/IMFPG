import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GuardianSelectObjectSchema } from './GuardianSelect.schema';
import { GuardianIncludeObjectSchema } from './GuardianInclude.schema'

export const GuardianArgsObjectSchema = z.object({
  select: z.lazy(() => GuardianSelectObjectSchema).optional(),
  include: z.lazy(() => GuardianIncludeObjectSchema).optional()
}).strict();
export const GuardianArgsObjectZodSchema = z.object({
  select: z.lazy(() => GuardianSelectObjectSchema).optional(),
  include: z.lazy(() => GuardianIncludeObjectSchema).optional()
}).strict();
