import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AttendanceUncheckedCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.AttendanceUncheckedCreateWithoutStudentInput, z.ZodTypeDef, Prisma.AttendanceUncheckedCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  scheduleId: z.string(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const AttendanceUncheckedCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  scheduleId: z.string(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
