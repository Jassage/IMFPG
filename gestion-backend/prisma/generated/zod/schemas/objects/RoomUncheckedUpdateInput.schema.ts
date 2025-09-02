import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { RoomEquipmentUncheckedUpdateManyWithoutRoomNestedInputObjectSchema } from './RoomEquipmentUncheckedUpdateManyWithoutRoomNestedInput.schema';
import { RoomReservationUncheckedUpdateManyWithoutRoomNestedInputObjectSchema } from './RoomReservationUncheckedUpdateManyWithoutRoomNestedInput.schema'

export const RoomUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.RoomUncheckedUpdateInput, z.ZodTypeDef, Prisma.RoomUncheckedUpdateInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  capacity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  location: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  equipment: z.lazy(() => RoomEquipmentUncheckedUpdateManyWithoutRoomNestedInputObjectSchema).optional(),
  reservations: z.lazy(() => RoomReservationUncheckedUpdateManyWithoutRoomNestedInputObjectSchema).optional()
}).strict();
export const RoomUncheckedUpdateInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  capacity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  location: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  equipment: z.lazy(() => RoomEquipmentUncheckedUpdateManyWithoutRoomNestedInputObjectSchema).optional(),
  reservations: z.lazy(() => RoomReservationUncheckedUpdateManyWithoutRoomNestedInputObjectSchema).optional()
}).strict();
