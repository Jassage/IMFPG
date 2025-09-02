import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { AttendanceUncheckedCreateNestedManyWithoutScheduleInputObjectSchema } from './AttendanceUncheckedCreateNestedManyWithoutScheduleInput.schema'

import { JsonValueSchema as jsonSchema } from './helpers/json-helpers';

export const ScheduleUncheckedCreateWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.ScheduleUncheckedCreateWithoutProfesseurInput, z.ZodTypeDef, Prisma.ScheduleUncheckedCreateWithoutProfesseurInput> = z.object({
  id: z.string().optional(),
  assignmentId: z.string(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().nullish(),
  recurrence: z.string().nullish(),
  exceptions: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  attendances: z.lazy(() => AttendanceUncheckedCreateNestedManyWithoutScheduleInputObjectSchema).optional()
}).strict();
export const ScheduleUncheckedCreateWithoutProfesseurInputObjectZodSchema = z.object({
  id: z.string().optional(),
  assignmentId: z.string(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().nullish(),
  recurrence: z.string().nullish(),
  exceptions: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  attendances: z.lazy(() => AttendanceUncheckedCreateNestedManyWithoutScheduleInputObjectSchema).optional()
}).strict();
