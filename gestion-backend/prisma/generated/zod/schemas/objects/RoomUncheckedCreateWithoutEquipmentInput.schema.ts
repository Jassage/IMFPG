import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomReservationUncheckedCreateNestedManyWithoutRoomInputObjectSchema } from './RoomReservationUncheckedCreateNestedManyWithoutRoomInput.schema'

export const RoomUncheckedCreateWithoutEquipmentInputObjectSchema: z.ZodType<Prisma.RoomUncheckedCreateWithoutEquipmentInput, z.ZodTypeDef, Prisma.RoomUncheckedCreateWithoutEquipmentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string(),
  reservations: z.lazy(() => RoomReservationUncheckedCreateNestedManyWithoutRoomInputObjectSchema).optional()
}).strict();
export const RoomUncheckedCreateWithoutEquipmentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string(),
  reservations: z.lazy(() => RoomReservationUncheckedCreateNestedManyWithoutRoomInputObjectSchema).optional()
}).strict();
