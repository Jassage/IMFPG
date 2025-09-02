import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomCreateNestedOneWithoutEquipmentInputObjectSchema } from './RoomCreateNestedOneWithoutEquipmentInput.schema'

export const RoomEquipmentCreateInputObjectSchema: z.ZodType<Prisma.RoomEquipmentCreateInput, z.ZodTypeDef, Prisma.RoomEquipmentCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  room: z.lazy(() => RoomCreateNestedOneWithoutEquipmentInputObjectSchema)
}).strict();
export const RoomEquipmentCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  room: z.lazy(() => RoomCreateNestedOneWithoutEquipmentInputObjectSchema)
}).strict();
