import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomReservationCreateManyRoomInputObjectSchema: z.ZodType<Prisma.RoomReservationCreateManyRoomInput, z.ZodTypeDef, Prisma.RoomReservationCreateManyRoomInput> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string().nullish(),
  status: z.string()
}).strict();
export const RoomReservationCreateManyRoomInputObjectZodSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string().nullish(),
  status: z.string()
}).strict();
