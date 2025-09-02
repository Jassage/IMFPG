import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomCreateNestedOneWithoutReservationsInputObjectSchema } from './RoomCreateNestedOneWithoutReservationsInput.schema'

export const RoomReservationCreateInputObjectSchema: z.ZodType<Prisma.RoomReservationCreateInput, z.ZodTypeDef, Prisma.RoomReservationCreateInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string().nullish(),
  status: z.string(),
  room: z.lazy(() => RoomCreateNestedOneWithoutReservationsInputObjectSchema)
}).strict();
export const RoomReservationCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string().nullish(),
  status: z.string(),
  room: z.lazy(() => RoomCreateNestedOneWithoutReservationsInputObjectSchema)
}).strict();
