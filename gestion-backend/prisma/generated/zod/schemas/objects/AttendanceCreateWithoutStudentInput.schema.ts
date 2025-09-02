import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleCreateNestedOneWithoutAttendancesInputObjectSchema } from './ScheduleCreateNestedOneWithoutAttendancesInput.schema'

export const AttendanceCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.AttendanceCreateWithoutStudentInput, z.ZodTypeDef, Prisma.AttendanceCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  schedule: z.lazy(() => ScheduleCreateNestedOneWithoutAttendancesInputObjectSchema)
}).strict();
export const AttendanceCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  schedule: z.lazy(() => ScheduleCreateNestedOneWithoutAttendancesInputObjectSchema)
}).strict();
