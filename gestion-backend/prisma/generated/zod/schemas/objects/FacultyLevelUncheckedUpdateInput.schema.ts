import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelNestedInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelNestedInput.schema'

export const FacultyLevelUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.FacultyLevelUncheckedUpdateInput, z.ZodTypeDef, Prisma.FacultyLevelUncheckedUpdateInput> = z.object({
  facultyId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelNestedInputObjectSchema).optional()
}).strict();
export const FacultyLevelUncheckedUpdateInputObjectZodSchema = z.object({
  facultyId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelNestedInputObjectSchema).optional()
}).strict();
