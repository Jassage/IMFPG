import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const RoomEquipmentUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.RoomEquipmentUncheckedUpdateInput, z.ZodTypeDef, Prisma.RoomEquipmentUncheckedUpdateInput> = z.object({
  roomId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const RoomEquipmentUncheckedUpdateInputObjectZodSchema = z.object({
  roomId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
