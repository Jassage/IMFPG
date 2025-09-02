import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema'

export const AttendanceScalarWhereInputObjectSchema: z.ZodType<Prisma.AttendanceScalarWhereInput, z.ZodTypeDef, Prisma.AttendanceScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => AttendanceScalarWhereInputObjectSchema), z.lazy(() => AttendanceScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AttendanceScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AttendanceScalarWhereInputObjectSchema), z.lazy(() => AttendanceScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  scheduleId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
export const AttendanceScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => AttendanceScalarWhereInputObjectSchema), z.lazy(() => AttendanceScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AttendanceScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AttendanceScalarWhereInputObjectSchema), z.lazy(() => AttendanceScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  scheduleId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
