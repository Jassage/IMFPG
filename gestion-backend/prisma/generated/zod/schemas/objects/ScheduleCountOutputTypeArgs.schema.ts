import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleCountOutputTypeSelectObjectSchema } from './ScheduleCountOutputTypeSelect.schema'

export const ScheduleCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => ScheduleCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ScheduleCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => ScheduleCountOutputTypeSelectObjectSchema).optional()
}).strict();
