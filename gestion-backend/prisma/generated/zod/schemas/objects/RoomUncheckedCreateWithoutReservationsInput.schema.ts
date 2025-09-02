import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentUncheckedCreateNestedManyWithoutRoomInputObjectSchema } from './RoomEquipmentUncheckedCreateNestedManyWithoutRoomInput.schema'

export const RoomUncheckedCreateWithoutReservationsInputObjectSchema: z.ZodType<Prisma.RoomUncheckedCreateWithoutReservationsInput, z.ZodTypeDef, Prisma.RoomUncheckedCreateWithoutReservationsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string(),
  equipment: z.lazy(() => RoomEquipmentUncheckedCreateNestedManyWithoutRoomInputObjectSchema).optional()
}).strict();
export const RoomUncheckedCreateWithoutReservationsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string(),
  equipment: z.lazy(() => RoomEquipmentUncheckedCreateNestedManyWithoutRoomInputObjectSchema).optional()
}).strict();
