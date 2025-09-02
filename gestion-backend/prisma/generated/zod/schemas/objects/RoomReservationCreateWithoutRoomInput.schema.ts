import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomReservationCreateWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomReservationCreateWithoutRoomInput, z.ZodTypeDef, Prisma.RoomReservationCreateWithoutRoomInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string().nullish(),
  status: z.string()
}).strict();
export const RoomReservationCreateWithoutRoomInputObjectZodSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string().nullish(),
  status: z.string()
}).strict();
