import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from './helpers/json-helpers';

export const ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema: z.ZodType<Prisma.ScheduleUncheckedCreateWithoutAttendancesInput, z.ZodTypeDef, Prisma.ScheduleUncheckedCreateWithoutAttendancesInput> = z.object({
  id: z.string().optional(),
  assignmentId: z.string(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().nullish(),
  recurrence: z.string().nullish(),
  exceptions: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  professeurId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const ScheduleUncheckedCreateWithoutAttendancesInputObjectZodSchema = z.object({
  id: z.string().optional(),
  assignmentId: z.string(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  classroom: z.string().nullish(),
  recurrence: z.string().nullish(),
  exceptions: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  professeurId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
