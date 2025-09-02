import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentUncheckedCreateNestedManyWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUncheckedCreateNestedManyWithoutFacultyLevelInput.schema'

export const FacultyLevelUncheckedCreateInputObjectSchema: z.ZodType<Prisma.FacultyLevelUncheckedCreateInput, z.ZodTypeDef, Prisma.FacultyLevelUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  facultyId: z.string(),
  level: z.string().max(10),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutFacultyLevelInputObjectSchema).optional()
}).strict();
export const FacultyLevelUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  facultyId: z.string(),
  level: z.string().max(10),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutFacultyLevelInputObjectSchema).optional()
}).strict();
