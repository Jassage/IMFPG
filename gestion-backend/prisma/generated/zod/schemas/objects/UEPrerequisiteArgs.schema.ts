import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteSelectObjectSchema } from './UEPrerequisiteSelect.schema';
import { UEPrerequisiteIncludeObjectSchema } from './UEPrerequisiteInclude.schema'

export const UEPrerequisiteArgsObjectSchema = z.object({
  select: z.lazy(() => UEPrerequisiteSelectObjectSchema).optional(),
  include: z.lazy(() => UEPrerequisiteIncludeObjectSchema).optional()
}).strict();
export const UEPrerequisiteArgsObjectZodSchema = z.object({
  select: z.lazy(() => UEPrerequisiteSelectObjectSchema).optional(),
  include: z.lazy(() => UEPrerequisiteIncludeObjectSchema).optional()
}).strict();
