import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnalyticsSelectObjectSchema } from './AnalyticsSelect.schema'

export const AnalyticsArgsObjectSchema = z.object({
  select: z.lazy(() => AnalyticsSelectObjectSchema).optional()
}).strict();
export const AnalyticsArgsObjectZodSchema = z.object({
  select: z.lazy(() => AnalyticsSelectObjectSchema).optional()
}).strict();
