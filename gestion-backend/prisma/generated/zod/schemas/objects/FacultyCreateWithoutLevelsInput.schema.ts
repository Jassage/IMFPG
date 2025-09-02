import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateNestedManyWithoutFacultyInputObjectSchema } from './CourseAssignmentCreateNestedManyWithoutFacultyInput.schema';
import { EnrollmentCreateNestedManyWithoutFacultyInputObjectSchema } from './EnrollmentCreateNestedManyWithoutFacultyInput.schema'

export const FacultyCreateWithoutLevelsInputObjectSchema: z.ZodType<Prisma.FacultyCreateWithoutLevelsInput, z.ZodTypeDef, Prisma.FacultyCreateWithoutLevelsInput> = z.object({
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
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutFacultyInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentCreateNestedManyWithoutFacultyInputObjectSchema).optional()
}).strict();
export const FacultyCreateWithoutLevelsInputObjectZodSchema = z.object({
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
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutFacultyInputObjectSchema).optional(),
  enrollments: z.lazy(() => EnrollmentCreateNestedManyWithoutFacultyInputObjectSchema).optional()
}).strict();
