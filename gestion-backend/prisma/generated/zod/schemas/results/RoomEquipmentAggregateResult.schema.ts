import { z } from 'zod';
export const RoomEquipmentAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    roomId: z.number(),
    room: z.number(),
    name: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    roomId: z.string().nullable(),
    name: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    roomId: z.string().nullable(),
    name: z.string().nullable()
  }).nullable().optional()});