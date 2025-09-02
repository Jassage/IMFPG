import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StudentScalarRelationFilterObjectSchema } from './StudentScalarRelationFilter.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { ScheduleScalarRelationFilterObjectSchema } from './ScheduleScalarRelationFilter.schema';
import { ScheduleWhereInputObjectSchema } from './ScheduleWhereInput.schema'

export const AttendanceWhereInputObjectSchema: z.ZodType<Prisma.AttendanceWhereInput, z.ZodTypeDef, Prisma.AttendanceWhereInput> = z.object({
  AND: z.union([z.lazy(() => AttendanceWhereInputObjectSchema), z.lazy(() => AttendanceWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AttendanceWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AttendanceWhereInputObjectSchema), z.lazy(() => AttendanceWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  scheduleId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  schedule: z.union([z.lazy(() => ScheduleScalarRelationFilterObjectSchema), z.lazy(() => ScheduleWhereInputObjectSchema)]).optional()
}).strict();
export const AttendanceWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => AttendanceWhereInputObjectSchema), z.lazy(() => AttendanceWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AttendanceWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AttendanceWhereInputObjectSchema), z.lazy(() => AttendanceWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  scheduleId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  schedule: z.union([z.lazy(() => ScheduleScalarRelationFilterObjectSchema), z.lazy(() => ScheduleWhereInputObjectSchema)]).optional()
}).strict();
