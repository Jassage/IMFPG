import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AttendanceUncheckedCreateWithoutScheduleInputObjectSchema: z.ZodType<Prisma.AttendanceUncheckedCreateWithoutScheduleInput, z.ZodTypeDef, Prisma.AttendanceUncheckedCreateWithoutScheduleInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const AttendanceUncheckedCreateWithoutScheduleInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
