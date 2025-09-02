import { z } from 'zod';
export const RoomReservationAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    room: z.number(),
    roomId: z.number(),
    userId: z.number(),
    startTime: z.number(),
    endTime: z.number(),
    purpose: z.number(),
    status: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    roomId: z.string().nullable(),
    userId: z.string().nullable(),
    startTime: z.date().nullable(),
    endTime: z.date().nullable(),
    purpose: z.string().nullable(),
    status: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    roomId: z.string().nullable(),
    userId: z.string().nullable(),
    startTime: z.date().nullable(),
    endTime: z.date().nullable(),
    purpose: z.string().nullable(),
    status: z.string().nullable()
  }).nullable().optional()});