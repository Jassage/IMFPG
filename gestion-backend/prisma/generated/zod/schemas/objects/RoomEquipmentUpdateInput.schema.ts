import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { RoomUpdateOneRequiredWithoutEquipmentNestedInputObjectSchema } from './RoomUpdateOneRequiredWithoutEquipmentNestedInput.schema'

export const RoomEquipmentUpdateInputObjectSchema: z.ZodType<Prisma.RoomEquipmentUpdateInput, z.ZodTypeDef, Prisma.RoomEquipmentUpdateInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  room: z.lazy(() => RoomUpdateOneRequiredWithoutEquipmentNestedInputObjectSchema).optional()
}).strict();
export const RoomEquipmentUpdateInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  room: z.lazy(() => RoomUpdateOneRequiredWithoutEquipmentNestedInputObjectSchema).optional()
}).strict();
