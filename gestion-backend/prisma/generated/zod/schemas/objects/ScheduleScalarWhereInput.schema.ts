import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const ScheduleScalarWhereInputObjectSchema: z.ZodType<Prisma.ScheduleScalarWhereInput, z.ZodTypeDef, Prisma.ScheduleScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => ScheduleScalarWhereInputObjectSchema), z.lazy(() => ScheduleScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScheduleScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScheduleScalarWhereInputObjectSchema), z.lazy(() => ScheduleScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  assignmentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  dayOfWeek: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  startTime: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  endTime: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  classroom: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  recurrence: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  exceptions: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  professeurId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
export const ScheduleScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => ScheduleScalarWhereInputObjectSchema), z.lazy(() => ScheduleScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScheduleScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScheduleScalarWhereInputObjectSchema), z.lazy(() => ScheduleScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  assignmentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  dayOfWeek: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  startTime: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  endTime: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  classroom: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  recurrence: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  exceptions: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  professeurId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional()
}).strict();
