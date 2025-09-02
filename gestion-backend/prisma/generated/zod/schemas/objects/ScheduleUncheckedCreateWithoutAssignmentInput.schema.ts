import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { AttendanceUncheckedCreateNestedManyWithoutScheduleInputObjectSchema } from './AttendanceUncheckedCreateNestedManyWithoutScheduleInput.schema'

import { JsonValueSchema as jsonSchema } from './helpers/json-helpers';

export const ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema: z.ZodType<Prisma.ScheduleUncheckedCreateWithoutAssignmentInput, z.ZodTypeDef, Prisma.ScheduleUncheckedCreateWithoutAssignmentInput> = z.object({
  id: z.string().optional(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().nullish(),
  recurrence: z.string().nullish(),
  exceptions: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  professeurId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  attendances: z.lazy(() => AttendanceUncheckedCreateNestedManyWithoutScheduleInputObjectSchema).optional()
}).strict();
export const ScheduleUncheckedCreateWithoutAssignmentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().nullish(),
  recurrence: z.string().nullish(),
  exceptions: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  professeurId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  attendances: z.lazy(() => AttendanceUncheckedCreateNestedManyWithoutScheduleInputObjectSchema).optional()
}).strict();
