import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { CourseAssignmentCreateNestedOneWithoutSchedulesInputObjectSchema } from './CourseAssignmentCreateNestedOneWithoutSchedulesInput.schema';
import { ProfesseurCreateNestedOneWithoutSchedulesInputObjectSchema } from './ProfesseurCreateNestedOneWithoutSchedulesInput.schema'

import { JsonValueSchema as jsonSchema } from './helpers/json-helpers';

export const ScheduleCreateWithoutAttendancesInputObjectSchema: z.ZodType<Prisma.ScheduleCreateWithoutAttendancesInput, z.ZodTypeDef, Prisma.ScheduleCreateWithoutAttendancesInput> = z.object({
  id: z.string().optional(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().nullish(),
  recurrence: z.string().nullish(),
  exceptions: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  assignment: z.lazy(() => CourseAssignmentCreateNestedOneWithoutSchedulesInputObjectSchema),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutSchedulesInputObjectSchema).optional()
}).strict();
export const ScheduleCreateWithoutAttendancesInputObjectZodSchema = z.object({
  id: z.string().optional(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().nullish(),
  recurrence: z.string().nullish(),
  exceptions: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  assignment: z.lazy(() => CourseAssignmentCreateNestedOneWithoutSchedulesInputObjectSchema),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutSchedulesInputObjectSchema).optional()
}).strict();
