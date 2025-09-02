import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AttendanceMaxAggregateInputObjectSchema: z.ZodType<Prisma.AttendanceMaxAggregateInputType, z.ZodTypeDef, Prisma.AttendanceMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  scheduleId: z.literal(true).optional(),
  date: z.literal(true).optional(),
  status: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const AttendanceMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  scheduleId: z.literal(true).optional(),
  date: z.literal(true).optional(),
  status: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
