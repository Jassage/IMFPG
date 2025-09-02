import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScheduleMinAggregateInputObjectSchema: z.ZodType<Prisma.ScheduleMinAggregateInputType, z.ZodTypeDef, Prisma.ScheduleMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  assignmentId: z.literal(true).optional(),
  dayOfWeek: z.literal(true).optional(),
  startTime: z.literal(true).optional(),
  endTime: z.literal(true).optional(),
  classroom: z.literal(true).optional(),
  recurrence: z.literal(true).optional(),
  professeurId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ScheduleMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  assignmentId: z.literal(true).optional(),
  dayOfWeek: z.literal(true).optional(),
  startTime: z.literal(true).optional(),
  endTime: z.literal(true).optional(),
  classroom: z.literal(true).optional(),
  recurrence: z.literal(true).optional(),
  professeurId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
