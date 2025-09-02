import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomCountAggregateInputObjectSchema: z.ZodType<Prisma.RoomCountAggregateInputType, z.ZodTypeDef, Prisma.RoomCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  type: z.literal(true).optional(),
  capacity: z.literal(true).optional(),
  location: z.literal(true).optional(),
  status: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const RoomCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  type: z.literal(true).optional(),
  capacity: z.literal(true).optional(),
  location: z.literal(true).optional(),
  status: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
