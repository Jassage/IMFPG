import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { EnumUserStatusFieldUpdateOperationsInputObjectSchema } from './EnumUserStatusFieldUpdateOperationsInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutProfesseurNestedInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutProfesseurNestedInput.schema';
import { ScheduleUncheckedUpdateManyWithoutProfesseurNestedInputObjectSchema } from './ScheduleUncheckedUpdateManyWithoutProfesseurNestedInput.schema';
import { GradeUncheckedUpdateManyWithoutProfesseurNestedInputObjectSchema } from './GradeUncheckedUpdateManyWithoutProfesseurNestedInput.schema'

export const ProfesseurUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.ProfesseurUncheckedUpdateInput, z.ZodTypeDef, Prisma.ProfesseurUncheckedUpdateInput> = z.object({
  firstName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  lastName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  phone: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  department: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  office: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  hireDate: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([UserStatusSchema, z.lazy(() => EnumUserStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  speciality: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  userId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutProfesseurNestedInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleUncheckedUpdateManyWithoutProfesseurNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedUpdateManyWithoutProfesseurNestedInputObjectSchema).optional()
}).strict();
export const ProfesseurUncheckedUpdateInputObjectZodSchema = z.object({
  firstName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  lastName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  phone: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  department: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  office: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  hireDate: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([UserStatusSchema, z.lazy(() => EnumUserStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  speciality: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  userId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutProfesseurNestedInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleUncheckedUpdateManyWithoutProfesseurNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedUpdateManyWithoutProfesseurNestedInputObjectSchema).optional()
}).strict();
