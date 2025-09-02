import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentUncheckedCreateNestedManyWithoutRoomInputObjectSchema } from './RoomEquipmentUncheckedCreateNestedManyWithoutRoomInput.schema';
import { RoomReservationUncheckedCreateNestedManyWithoutRoomInputObjectSchema } from './RoomReservationUncheckedCreateNestedManyWithoutRoomInput.schema'

export const RoomUncheckedCreateInputObjectSchema: z.ZodType<Prisma.RoomUncheckedCreateInput, z.ZodTypeDef, Prisma.RoomUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string(),
  equipment: z.lazy(() => RoomEquipmentUncheckedCreateNestedManyWithoutRoomInputObjectSchema).optional(),
  reservations: z.lazy(() => RoomReservationUncheckedCreateNestedManyWithoutRoomInputObjectSchema).optional()
}).strict();
export const RoomUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string(),
  equipment: z.lazy(() => RoomEquipmentUncheckedCreateNestedManyWithoutRoomInputObjectSchema).optional(),
  reservations: z.lazy(() => RoomReservationUncheckedCreateNestedManyWithoutRoomInputObjectSchema).optional()
}).strict();
