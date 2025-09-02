import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomEquipmentCreateManyRoomInputObjectSchema: z.ZodType<Prisma.RoomEquipmentCreateManyRoomInput, z.ZodTypeDef, Prisma.RoomEquipmentCreateManyRoomInput> = z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const RoomEquipmentCreateManyRoomInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
