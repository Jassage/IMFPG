import { z } from 'zod';
export const RoomEquipmentGroupByResultSchema = z.array(z.object({
  id: z.string(),
  roomId: z.string(),
  name: z.string(),
  _count: z.object({
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
  }).nullable().optional()
}));