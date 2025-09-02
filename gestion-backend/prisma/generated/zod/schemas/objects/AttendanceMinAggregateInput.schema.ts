import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AttendanceMinAggregateInputObjectSchema: z.ZodType<Prisma.AttendanceMinAggregateInputType, z.ZodTypeDef, Prisma.AttendanceMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  scheduleId: z.literal(true).optional(),
  date: z.literal(true).optional(),
  status: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const AttendanceMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  scheduleId: z.literal(true).optional(),
  date: z.literal(true).optional(),
  status: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
