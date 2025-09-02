import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelCreateNestedManyWithoutFacultyInputObjectSchema } from './FacultyLevelCreateNestedManyWithoutFacultyInput.schema';
import { CourseAssignmentCreateNestedManyWithoutFacultyInputObjectSchema } from './CourseAssignmentCreateNestedManyWithoutFacultyInput.schema'

export const FacultyCreateWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.FacultyCreateWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.FacultyCreateWithoutEnrollmentsInput> = z.object({
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
  levels: z.lazy(() => FacultyLevelCreateNestedManyWithoutFacultyInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutFacultyInputObjectSchema).optional()
}).strict();
export const FacultyCreateWithoutEnrollmentsInputObjectZodSchema = z.object({
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
  levels: z.lazy(() => FacultyLevelCreateNestedManyWithoutFacultyInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutFacultyInputObjectSchema).optional()
}).strict();
