import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { RoomEquipmentUpdateManyWithoutRoomNestedInputObjectSchema } from './RoomEquipmentUpdateManyWithoutRoomNestedInput.schema';
import { RoomReservationUpdateManyWithoutRoomNestedInputObjectSchema } from './RoomReservationUpdateManyWithoutRoomNestedInput.schema'

export const RoomUpdateInputObjectSchema: z.ZodType<Prisma.RoomUpdateInput, z.ZodTypeDef, Prisma.RoomUpdateInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  capacity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  location: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  equipment: z.lazy(() => RoomEquipmentUpdateManyWithoutRoomNestedInputObjectSchema).optional(),
  reservations: z.lazy(() => RoomReservationUpdateManyWithoutRoomNestedInputObjectSchema).optional()
}).strict();
export const RoomUpdateInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  capacity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  location: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  equipment: z.lazy(() => RoomEquipmentUpdateManyWithoutRoomNestedInputObjectSchema).optional(),
  reservations: z.lazy(() => RoomReservationUpdateManyWithoutRoomNestedInputObjectSchema).optional()
}).strict();
