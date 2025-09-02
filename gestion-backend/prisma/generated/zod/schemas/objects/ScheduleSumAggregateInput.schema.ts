import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScheduleSumAggregateInputObjectSchema: z.ZodType<Prisma.ScheduleSumAggregateInputType, z.ZodTypeDef, Prisma.ScheduleSumAggregateInputType> = z.object({
  dayOfWeek: z.literal(true).optional()
}).strict();
export const ScheduleSumAggregateInputObjectZodSchema = z.object({
  dayOfWeek: z.literal(true).optional()
}).strict();
