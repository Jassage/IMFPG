import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomArgsObjectSchema } from './RoomArgs.schema'

export const RoomReservationIncludeObjectSchema: z.ZodType<Prisma.RoomReservationInclude, z.ZodTypeDef, Prisma.RoomReservationInclude> = z.object({
  room: z.union([z.boolean(), z.lazy(() => RoomArgsObjectSchema)]).optional()
}).strict();
export const RoomReservationIncludeObjectZodSchema = z.object({
  room: z.union([z.boolean(), z.lazy(() => RoomArgsObjectSchema)]).optional()
}).strict();
