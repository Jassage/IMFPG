import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateNestedOneWithoutAttendancesInputObjectSchema } from './StudentCreateNestedOneWithoutAttendancesInput.schema';
import { ScheduleCreateNestedOneWithoutAttendancesInputObjectSchema } from './ScheduleCreateNestedOneWithoutAttendancesInput.schema'

export const AttendanceCreateInputObjectSchema: z.ZodType<Prisma.AttendanceCreateInput, z.ZodTypeDef, Prisma.AttendanceCreateInput> = z.object({
  id: z.string().optional(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutAttendancesInputObjectSchema),
  schedule: z.lazy(() => ScheduleCreateNestedOneWithoutAttendancesInputObjectSchema)
}).strict();
export const AttendanceCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  status: z.string(),
  notes: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutAttendancesInputObjectSchema),
  schedule: z.lazy(() => ScheduleCreateNestedOneWithoutAttendancesInputObjectSchema)
}).strict();
