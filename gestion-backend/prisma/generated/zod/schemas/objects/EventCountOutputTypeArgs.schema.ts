import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventCountOutputTypeSelectObjectSchema } from './EventCountOutputTypeSelect.schema'

export const EventCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => EventCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const EventCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => EventCountOutputTypeSelectObjectSchema).optional()
}).strict();
