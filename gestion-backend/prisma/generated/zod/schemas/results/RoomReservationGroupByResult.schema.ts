import { z } from 'zod';
export const RoomReservationGroupByResultSchema = z.array(z.object({
  id: z.string(),
  roomId: z.string(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  purpose: z.string(),
  status: z.string(),
  _count: z.object({
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
  }).nullable().optional()
}));