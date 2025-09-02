import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomReservationCreateNestedManyWithoutRoomInputObjectSchema } from './RoomReservationCreateNestedManyWithoutRoomInput.schema'

export const RoomCreateWithoutEquipmentInputObjectSchema: z.ZodType<Prisma.RoomCreateWithoutEquipmentInput, z.ZodTypeDef, Prisma.RoomCreateWithoutEquipmentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string(),
  reservations: z.lazy(() => RoomReservationCreateNestedManyWithoutRoomInputObjectSchema).optional()
}).strict();
export const RoomCreateWithoutEquipmentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string(),
  reservations: z.lazy(() => RoomReservationCreateNestedManyWithoutRoomInputObjectSchema).optional()
}).strict();
