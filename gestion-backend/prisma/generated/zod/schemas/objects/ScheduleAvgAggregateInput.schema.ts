import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScheduleAvgAggregateInputObjectSchema: z.ZodType<Prisma.ScheduleAvgAggregateInputType, z.ZodTypeDef, Prisma.ScheduleAvgAggregateInputType> = z.object({
  dayOfWeek: z.literal(true).optional()
}).strict();
export const ScheduleAvgAggregateInputObjectZodSchema = z.object({
  dayOfWeek: z.literal(true).optional()
}).strict();
