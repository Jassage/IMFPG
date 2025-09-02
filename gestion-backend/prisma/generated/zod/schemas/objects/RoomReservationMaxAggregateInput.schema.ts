import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomReservationMaxAggregateInputObjectSchema: z.ZodType<Prisma.RoomReservationMaxAggregateInputType, z.ZodTypeDef, Prisma.RoomReservationMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  roomId: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  startTime: z.literal(true).optional(),
  endTime: z.literal(true).optional(),
  purpose: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
export const RoomReservationMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  roomId: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  startTime: z.literal(true).optional(),
  endTime: z.literal(true).optional(),
  purpose: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
