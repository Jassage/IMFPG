import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StudentUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema } from './StudentUpdateOneRequiredWithoutAttendancesNestedInput.schema';
import { ScheduleUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema } from './ScheduleUpdateOneRequiredWithoutAttendancesNestedInput.schema'

export const AttendanceUpdateInputObjectSchema: z.ZodType<Prisma.AttendanceUpdateInput, z.ZodTypeDef, Prisma.AttendanceUpdateInput> = z.object({
  date: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema).optional(),
  schedule: z.lazy(() => ScheduleUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema).optional()
}).strict();
export const AttendanceUpdateInputObjectZodSchema = z.object({
  date: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema).optional(),
  schedule: z.lazy(() => ScheduleUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema).optional()
}).strict();
