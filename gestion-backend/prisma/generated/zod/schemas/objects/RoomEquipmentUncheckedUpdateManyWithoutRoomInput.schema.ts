import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const RoomEquipmentUncheckedUpdateManyWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomEquipmentUncheckedUpdateManyWithoutRoomInput, z.ZodTypeDef, Prisma.RoomEquipmentUncheckedUpdateManyWithoutRoomInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const RoomEquipmentUncheckedUpdateManyWithoutRoomInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
