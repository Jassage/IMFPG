import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomArgsObjectSchema } from './RoomArgs.schema'

export const RoomReservationSelectObjectSchema: z.ZodType<Prisma.RoomReservationSelect, z.ZodTypeDef, Prisma.RoomReservationSelect> = z.object({
  id: z.boolean().optional(),
  room: z.union([z.boolean(), z.lazy(() => RoomArgsObjectSchema)]).optional(),
  roomId: z.boolean().optional(),
  userId: z.boolean().optional(),
  startTime: z.boolean().optional(),
  endTime: z.boolean().optional(),
  purpose: z.boolean().optional(),
  status: z.boolean().optional()
}).strict();
export const RoomReservationSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  room: z.union([z.boolean(), z.lazy(() => RoomArgsObjectSchema)]).optional(),
  roomId: z.boolean().optional(),
  userId: z.boolean().optional(),
  startTime: z.boolean().optional(),
  endTime: z.boolean().optional(),
  purpose: z.boolean().optional(),
  status: z.boolean().optional()
}).strict();
