import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const RoomEquipmentUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.RoomEquipmentUncheckedUpdateManyInput, z.ZodTypeDef, Prisma.RoomEquipmentUncheckedUpdateManyInput> = z.object({
  roomId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const RoomEquipmentUncheckedUpdateManyInputObjectZodSchema = z.object({
  roomId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
