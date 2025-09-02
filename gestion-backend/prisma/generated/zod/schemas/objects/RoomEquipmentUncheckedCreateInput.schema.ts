import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomEquipmentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.RoomEquipmentUncheckedCreateInput, z.ZodTypeDef, Prisma.RoomEquipmentUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  roomId: z.string(),
  name: z.string()
}).strict();
export const RoomEquipmentUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  roomId: z.string(),
  name: z.string()
}).strict();
