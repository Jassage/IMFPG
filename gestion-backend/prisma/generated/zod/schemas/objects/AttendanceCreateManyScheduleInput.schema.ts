import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AttendanceCreateManyScheduleInputObjectSchema: z.ZodType<Prisma.AttendanceCreateManyScheduleInput, z.ZodTypeDef, Prisma.AttendanceCreateManyScheduleInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const AttendanceCreateManyScheduleInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
