import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomEquipmentCountAggregateInputObjectSchema: z.ZodType<Prisma.RoomEquipmentCountAggregateInputType, z.ZodTypeDef, Prisma.RoomEquipmentCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  roomId: z.literal(true).optional(),
  name: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const RoomEquipmentCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  roomId: z.literal(true).optional(),
  name: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
