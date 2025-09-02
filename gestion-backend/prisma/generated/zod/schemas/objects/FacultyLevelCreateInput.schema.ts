import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyCreateNestedOneWithoutLevelsInputObjectSchema } from './FacultyCreateNestedOneWithoutLevelsInput.schema';
import { CourseAssignmentCreateNestedManyWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentCreateNestedManyWithoutFacultyLevelInput.schema'

export const FacultyLevelCreateInputObjectSchema: z.ZodType<Prisma.FacultyLevelCreateInput, z.ZodTypeDef, Prisma.FacultyLevelCreateInput> = z.object({
  id: z.string().optional(),
  level: z.string().max(10),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutLevelsInputObjectSchema),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutFacultyLevelInputObjectSchema).optional()
}).strict();
export const FacultyLevelCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  level: z.string().max(10),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutLevelsInputObjectSchema),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutFacultyLevelInputObjectSchema).optional()
}).strict();
