import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema'

export const ScheduleScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ScheduleScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.ScheduleScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => ScheduleScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ScheduleScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScheduleScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScheduleScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ScheduleScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  assignmentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  dayOfWeek: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  startTime: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  endTime: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  classroom: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  recurrence: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  exceptions: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  professeurId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish()
}).strict();
export const ScheduleScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => ScheduleScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ScheduleScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ScheduleScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ScheduleScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ScheduleScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  assignmentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  dayOfWeek: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  startTime: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  endTime: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  classroom: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  recurrence: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish(),
  exceptions: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  professeurId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).nullish()
}).strict();
