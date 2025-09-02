import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AttendanceCountAggregateInputObjectSchema: z.ZodType<Prisma.AttendanceCountAggregateInputType, z.ZodTypeDef, Prisma.AttendanceCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  scheduleId: z.literal(true).optional(),
  date: z.literal(true).optional(),
  status: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const AttendanceCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  scheduleId: z.literal(true).optional(),
  date: z.literal(true).optional(),
  status: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
