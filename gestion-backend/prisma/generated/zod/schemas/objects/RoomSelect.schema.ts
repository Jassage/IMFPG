import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentFindManySchema } from '../findManyRoomEquipment.schema';
import { RoomReservationFindManySchema } from '../findManyRoomReservation.schema';
import { RoomCountOutputTypeArgsObjectSchema } from './RoomCountOutputTypeArgs.schema'

export const RoomSelectObjectSchema: z.ZodType<Prisma.RoomSelect, z.ZodTypeDef, Prisma.RoomSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  type: z.boolean().optional(),
  capacity: z.boolean().optional(),
  equipment: z.union([z.boolean(), z.lazy(() => RoomEquipmentFindManySchema)]).optional(),
  location: z.boolean().optional(),
  status: z.boolean().optional(),
  reservations: z.union([z.boolean(), z.lazy(() => RoomReservationFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => RoomCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const RoomSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  type: z.boolean().optional(),
  capacity: z.boolean().optional(),
  equipment: z.union([z.boolean(), z.lazy(() => RoomEquipmentFindManySchema)]).optional(),
  location: z.boolean().optional(),
  status: z.boolean().optional(),
  reservations: z.union([z.boolean(), z.lazy(() => RoomReservationFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => RoomCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
