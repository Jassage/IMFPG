import { z } from 'zod';
export const AttendanceAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    student: z.number(),
    studentId: z.number(),
    schedule: z.number(),
    scheduleId: z.number(),
    date: z.number(),
    status: z.number(),
    notes: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    scheduleId: z.string().nullable(),
    date: z.date().nullable(),
    status: z.string().nullable(),
    notes: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    studentId: z.string().nullable(),
    scheduleId: z.string().nullable(),
    date: z.date().nullable(),
    status: z.string().nullable(),
    notes: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});