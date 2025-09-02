import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentUncheckedCreateNestedManyWithoutFacultyInputObjectSchema } from './CourseAssignmentUncheckedCreateNestedManyWithoutFacultyInput.schema';
import { EnrollmentUncheckedCreateNestedManyWithoutFacultyInputObjectSchema } from './EnrollmentUncheckedCreateNestedManyWithoutFacultyInput.schema'

export const FacultyUncheckedCreateWithoutLevelsInputObjectSchema: z.ZodType<Prisma.FacultyUncheckedCreateWithoutLevelsInput, z.ZodTypeDef, Prisma.FacultyUncheckedCreateWithoutLevelsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullish(),
  dean: z.string().nullish(),
  studentsCount: z.number().int().optional(),
  coursesCount: z.number().int().optional(),
  studyDuration: z.number().int(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutFacultyInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedCreateNestedManyWithoutFacultyInputObjectSchema).optional()
}).strict();
export const FacultyUncheckedCreateWithoutLevelsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullish(),
  dean: z.string().nullish(),
  studentsCount: z.number().int().optional(),
  coursesCount: z.number().int().optional(),
  studyDuration: z.number().int(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutFacultyInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentUncheckedCreateNestedManyWithoutFacultyInputObjectSchema).optional()
}).strict();
