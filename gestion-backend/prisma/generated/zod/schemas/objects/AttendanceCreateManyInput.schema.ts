import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AttendanceCreateManyInputObjectSchema: z.ZodType<Prisma.AttendanceCreateManyInput, z.ZodTypeDef, Prisma.AttendanceCreateManyInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  scheduleId: z.string(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const AttendanceCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  scheduleId: z.string(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
