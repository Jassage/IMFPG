import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const RoomEquipmentUpdateWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomEquipmentUpdateWithoutRoomInput, z.ZodTypeDef, Prisma.RoomEquipmentUpdateWithoutRoomInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const RoomEquipmentUpdateWithoutRoomInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
