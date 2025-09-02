import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomEquipmentWhereUniqueInputObjectSchema: z.ZodType<Prisma.RoomEquipmentWhereUniqueInput, z.ZodTypeDef, Prisma.RoomEquipmentWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const RoomEquipmentWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
