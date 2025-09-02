import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomEquipmentMaxAggregateInputObjectSchema: z.ZodType<Prisma.RoomEquipmentMaxAggregateInputType, z.ZodTypeDef, Prisma.RoomEquipmentMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  roomId: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
export const RoomEquipmentMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  roomId: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
