import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { FacultyLevelUncheckedUpdateManyWithoutFacultyNestedInputObjectSchema } from './FacultyLevelUncheckedUpdateManyWithoutFacultyNestedInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutFacultyNestedInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutFacultyNestedInput.schema';
import { EnrollmentUncheckedUpdateManyWithoutFacultyNestedInputObjectSchema } from './EnrollmentUncheckedUpdateManyWithoutFacultyNestedInput.schema'

export const FacultyUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.FacultyUncheckedUpdateInput, z.ZodTypeDef, Prisma.FacultyUncheckedUpdateInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  dean: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  studentsCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  coursesCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  studyDuration: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  levels: z.lazy(() => FacultyLevelUncheckedUpdateManyWithoutFacultyNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutFacultyNestedInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedUpdateManyWithoutFacultyNestedInputObjectSchema).optional()
}).strict();
export const FacultyUncheckedUpdateInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  dean: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  studentsCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  coursesCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  studyDuration: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  levels: z.lazy(() => FacultyLevelUncheckedUpdateManyWithoutFacultyNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutFacultyNestedInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedUpdateManyWithoutFacultyNestedInputObjectSchema).optional()
}).strict();
