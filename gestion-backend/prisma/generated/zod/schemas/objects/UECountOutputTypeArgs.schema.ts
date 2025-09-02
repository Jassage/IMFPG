import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECountOutputTypeSelectObjectSchema } from './UECountOutputTypeSelect.schema'

export const UECountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => UECountOutputTypeSelectObjectSchema).optional()
}).strict();
export const UECountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => UECountOutputTypeSelectObjectSchema).optional()
}).strict();
