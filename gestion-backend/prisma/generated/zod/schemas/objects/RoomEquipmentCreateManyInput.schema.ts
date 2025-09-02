import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomEquipmentCreateManyInputObjectSchema: z.ZodType<Prisma.RoomEquipmentCreateManyInput, z.ZodTypeDef, Prisma.RoomEquipmentCreateManyInput> = z.object({
  id: z.string().optional(),
  roomId: z.string(),
  name: z.string()
}).strict();
export const RoomEquipmentCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  roomId: z.string(),
  name: z.string()
}).strict();
