import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomAvgAggregateInputObjectSchema: z.ZodType<Prisma.RoomAvgAggregateInputType, z.ZodTypeDef, Prisma.RoomAvgAggregateInputType> = z.object({
  capacity: z.literal(true).optional()
}).strict();
export const RoomAvgAggregateInputObjectZodSchema = z.object({
  capacity: z.literal(true).optional()
}).strict();
