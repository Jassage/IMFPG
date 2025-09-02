import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelNestedInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelNestedInput.schema'

export const FacultyLevelUncheckedUpdateWithoutFacultyInputObjectSchema: z.ZodType<Prisma.FacultyLevelUncheckedUpdateWithoutFacultyInput, z.ZodTypeDef, Prisma.FacultyLevelUncheckedUpdateWithoutFacultyInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelNestedInputObjectSchema).optional()
}).strict();
export const FacultyLevelUncheckedUpdateWithoutFacultyInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelNestedInputObjectSchema).optional()
}).strict();
