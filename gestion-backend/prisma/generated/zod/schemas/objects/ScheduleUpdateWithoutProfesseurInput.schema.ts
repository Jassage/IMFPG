import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { CourseAssignmentUpdateOneRequiredWithoutSchedulesNestedInputObjectSchema } from './CourseAssignmentUpdateOneRequiredWithoutSchedulesNestedInput.schema';
import { AttendanceUpdateManyWithoutScheduleNestedInputObjectSchema } from './AttendanceUpdateManyWithoutScheduleNestedInput.schema'

import { JsonValueSchema as jsonSchema } from './helpers/json-helpers';

export const ScheduleUpdateWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.ScheduleUpdateWithoutProfesseurInput, z.ZodTypeDef, Prisma.ScheduleUpdateWithoutProfesseurInput> = z.object({
  dayOfWeek: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  startTime: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  endTime: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  classroom: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  recurrence: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  exceptions: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  assignment: z.lazy(() => CourseAssignmentUpdateOneRequiredWithoutSchedulesNestedInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceUpdateManyWithoutScheduleNestedInputObjectSchema).optional()
}).strict();
export const ScheduleUpdateWithoutProfesseurInputObjectZodSchema = z.object({
  dayOfWeek: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  startTime: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  endTime: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  classroom: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  recurrence: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  exceptions: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  assignment: z.lazy(() => CourseAssignmentUpdateOneRequiredWithoutSchedulesNestedInputObjectSchema).optional(),
  attendances: z.lazy(() => AttendanceUpdateManyWithoutScheduleNestedInputObjectSchema).optional()
}).strict();
