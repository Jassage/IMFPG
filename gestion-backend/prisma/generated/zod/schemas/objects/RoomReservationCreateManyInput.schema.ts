import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomReservationCreateManyInputObjectSchema: z.ZodType<Prisma.RoomReservationCreateManyInput, z.ZodTypeDef, Prisma.RoomReservationCreateManyInput> = z.object({
  id: z.string().optional(),
  roomId: z.string(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string().nullish(),
  status: z.string()
}).strict();
export const RoomReservationCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  roomId: z.string(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string().nullish(),
  status: z.string()
}).strict();
