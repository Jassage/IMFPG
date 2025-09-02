import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { CourseAssignmentUpdateManyWithoutFacultyLevelNestedInputObjectSchema } from './CourseAssignmentUpdateManyWithoutFacultyLevelNestedInput.schema'

export const FacultyLevelUpdateWithoutFacultyInputObjectSchema: z.ZodType<Prisma.FacultyLevelUpdateWithoutFacultyInput, z.ZodTypeDef, Prisma.FacultyLevelUpdateWithoutFacultyInput> = z.object({
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  assignments: z.lazy(() => CourseAssignmentUpdateManyWithoutFacultyLevelNestedInputObjectSchema).optional()
}).strict();
export const FacultyLevelUpdateWithoutFacultyInputObjectZodSchema = z.object({
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  assignments: z.lazy(() => CourseAssignmentUpdateManyWithoutFacultyLevelNestedInputObjectSchema).optional()
}).strict();
