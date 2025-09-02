import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { ScheduleArgsObjectSchema } from './ScheduleArgs.schema'

export const AttendanceSelectObjectSchema: z.ZodType<Prisma.AttendanceSelect, z.ZodTypeDef, Prisma.AttendanceSelect> = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  schedule: z.union([z.boolean(), z.lazy(() => ScheduleArgsObjectSchema)]).optional(),
  scheduleId: z.boolean().optional(),
  date: z.boolean().optional(),
  status: z.boolean().optional(),
  notes: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const AttendanceSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  schedule: z.union([z.boolean(), z.lazy(() => ScheduleArgsObjectSchema)]).optional(),
  scheduleId: z.boolean().optional(),
  date: z.boolean().optional(),
  status: z.boolean().optional(),
  notes: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
