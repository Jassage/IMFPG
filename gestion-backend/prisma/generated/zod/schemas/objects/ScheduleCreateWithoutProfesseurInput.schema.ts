import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { CourseAssignmentCreateNestedOneWithoutSchedulesInputObjectSchema } from './CourseAssignmentCreateNestedOneWithoutSchedulesInput.schema';
import { AttendanceCreateNestedManyWithoutScheduleInputObjectSchema } from './AttendanceCreateNestedManyWithoutScheduleInput.schema'

import { JsonValueSchema as jsonSchema } from './helpers/json-helpers';

export const ScheduleCreateWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.ScheduleCreateWithoutProfesseurInput, z.ZodTypeDef, Prisma.ScheduleCreateWithoutProfesseurInput> = z.object({
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
  attendances: z.lazy(() => AttendanceCreateNestedManyWithoutScheduleInputObjectSchema).optional()
}).strict();
export const ScheduleCreateWithoutProfesseurInputObjectZodSchema = z.object({
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
  attendances: z.lazy(() => AttendanceCreateNestedManyWithoutScheduleInputObjectSchema).optional()
}).strict();
