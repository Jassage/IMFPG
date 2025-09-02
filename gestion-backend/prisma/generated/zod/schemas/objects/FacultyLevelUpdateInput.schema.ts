import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { FacultyUpdateOneRequiredWithoutLevelsNestedInputObjectSchema } from './FacultyUpdateOneRequiredWithoutLevelsNestedInput.schema';
import { CourseAssignmentUpdateManyWithoutFacultyLevelNestedInputObjectSchema } from './CourseAssignmentUpdateManyWithoutFacultyLevelNestedInput.schema'

export const FacultyLevelUpdateInputObjectSchema: z.ZodType<Prisma.FacultyLevelUpdateInput, z.ZodTypeDef, Prisma.FacultyLevelUpdateInput> = z.object({
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutLevelsNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUpdateManyWithoutFacultyLevelNestedInputObjectSchema).optional()
}).strict();
export const FacultyLevelUpdateInputObjectZodSchema = z.object({
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutLevelsNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUpdateManyWithoutFacultyLevelNestedInputObjectSchema).optional()
}).strict();
