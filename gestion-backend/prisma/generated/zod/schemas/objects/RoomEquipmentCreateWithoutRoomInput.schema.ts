import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomEquipmentCreateWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomEquipmentCreateWithoutRoomInput, z.ZodTypeDef, Prisma.RoomEquipmentCreateWithoutRoomInput> = z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const RoomEquipmentCreateWithoutRoomInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
