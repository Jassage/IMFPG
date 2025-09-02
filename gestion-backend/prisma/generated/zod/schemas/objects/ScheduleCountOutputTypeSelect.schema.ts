import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScheduleCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ScheduleCountOutputTypeSelect, z.ZodTypeDef, Prisma.ScheduleCountOutputTypeSelect> = z.object({
  attendances: z.boolean().optional()
}).strict();
export const ScheduleCountOutputTypeSelectObjectZodSchema = z.object({
  attendances: z.boolean().optional()
}).strict();
