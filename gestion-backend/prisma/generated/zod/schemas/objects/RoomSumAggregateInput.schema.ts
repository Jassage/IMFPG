import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomSumAggregateInputObjectSchema: z.ZodType<Prisma.RoomSumAggregateInputType, z.ZodTypeDef, Prisma.RoomSumAggregateInputType> = z.object({
  capacity: z.literal(true).optional()
}).strict();
export const RoomSumAggregateInputObjectZodSchema = z.object({
  capacity: z.literal(true).optional()
}).strict();
