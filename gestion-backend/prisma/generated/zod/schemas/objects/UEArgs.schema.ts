import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UESelectObjectSchema } from './UESelect.schema';
import { UEIncludeObjectSchema } from './UEInclude.schema'

export const UEArgsObjectSchema = z.object({
  select: z.lazy(() => UESelectObjectSchema).optional(),
  include: z.lazy(() => UEIncludeObjectSchema).optional()
}).strict();
export const UEArgsObjectZodSchema = z.object({
  select: z.lazy(() => UESelectObjectSchema).optional(),
  include: z.lazy(() => UEIncludeObjectSchema).optional()
}).strict();
