import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentFindManySchema } from '../findManyRoomEquipment.schema';
import { RoomReservationFindManySchema } from '../findManyRoomReservation.schema';
import { RoomCountOutputTypeArgsObjectSchema } from './RoomCountOutputTypeArgs.schema'

export const RoomIncludeObjectSchema: z.ZodType<Prisma.RoomInclude, z.ZodTypeDef, Prisma.RoomInclude> = z.object({
  equipment: z.union([z.boolean(), z.lazy(() => RoomEquipmentFindManySchema)]).optional(),
  reservations: z.union([z.boolean(), z.lazy(() => RoomReservationFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => RoomCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const RoomIncludeObjectZodSchema = z.object({
  equipment: z.union([z.boolean(), z.lazy(() => RoomEquipmentFindManySchema)]).optional(),
  reservations: z.union([z.boolean(), z.lazy(() => RoomReservationFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => RoomCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
