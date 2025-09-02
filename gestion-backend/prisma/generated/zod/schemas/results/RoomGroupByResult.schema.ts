import { z } from 'zod';
export const RoomGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().int(),
  location: z.string(),
  status: z.string(),
  _count: z.object({
    id: z.number(),
    name: z.number(),
    type: z.number(),
    capacity: z.number(),
    equipment: z.number(),
    location: z.number(),
    status: z.number(),
    reservations: z.number()
  }).optional(),
  _sum: z.object({
    capacity: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    capacity: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    type: z.string().nullable(),
    capacity: z.number().int().nullable(),
    location: z.string().nullable(),
    status: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    type: z.string().nullable(),
    capacity: z.number().int().nullable(),
    location: z.string().nullable(),
    status: z.string().nullable()
  }).nullable().optional()
}));