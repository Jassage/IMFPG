import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StudentUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema } from './StudentUpdateOneRequiredWithoutAttendancesNestedInput.schema'

export const AttendanceUpdateWithoutScheduleInputObjectSchema: z.ZodType<Prisma.AttendanceUpdateWithoutScheduleInput, z.ZodTypeDef, Prisma.AttendanceUpdateWithoutScheduleInput> = z.object({
  date: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema).optional()
}).strict();
export const AttendanceUpdateWithoutScheduleInputObjectZodSchema = z.object({
  date: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema).optional()
}).strict();
