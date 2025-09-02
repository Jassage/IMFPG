import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomMinAggregateInputObjectSchema: z.ZodType<Prisma.RoomMinAggregateInputType, z.ZodTypeDef, Prisma.RoomMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  type: z.literal(true).optional(),
  capacity: z.literal(true).optional(),
  location: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
export const RoomMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  type: z.literal(true).optional(),
  capacity: z.literal(true).optional(),
  location: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
