import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateNestedManyWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentCreateNestedManyWithoutFacultyLevelInput.schema'

export const FacultyLevelCreateWithoutFacultyInputObjectSchema: z.ZodType<Prisma.FacultyLevelCreateWithoutFacultyInput, z.ZodTypeDef, Prisma.FacultyLevelCreateWithoutFacultyInput> = z.object({
  id: z.string().optional(),
  level: z.string().max(10),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutFacultyLevelInputObjectSchema).optional()
}).strict();
export const FacultyLevelCreateWithoutFacultyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  level: z.string().max(10),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutFacultyLevelInputObjectSchema).optional()
}).strict();
