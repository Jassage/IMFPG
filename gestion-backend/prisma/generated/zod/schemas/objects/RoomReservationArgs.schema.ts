import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomReservationSelectObjectSchema } from './RoomReservationSelect.schema';
import { RoomReservationIncludeObjectSchema } from './RoomReservationInclude.schema'

export const RoomReservationArgsObjectSchema = z.object({
  select: z.lazy(() => RoomReservationSelectObjectSchema).optional(),
  include: z.lazy(() => RoomReservationIncludeObjectSchema).optional()
}).strict();
export const RoomReservationArgsObjectZodSchema = z.object({
  select: z.lazy(() => RoomReservationSelectObjectSchema).optional(),
  include: z.lazy(() => RoomReservationIncludeObjectSchema).optional()
}).strict();
