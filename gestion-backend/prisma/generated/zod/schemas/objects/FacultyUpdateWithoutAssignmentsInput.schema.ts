import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { FacultyLevelUpdateManyWithoutFacultyNestedInputObjectSchema } from './FacultyLevelUpdateManyWithoutFacultyNestedInput.schema';
import { EnrollmentUpdateManyWithoutFacultyNestedInputObjectSchema } from './EnrollmentUpdateManyWithoutFacultyNestedInput.schema'

export const FacultyUpdateWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyUpdateWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyUpdateWithoutAssignmentsInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  dean: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  studentsCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  coursesCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  studyDuration: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  levels: z.lazy(() => FacultyLevelUpdateManyWithoutFacultyNestedInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUpdateManyWithoutFacultyNestedInputObjectSchema).optional()
}).strict();
export const FacultyUpdateWithoutAssignmentsInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  dean: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  studentsCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  coursesCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  studyDuration: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  levels: z.lazy(() => FacultyLevelUpdateManyWithoutFacultyNestedInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUpdateManyWithoutFacultyNestedInputObjectSchema).optional()
}).strict();
