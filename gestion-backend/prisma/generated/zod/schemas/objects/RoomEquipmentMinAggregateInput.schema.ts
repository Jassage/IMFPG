import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomEquipmentMinAggregateInputObjectSchema: z.ZodType<Prisma.RoomEquipmentMinAggregateInputType, z.ZodTypeDef, Prisma.RoomEquipmentMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  roomId: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
export const RoomEquipmentMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  roomId: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
