import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomReservationUncheckedCreateWithoutRoomInputObjectSchema: z.ZodType<Prisma.RoomReservationUncheckedCreateWithoutRoomInput, z.ZodTypeDef, Prisma.RoomReservationUncheckedCreateWithoutRoomInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string().nullish(),
  status: z.string()
}).strict();
export const RoomReservationUncheckedCreateWithoutRoomInputObjectZodSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string().nullish(),
  status: z.string()
}).strict();
