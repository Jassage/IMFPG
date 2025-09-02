import { z } from 'zod';
export const ScheduleGroupByResultSchema = z.array(z.object({
  id: z.string(),
  assignmentId: z.string(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string(),
  recurrence: z.string(),
  exceptions: z.unknown(),
  professeurId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    assignment: z.number(),
    assignmentId: z.number(),
    dayOfWeek: z.number(),
    startTime: z.number(),
    endTime: z.number(),
    classroom: z.number(),
    recurrence: z.number(),
    exceptions: z.number(),
    professeur: z.number(),
    professeurId: z.number(),
    attendances: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _sum: z.object({
    dayOfWeek: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    dayOfWeek: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    assignmentId: z.string().nullable(),
    dayOfWeek: z.number().int().nullable(),
    startTime: z.string().nullable(),
    endTime: z.string().nullable(),
    classroom: z.string().nullable(),
    recurrence: z.string().nullable(),
    professeurId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    assignmentId: z.string().nullable(),
    dayOfWeek: z.number().int().nullable(),
    startTime: z.string().nullable(),
    endTime: z.string().nullable(),
    classroom: z.string().nullable(),
    recurrence: z.string().nullable(),
    professeurId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));