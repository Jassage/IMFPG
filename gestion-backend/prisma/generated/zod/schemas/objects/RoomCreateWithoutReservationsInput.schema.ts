import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentCreateNestedManyWithoutRoomInputObjectSchema } from './RoomEquipmentCreateNestedManyWithoutRoomInput.schema'

export const RoomCreateWithoutReservationsInputObjectSchema: z.ZodType<Prisma.RoomCreateWithoutReservationsInput, z.ZodTypeDef, Prisma.RoomCreateWithoutReservationsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string(),
  equipment: z.lazy(() => RoomEquipmentCreateNestedManyWithoutRoomInputObjectSchema).optional()
}).strict();
export const RoomCreateWithoutReservationsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string(),
  equipment: z.lazy(() => RoomEquipmentCreateNestedManyWithoutRoomInputObjectSchema).optional()
}).strict();
