import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleSelectObjectSchema } from './ScheduleSelect.schema';
import { ScheduleIncludeObjectSchema } from './ScheduleInclude.schema'

export const ScheduleArgsObjectSchema = z.object({
  select: z.lazy(() => ScheduleSelectObjectSchema).optional(),
  include: z.lazy(() => ScheduleIncludeObjectSchema).optional()
}).strict();
export const ScheduleArgsObjectZodSchema = z.object({
  select: z.lazy(() => ScheduleSelectObjectSchema).optional(),
  include: z.lazy(() => ScheduleIncludeObjectSchema).optional()
}).strict();
