import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentCreateNestedManyWithoutRoomInputObjectSchema } from './RoomEquipmentCreateNestedManyWithoutRoomInput.schema';
import { RoomReservationCreateNestedManyWithoutRoomInputObjectSchema } from './RoomReservationCreateNestedManyWithoutRoomInput.schema'

export const RoomCreateInputObjectSchema: z.ZodType<Prisma.RoomCreateInput, z.ZodTypeDef, Prisma.RoomCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string(),
  equipment: z.lazy(() => RoomEquipmentCreateNestedManyWithoutRoomInputObjectSchema).optional(),
  reservations: z.lazy(() => RoomReservationCreateNestedManyWithoutRoomInputObjectSchema).optional()
}).strict();
export const RoomCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string().nullish(),
  status: z.string(),
  equipment: z.lazy(() => RoomEquipmentCreateNestedManyWithoutRoomInputObjectSchema).optional(),
  reservations: z.lazy(() => RoomReservationCreateNestedManyWithoutRoomInputObjectSchema).optional()
}).strict();
