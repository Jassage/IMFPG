import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { EnumUserStatusFieldUpdateOperationsInputObjectSchema } from './EnumUserStatusFieldUpdateOperationsInput.schema';
import { UserUpdateOneWithoutProfesseurNestedInputObjectSchema } from './UserUpdateOneWithoutProfesseurNestedInput.schema';
import { CourseAssignmentUpdateManyWithoutProfesseurNestedInputObjectSchema } from './CourseAssignmentUpdateManyWithoutProfesseurNestedInput.schema';
import { GradeUpdateManyWithoutProfesseurNestedInputObjectSchema } from './GradeUpdateManyWithoutProfesseurNestedInput.schema'

export const ProfesseurUpdateWithoutSchedulesInputObjectSchema: z.ZodType<Prisma.ProfesseurUpdateWithoutSchedulesInput, z.ZodTypeDef, Prisma.ProfesseurUpdateWithoutSchedulesInput> = z.object({
  firstName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  lastName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  phone: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  department: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  office: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  hireDate: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([UserStatusSchema, z.lazy(() => EnumUserStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  speciality: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  user: z.lazy(() => UserUpdateOneWithoutProfesseurNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUpdateManyWithoutProfesseurNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUpdateManyWithoutProfesseurNestedInputObjectSchema).optional()
}).strict();
export const ProfesseurUpdateWithoutSchedulesInputObjectZodSchema = z.object({
  firstName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  lastName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  phone: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  department: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  office: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  hireDate: z.union([z.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([UserStatusSchema, z.lazy(() => EnumUserStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  speciality: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  user: z.lazy(() => UserUpdateOneWithoutProfesseurNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUpdateManyWithoutProfesseurNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUpdateManyWithoutProfesseurNestedInputObjectSchema).optional()
}).strict();
