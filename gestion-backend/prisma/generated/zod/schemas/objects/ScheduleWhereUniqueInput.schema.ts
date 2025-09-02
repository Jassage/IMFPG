import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScheduleWhereUniqueInputObjectSchema: z.ZodType<Prisma.ScheduleWhereUniqueInput, z.ZodTypeDef, Prisma.ScheduleWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const ScheduleWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
