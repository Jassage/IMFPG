import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { ProfesseurCreateNestedOneWithoutSchedulesInputObjectSchema } from './ProfesseurCreateNestedOneWithoutSchedulesInput.schema';
import { AttendanceCreateNestedManyWithoutScheduleInputObjectSchema } from './AttendanceCreateNestedManyWithoutScheduleInput.schema'

import { JsonValueSchema as jsonSchema } from './helpers/json-helpers';

export const ScheduleCreateWithoutAssignmentInputObjectSchema: z.ZodType<Prisma.ScheduleCreateWithoutAssignmentInput, z.ZodTypeDef, Prisma.ScheduleCreateWithoutAssignmentInput> = z.object({
  id: z.string().optional(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().nullish(),
  recurrence: z.string().nullish(),
  exceptions: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutSchedulesInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceCreateNestedManyWithoutScheduleInputObjectSchema).optional()
}).strict();
export const ScheduleCreateWithoutAssignmentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().nullish(),
  recurrence: z.string().nullish(),
  exceptions: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutSchedulesInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceCreateNestedManyWithoutScheduleInputObjectSchema).optional()
}).strict();
