import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateNestedOneWithoutAttendancesInputObjectSchema } from './StudentCreateNestedOneWithoutAttendancesInput.schema'

export const AttendanceCreateWithoutScheduleInputObjectSchema: z.ZodType<Prisma.AttendanceCreateWithoutScheduleInput, z.ZodTypeDef, Prisma.AttendanceCreateWithoutScheduleInput> = z.object({
  id: z.string().optional(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutAttendancesInputObjectSchema)
}).strict();
export const AttendanceCreateWithoutScheduleInputObjectZodSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutAttendancesInputObjectSchema)
}).strict();
