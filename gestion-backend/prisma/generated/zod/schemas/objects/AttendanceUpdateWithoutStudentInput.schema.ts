import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { ScheduleUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema } from './ScheduleUpdateOneRequiredWithoutAttendancesNestedInput.schema'

export const AttendanceUpdateWithoutStudentInputObjectSchema: z.ZodType<Prisma.AttendanceUpdateWithoutStudentInput, z.ZodTypeDef, Prisma.AttendanceUpdateWithoutStudentInput> = z.object({
  date: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  schedule: z.lazy(() => ScheduleUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema).optional()
}).strict();
export const AttendanceUpdateWithoutStudentInputObjectZodSchema = z.object({
  date: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  schedule: z.lazy(() => ScheduleUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema).optional()
}).strict();
