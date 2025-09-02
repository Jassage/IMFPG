import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AttendanceCreateManyStudentInputObjectSchema: z.ZodType<Prisma.AttendanceCreateManyStudentInput, z.ZodTypeDef, Prisma.AttendanceCreateManyStudentInput> = z.object({
  id: z.string().optional(),
  scheduleId: z.string(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const AttendanceCreateManyStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  scheduleId: z.string(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
