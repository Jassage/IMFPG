import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentUncheckedCreateNestedManyWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUncheckedCreateNestedManyWithoutFacultyLevelInput.schema'

export const FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema: z.ZodType<Prisma.FacultyLevelUncheckedCreateWithoutFacultyInput, z.ZodTypeDef, Prisma.FacultyLevelUncheckedCreateWithoutFacultyInput> = z.object({
  id: z.string().optional(),
  level: z.string(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutFacultyLevelInputObjectSchema).optional()
}).strict();
export const FacultyLevelUncheckedCreateWithoutFacultyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  level: z.string(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutFacultyLevelInputObjectSchema).optional()
}).strict();
